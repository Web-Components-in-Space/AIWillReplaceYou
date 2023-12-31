import { transitionDuration } from "./transitions.css";

export interface State {
  name: string;
  id: string;
  inputPromptActive: boolean;
  segmentationActive: boolean;
  hideVideo: boolean;
  showStatus: boolean;
  useCountdown: boolean;
  countdownMessage?: string,
  getStatusMessage: () => string;
  silentTimer?: number;
  silentTimerAction?: () => {}
}

export class StateMachine {
  public currentPrompt = '';

  public currentFilename = '';

  public countdownSeconds?: number;

  protected currentStateIndex = 0;

  protected transitionTime = transitionDuration;

  protected transitionCallback?: Function;

  protected changeStateCallback?: Function;

  constructor(stateChangeCb: Function, transitionCb: Function) {
    this.changeStateCallback = stateChangeCb;
    this.transitionCallback = transitionCb;
  }

  public get currentState() {
    return this.states[this.currentStateIndex];
  }

  public async next() {
    await this.transition(this.currentStateIndex, this.currentStateIndex + 1);
  }

  public async back() {
    await this.transition(this.currentStateIndex, this.currentStateIndex - 1);
  }

  public async goNamedState(name: string) {
    const newstate = this.states.findIndex(state => state.id === name);
    await this.transition(this.currentStateIndex, newstate);
  }

  protected async transition(from: number, to: number) {
    this.countdownSeconds = undefined;
    const details = { from: this.states[from].id, to: this.states[to].id, direction: Math.abs(to-from)/(to-from) };
    if (this.transitionCallback) {
      this.transitionCallback('out', this.states[from].id, details);
    }
    setTimeout(() => {
      this.currentStateIndex = to;

      if (this.changeStateCallback) {
        this.changeStateCallback(this.currentState, true);
      }

      if (this.transitionCallback) {
        this.transitionCallback('in', this.states[to].id, details);
      }

      setTimeout(() => {
        if (this.transitionCallback) {
          this.transitionCallback('complete', this.states[to].id, details);

          if (this.changeStateCallback) {
            this.changeStateCallback(this.currentState);
          }
        }
      }, this.transitionTime * 1000)
    }, this.transitionTime * 1000);
  }

  protected states = [
    {
      name: 'attract',
      id: 'attract',
      inputPromptActive: true,
      segmentationActive: false,
      hideVideo: false,
      showStatus: true,
      useCountdown: false,
      getStatusMessage: () => { return `${this.currentFilename ? `Find the last photo at <br /><span class="prompt-text">www.aiwillreplaceu.com with code ${this.currentFilename}</span>` :
          `Your photo will be available at <span class="prompt-text">www.aiwillreplaceu.com</span>`}`; }
    },
    {
      name: 'prompt input',
      id: 'prompt',
      inputPromptActive: true,
      segmentationActive: false,
      hideVideo: false,
      showStatus: true,
      useCountdown: false,
      silentTimer: 60,
      silentTimerAction: () => {
        this.goNamedState('attract');
      },
      getStatusMessage: () => { return '...and then <span class="prompt-text">AI Will Replace U</span> with<br />your spoken generative AI prompt'; }
    },
    {
      name: 'validate input',
      id: 'validate',
      inputPromptActive: false,
      segmentationActive: false,
      hideVideo: false,
      showStatus: true,
      useCountdown: 5,
      countdownMessage: `Is this what should replace U? <br />If not, press the button again to restart...`,
      getStatusMessage: () => { return `AI Will Replace U with <br /><span class="prompt-text">${this.currentPrompt}</span>`; }
    },
    {
      name: 'generate image',
      id: 'generate',
      inputPromptActive: false,
      segmentationActive: true,
      hideVideo: true,
      showStatus: true,
      useCountdown: false,
      getStatusMessage: () => { return `AI is <i>thinking really hard</i> to generate <br /><span class="prompt-text">${this.currentPrompt}</span> and replace U`; }
    },
    {
      name: 'countdowntimer pose',
      id: 'pose',
      inputPromptActive: false,
      segmentationActive: true,
      hideVideo: true,
      showStatus: true,
      useCountdown: 5,
      getStatusMessage: () => { return `You have been replaced with <span class="prompt-text">${this.currentPrompt}</span>!<br />Now pose to have your picture taken ${this.countdownSeconds ? `in <span class="prompt-text">${this.countdownSeconds}</span> seconds` : ''}` }
    },
    {
      name: 'show output',
      id: 'preview',
      inputPromptActive: false,
      segmentationActive: false,
      hideVideo: false,
      showStatus: true,
      useCountdown: false,
      silentTimer: 5,
      silentTimerAction: () => {
        this.next();
      },
      getStatusMessage: () => { return `Download at <span class="prompt-text">www.aiwillreplaceu.com with code ${this.currentFilename}</span>`; }
    },
    {
      name: 'end',
      id: 'end',
      inputPromptActive: false,
      segmentationActive: false,
      hideVideo: false,
      showStatus: false,
      useCountdown: false,
      getStatusMessage: () => { return '' }
    },
    {
      name: 'input error',
      id: 'inputerror',
      inputPromptActive: false,
      segmentationActive: false,
      hideVideo: false,
      showStatus: true,
      useCountdown: false,
      silentTimer: 5,
      silentTimerAction: () => {
          this.goNamedState('prompt');
      },
      getStatusMessage: () => { return "Sorry! I didn't hear you! <br />Be sure to press and hold the button while you are talking, and release when finished"; }
    },
    {
      name: 'video testing',
      id: 'videotesting',
      inputPromptActive: false,
      segmentationActive: true,
      hideVideo: true,
      showStatus: false,
      useCountdown: false,
      getStatusMessage: () => { return ''; }
      }
  ];
}