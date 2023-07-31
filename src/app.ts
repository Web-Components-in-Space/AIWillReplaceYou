import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';

import { render, loadGenAIImage, createFinalOutput } from "./utils";
import { State, StateMachine } from './states';

import './promptinput';
import { PromptEvent, PromptInput } from './promptinput';
import 'bodysegmentation-video';
import './countdowntimer';
import { BodySegmentationVideo, SegmentationEvent } from 'bodysegmentation-video';
import { transitionStyles } from './transitions.css.js';
import { appStyles } from './app.css.js';
import { CountDownTimer } from './countdowntimer';
import { animations } from "./animations.css";
import { pushToS3 } from "./utils/upload";

// @ts-ignore
import environment from '/environment.js';

console.log(environment);

@customElement('replaceyou-app')
export class App extends LitElement {
  static override styles = [appStyles, transitionStyles, animations];

  @property( {attribute: true, reflect: true})
  protected state?: string;

  @property( {attribute: true, reflect: true})
  protected transition?: string;

  @property( {attribute: true, reflect: true})
  protected transitionState?: string;

  @property( {attribute: true, reflect: true})
  protected transitionFrom?: string;

  @property( {attribute: true, reflect: true})
  protected transitionTo?: string;

  @property( {attribute: true, reflect: true})
  protected transitionDirection?: string;

  @property( {attribute: true, reflect: true})
  protected stateDirection?: string;

  @property( {attribute: true, reflect: true, type: Boolean})
  protected debug = false;

  @query('replaceyou-promptinput')
  protected promptInput?: PromptInput;

  @query('bodysegmentation-video')
  protected video?: BodySegmentationVideo;

  @query('replaceyou-countdown-timer')
  protected timer?: CountDownTimer;

  @property()
  protected statusMessage = '';

  protected imageFill?: OffscreenCanvas;

  protected lastMask?: ImageData;

  protected silentTimer?: number;

  protected stateMachine = new StateMachine(
    this.onStateChange.bind(this),
    this.onTransition.bind(this));

  protected keysPressed: {[key: string]: boolean } = {};

  protected onStateChange(state: State, isTransitioningIn: boolean) {
    this.state = state.id;

    if (this.silentTimer) {
      window.clearTimeout(this.silentTimer);
    }
    if (state.silentTimer && !isTransitioningIn) {
      this.silentTimer = window.setTimeout(() => {
        if (state.silentTimerAction) {
          state.silentTimerAction.apply(this.stateMachine);
        }
      }, state.silentTimer * 1000);
    }
    switch (state.id) {
      case 'attract':
        break;

      case 'prompt':
        break;

      case 'validate':
        if (!isTransitioningIn) {
          this.timer?.start();
        }
        break;

      case 'generate':
        if (!isTransitioningIn) {
          loadGenAIImage(this.stateMachine.currentPrompt).then((fill) => {
            this.imageFill = fill;
            this.stateMachine.next();
          });
        }
        break;

      case 'pose':
        if (!isTransitioningIn) {
          this.timer?.start();
        } else {
          this.timer?.reset();
        }
        break;

      case 'preview':
        if (isTransitioningIn) {
          const startTime = new Date('July 29 2023');
          const now = new Date();
          this.stateMachine.currentFilename = Math.floor((Number(now) - Number(startTime)) / 1000).toString(16);
        }
        if (!isTransitioningIn && this.video?.canvas) {
          this.video.canvas.toBlob( (data ) => {
            if (data) {
              pushToS3(data, `${this.stateMachine.currentFilename}.jpg`);
            }
          })
        }
        break;

      case 'end':
        if (!isTransitioningIn) {
          this.imageFill = undefined;
          this.video?.canvasContext?.clearRect(0, 0, this.video?.videoBounds.width, this.video?.videoBounds.height);
          this.stateMachine.goNamedState('attract');
        }
        break;

      case 'inputerror':
        if (state.silentTimer && !isTransitioningIn) {
          window.setTimeout(() => {
            if (state.silentTimerAction) {
              state.silentTimerAction.apply(this.stateMachine);
            }
          }, state.silentTimer * 1000);
        }
        break;
    }
    this.requestUpdate();
  }

  protected onTransition(type: 'in' | 'out' | 'complete', state: string, details: { from: string, to: string, direction: number}) {
    if (type === 'complete') {
      this.transition = undefined;
      this.transitionState = undefined;
      this.transitionFrom = undefined;
      this.transitionTo = undefined;
      this.transitionDirection = undefined;
    } else {
      this.transition = type;
      this.transitionState = state;
      this.transitionFrom = details.from;
      this.transitionTo = details.to;
      this.transitionDirection = details.direction > 0 ? 'forward' : 'backward';
    }
  }

