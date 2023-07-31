import { css } from 'lit';

export const animations = css`
  @keyframes prompt-in {
    0% {
      transform: scaleY(0%);
    }
    90% {
      transform: scaleY(0%);
    }
    98% {
      transform: scaleY(110%);
    }
    100% {
      transform: scaleY(100%);
    }
  }

  @keyframes prompt-out {
    0% {
      transform: scaleY(100%);
    }
    90% {
      transform: scaleY(100%);
    }
    98% {
      transform: scaleY(110%);
    }
    100% {
      transform: scaleY(0%);
    }
  }

  @keyframes immediate-out {
    0% {
      transform: scaleY(100%);
    }
    20% {
      transform: scaleY(100%);
    }
    28% {
      transform: scaleY(110%);
    }
    35% {
      transform: scaleY(0%);
    }
    100% {
      transform: scaleY(0%);
    }
  }


  @keyframes transition-in {
    0% {
      transform: scale(0%);
    }
    50% {
      transform: scale(0%);
    }
    100% {
      transform: scale(9000%);
    }
  }

  @keyframes transition-out {
    0% {
      transform: scale(9000%);
    }
    50% {
      transform: scale(0%);
    }
    100% {
      transform: scale(0%);
    }
  }

  @keyframes fade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes creepy-animation {
    0% {
      transform: translate(0, 0) rotate(0) skew(0deg, 0deg);
    }
    20% {
      transform: translate(-5px, 5px) rotate(-2deg) skew(2deg, -3deg);
    }
    40% {
      transform: translate(5px, -5px) rotate(2deg) skew(-2deg, 3deg);
    }
    60% {
      transform: translate(-3px, 3px) rotate(-1deg) skew(2deg, -1deg);
    }
    80% {
      transform: translate(3px, -3px) rotate(1deg) skew(1deg, 2deg);
    }
    100% {
      transform: translate(0, 0) rotate(0) skew(0deg, 0deg)
    }
  }

  @keyframes photosnap {
    0% {
      filter: brightness(100%);
    }
    100% {
      filter: brightness(1000%);
    }
  }
`;