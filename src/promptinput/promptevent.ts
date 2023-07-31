export class PromptEvent extends Event {
  public static EVENT_NAME = 'onPromptInput';

  public prompt?;

  constructor(prompt: string, props?: EventInit) {
    super(PromptEvent.EVENT_NAME, props);
    this.prompt = prompt;
  }
}