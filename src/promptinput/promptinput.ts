import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { PromptEvent } from "./promptevent";

@customElement('replaceyou-promptinput')
export class PromptInput extends LitElement {
  static override styles = css`
    :host {
      border-radius: 10px;
      padding: 5px;
      border-style: solid;
      border-width: 3px;
      border-color: transparent;
    }

    @keyframes border-pulse {
      0% {
        border-color: rgba(255,0,236,.75);
      }
      100% {
        border-color: rgba(111,45,253,.75);
      }
    }
    
    :host([hasspeech]) span {
      opacity: 1;
    }
    
    :host([listening]) {
      animation: border-pulse infinite 1s;
    }
    
    span {
      border-radius: 10px;
      background-image: var(--gradient);
      text-align: center;
      font-weight: bolder;
      display: block;
      color: white;
      padding: 20px;
    }
  `;

  @property({ attribute: true, reflect: true })
  public prompt?: string;

  @property({ attribute: true, reflect: true })
  public waitingplaceholder?: string;

  @property({ attribute: true, reflect: true })
  public activeplaceholder?: string;

  @property({ attribute: true, reflect: true, type: Boolean })
  public listening = false;

  @property({ attribute: true, reflect: true, type: Boolean })
  public fetching = false;

  @property({ attribute: true, reflect: true, type: Boolean })
  public hasSpeech = false;

  @property()
  protected interimTranscript = '';

  protected speech?: SpeechRecognition;

  public trigger(action: 'up' | 'down') {
    if (action === 'up') {
      this.finishSpeechRecognition();
    } else {
      this.startSpeechRecognition();
    }
  }

  public reset() {
    this.speech?.stop();
    this.hasSpeech = false;
    this.fetching = false;
    this.speech = undefined;
    this.prompt = undefined;
    this.listening = false;
  }

  override render() {
    return html`
      <span>${this.interimTranscript || this.prompt || (this.speech ? this.activeplaceholder : this.waitingplaceholder)}</span>
    `;
  }

  protected startSpeechRecognition() {
    if (this.speech) {
      return;
    }
    this.listening = true;
    this.speech = new webkitSpeechRecognition;
    this.speech.continuous = true;
    this.speech.interimResults = true;

    this.speech.onstart = () => {
      this.dispatchEvent(new Event('onSpeechStart'));
    }
    this.speech.onresult = this.onSpeechResult.bind(this);
    this.speech.onend = () => {
      const event = new PromptEvent(this.prompt || this.interimTranscript);
      this.dispatchEvent(event);
    }

    this.speech.lang = 'en';
    this.speech.start();
  }

  protected finishSpeechRecognition() {
    this.speech?.stop();
    this.fetching = true;
    this.speech = undefined;
    this.prompt = undefined;
    this.listening = false;
  }

  protected onSpeechResult(event: SpeechRecognitionEvent) {
    this.interimTranscript = '';
    this.hasSpeech = true;

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        if (!this.prompt) {
          this.prompt = '';
        }
        this.prompt += event.results[i][0].transcript;
      } else {
        this.interimTranscript += event.results[i][0].transcript;
      }
    }

    this.fetching = false;
  }
}