  protected onTrigger(action: 'up' | 'down') {
    if (this.transition) {
      return;
    }
    switch (this.stateMachine.currentState.id) {
      case 'attract':
        if (action === 'up') {
          this.stateMachine.next();
        }
        break;

      case 'prompt':
        this.promptInput?.trigger(action);
        break;

      case 'validate':
        if (action === 'up') {
          this.timer?.reset();
          this.promptInput?.reset();
          this.stateMachine.back();
        }
        break;

      case 'generate':
        break;

      case 'pose':
        break;

      case 'preview':
        break;

      case 'inputerror':
        break;
    }
    this.requestUpdate();
  }

  async onSegment(event: SegmentationEvent) {
    const segmenter = event.target as BodySegmentationVideo;
    const maskImg = await event.toBinaryMask(
      {r:0, g:0, b:0, a: 0},
      {r:0, g:0, b:0, a: 255},
      true, .1);
    this.lastMask = maskImg;
    if (segmenter.canvasContext) {
      const texture = this.stateMachine.currentState.name === 'generate image' ? undefined : this.imageFill;
      render(segmenter.canvasContext, segmenter.videoElement, maskImg, texture, segmenter.videoBounds);
    }
  }

  async onPrompt(event: PromptEvent) {
    if (!event.prompt) {
      await this.stateMachine.goNamedState('inputerror');
    } else {
      this.stateMachine.currentPrompt = event.prompt as string;
      await this.stateMachine.next();
    }
  }

  async onCountdownComplete() {
    await this.stateMachine.next();
  }

  onUpdateCountdownTimer(event: Event) {
    if ((event.target as CountDownTimer).currentTime > 0) {
      this.stateMachine.countdownSeconds = (event.target as CountDownTimer).currentTime;
      this.requestUpdate();
    }
  }

  constructor() {
    super();
    document.addEventListener('keydown', (event) => {
      if (event.key === ' ' && !this.keysPressed[event.key]) {
        this.keysPressed[event.key] = true;
        this.onTrigger('down');
      }
    });
    document.addEventListener('keyup', (event) => {
      delete this.keysPressed[event.key];
      if (event.key === ' ') {
        this.onTrigger('up');
      }

      if (event.key === 'c' && this.video?.videoElement && this.lastMask) {
        // Debug one time render to download
        loadGenAIImage(this.stateMachine.currentPrompt, 250).then((fill) => {
          createFinalOutput(this.video?.videoElement as HTMLVideoElement, this.lastMask as ImageData, fill as OffscreenCanvas);
        });
      }

      if (event.key === 'd') {
        this.debug = !this.debug;
      }
    });
  }

  override render() {
    const state = this.stateMachine.currentState;
    const classes = { isLoading: state.id === 'generate' };
    return html`
      <bodysegmentation-video 
            ?hidevideo=${state.hideVideo} 
            ?active=${state.segmentationActive} 
            useCamera
            @onSegment=${this.onSegment}>
        <div id="loading-bg" class=${classMap(classes)}></div>
      </bodysegmentation-video>
      
      ${state.inputPromptActive ? html`<replaceyou-promptinput
        waitingplaceholder="Press and hold the button to speak..."
        activeplaceholder="Speak into the mic, and stop pressing when finished"
        @onPromptInput=${this.onPrompt}></replaceyou-promptinput>` : undefined}

      ${state.useCountdown ? html`<replaceyou-countdown-timer 
        seconds=${state.useCountdown} 
        message=${state.countdownMessage}
        @onUpdate=${this.onUpdateCountdownTimer}
        @onComplete=${this.onCountdownComplete}></replaceyou-countdown-timer>` : undefined}

      ${state.id === 'attract' ? html`
        <div id="logo">
          <img src="/assets/logo.png">
          <span>Press the button to begin...</span>
        </div>
        <div id="logo2">
          <img src="/assets/logo.png">
          <span>&nbsp;</span>
        </div>` : undefined}
      
      <div id="status" ?hide=${!state.showStatus}>
        <span>${unsafeHTML(state.getStatusMessage())}</span>
      </div>

      <div id="transition"></div>

      <div id="statedebug"><h1>${state.name}</h1>
        ${this.transition ? html`<p>
          Transition type: ${this.transition} <br/> 
          Transition state: ${this.transitionState} <br/>
          Transition direction: ${this.transitionDirection} <br/>
        </p>` : undefined}
        <pre>${JSON.stringify(state, null, 2)}</pre>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'replaceyou-app': App;
  }
}