import { css } from 'lit';

export const transitionDuration = 2;

export const transitionStyles = css`

  /* ATTRACT STATE */
  :host([transition="out"][transitionstate="attract"][transitiondirection="forward"]) #logo span {
    color: rgba(111,45,253,1);
    animation-duration: ${transitionDuration}s;
    animation-fill-mode: forwards;
    animation: immediate-out ${transitionDuration} cubic-bezier(0.42, 0.0, 1.0, 1.0);
  }

  :host([transition="out"][transitionstate="attract"][transitiondirection="forward"]) #transition {
    animation-name: transition-in;
    animation-duration: ${transitionDuration}s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    display: block;
  }

  :host([transition="in"][transitionstate="attract"]) #transition {
    animation-name: transition-out;
    animation-duration: ${transitionDuration}s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    display: block;
  }
  /* END ATTRACT STATE */

  /* PROMPT STATE */
  :host([transition="in"][transitionstate="prompt"][transitiondirection="forward"]) replaceyou-promptinput {
    animation-name: prompt-in;
    animation-timing-function: cubic-bezier(0.42, 0.0, 1.0, 1.0);
    animation-duration: ${transitionDuration / 2}s;
    animation-delay: ${transitionDuration / 2}s;
    animation-fill-mode: backwards;
  }

  :host([transition="out"][transitionstate="prompt"][transitiondirection="forward"]) replaceyou-promptinput {
    animation-name: prompt-out;
    animation-duration: ${transitionDuration}s;
    animation-timing-function: cubic-bezier(0.42, 0.0, 1.0, 1.0);
  }
  
  :host([transition="in"][transitionstate="prompt"]) #transition {
    animation-name: transition-out;
    animation-duration: ${transitionDuration}s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    display: block;
  }
  /* END PROMPT STATE */
  
  /* VALIDATION STATE */
  /* when transitioning away, but back from the validate state because of a mistake, fill with the transition circle */
  :host([transition="out"][transitionstate="validate"][transitiondirection="backward"]) #transition {
    animation-name: transition-in;
    animation-duration: ${transitionDuration}s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    display: block;
  }

  /* END VALIDATION STATE */
  
  /* PREVIEW STATE */
  :host([transition="in"][transitionstate="preview"]) bodysegmentation-video {
    animation-name: photosnap;
    animation-duration: 250ms;
    animation-timing-function: linear;
    animation-fill-mode: backwards;
  }

  :host([transition="out"][transitionstate="preview"]) #status {
    animation-name: fade;
    animation-duration: ${transitionDuration}s;
    animation-direction: reverse;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
  }
  /* END PREVIEW STATE */

  /* END STATE */
  :host([transition="in"][transitionstate="end"]) #transition {
    animation-name: transition-in;
    animation-duration: ${transitionDuration}s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    display: block;
  }
  /* END END STATE */
  
  /* ERROR PROMPT STATE */
  :host([transition="out"][transitionto="inputerror"][transitionfrom="prompt"]) #transition {
    animation-name: transition-in;
    animation-duration: ${transitionDuration}s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    display: block;
  }

  :host([transition="in"][transitionstate="inputerror"]) #status * {
    animation-name: fade;
    animation-duration: ${transitionDuration}s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
  }

  :host([transition="out"][transitionstate="inputerror"]) #status * {
    animation-name: fade;
    animation-duration: ${transitionDuration}s;
    animation-timing-function: ease-in-out;
    animation-direction: reverse;
    animation-fill-mode: forwards;
  }

  /* transition away from error */
  :host([transition="in"][transitionfrom="inputerror"]) #transition {
    animation-name: transition-out;
    animation-duration: ${transitionDuration}s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    display: block;
  }
  /* END ERROR PROMPT STATE */
  
  
  #transition {
    background-image: linear-gradient(0deg, rgba(255,0,236,1) 0%, rgba(111,45,253,1) 100%);
    border-radius: 100px;
    width: 100px;
    height: 100px;
    position: absolute;
    bottom: -50px;
    right: -50px;
    display: none;
  }
`;