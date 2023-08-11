import {LitElement, html, css} from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {customElement, property} from 'lit/decorators.js';

@customElement('replaceyou-countdown-timer')
export class CountDownTimer extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    #timer {
      font-size: 200px;
      color: black;
      -webkit-background-clip: text;
      text-align: center;
      display: block;
      background-image: var(--gradient);
      font-weight: bolder;
      -webkit-text-stroke-color: transparent;
      -webkit-text-stroke-width: 12px;
    }
    
    #message {
      font-size: 26px;
      font-weight: bolder;
      padding: 20px;
      text-align: center;
      color: white;
      margin-bottom: 100px;
    }

    span.prompt-text {
      color: rgb(255,0,236);
    }
  `;

  @property({ attribute: true, reflect: true })
  public seconds = 10;

  @property({ attribute: true, reflect: true })
  public message?: string;

  @property({ attribute: true, reflect: true })
  public prompt?: string;

  @property()
  public currentTime = -1;

  protected timer?: number;

  override connectedCallback() {
    super.connectedCallback();
    this.reset();
  }

  public start() {
    this.currentTime = this.seconds;

    this.timer = window.setInterval(() => {
      this.currentTime --;
      if (this.currentTime < 1) {
        this.reset();
        this.dispatchEvent(new Event('onComplete'));
      } else {
        this.dispatchEvent(new Event('onUpdate'));
      }
    }, 1000);
  }

  public reset() {
    window.clearInterval(this.timer);
    this.currentTime = -1;
  }

  override render() {
    if (this.currentTime >= 0) {
      return html`<span id="timer">${this.currentTime}</span>
                <span id="message"><span class="prompt-text">${this.prompt}</span><br />${unsafeHTML(this.message)}</span>`;
    } else {
      return undefined;
    }
  }
}