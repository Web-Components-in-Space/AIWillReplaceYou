import { css } from 'lit';

export const appStyles = css`
  :host {
    width: 100%;
    height: 100%;
    display: flex;
    font-size: 48px;
    font-family: "Adobe Clean";

    --gradient: linear-gradient(to right, #09f1b8, #00a2ff, #ff00d2, #fed90f);
  }
  
  span.prompt-text {
    color: rgb(255,0,236);
  }

  #center-messaging {
    width: 100%;
    position: absolute;
    top: calc(50% - 100px);
  }

  #center-messaging span {
    font-size: 100px;
    color: black;
    -webkit-background-clip: text;
    text-align: center;
    display: block;
    background-image: var(--gradient);
    font-weight: bolder;
    -webkit-text-stroke-color: transparent;
    -webkit-text-stroke-width: 12px;
  }

  #loading-bg.isLoading {
    background: linear-gradient(rgba(255, 0, 0, 1) 0%, rgba(255, 154, 0, 1) 10%, rgba(208, 222, 33, 1) 20%, rgba(79, 220, 74, 1) 30%, rgba(63, 218, 216, 1) 40%, rgba(47, 201, 226, 1) 50%, rgba(28, 127, 238, 1) 60%, rgba(95, 21, 242, 1) 70%, rgba(186, 12, 248, 1) 80%, rgba(251, 7, 217, 1) 90%, rgba(255, 0, 0, 1) 100%) 0 0/100% 200%;
    animation: anim 2s linear infinite;
  }

  bodysegmentation-video {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: black;
  }

  @keyframes anim {
    to {
      background-position: 0 -200%
    }
  }

  replaceyou-promptinput {
    margin-left: auto;
    margin-right: auto;
    position: absolute;
    top: 2%;
    left: 50px;
    right: 50px;
  }
  
  replaceyou-countdown-timer {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  :host([state="validate"]) replaceyou-countdown-timer {
    background-color: rgba(0, 0, 0, .8);
  }

  #status {
    position: absolute;
    width: calc(100% - 80px);
    bottom: 0;
    background-color: rgba(0, 0, 0, 80%);
    color: white;
    text-align: center;
    padding: 40px;
    display: flex;
    flex-direction: column;
    border-top-style: solid;
    border-top-width: 2px;
    border-top-color: rgb(111,45,253);
  }

  #status .header {
    font-size: 14px;
  }
  
  :host([state="inputerror"]) #status {
    height: calc(100% - 40px);
    background-image: none;
    background-color: transparent;
    justify-content: center;
    align-items: center;
    z-index: 99;
  }

  :host([state="inputerror"]) #transition,
  :host([state="end"]) #transition {
    transform: scale(9000%);
    display: block;
  }

  #statedebug {
    position: absolute;
    font-size: 12px;
    padding: 10px;
    color: white;
    background-color: #292f54;
    display: none;
  }

  :host([debug]) #statedebug {
    display: block;
  }
  
  #logo, #logo2 {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    justify-content: center; 
  }

  #logo {
    background-color: rgba(255, 255, 255, 80%);
  }

  #logo span {
    margin-top: 25px;
    font-weight: bolder;
    font-size: 48px;
    animation-name: fade;
    animation-timing-function: ease-in-out;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
  
  #logo img, #logo2 img {
    width: 90%;
    animation-name: creepy-animation;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
  
  #logo2 img {
    mix-blend-mode: difference;
    animation-duration: 34s;
  }

  #logo img {
    animation-duration: 28s;
  }

  *[hide] {
    display: none !important;
  }`;