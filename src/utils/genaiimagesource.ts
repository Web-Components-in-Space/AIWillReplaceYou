export const loadGenAIImage = (_prompt: string, timeout = 5000): Promise<OffscreenCanvas> => {
  return new Promise((resolve, _reject) => {
    setTimeout( () => {
      const texture = new Image();
      const textureCanvas = new OffscreenCanvas(960, 720);
      texture.onload = () => {
        const ctx = textureCanvas.getContext('2d');
        ctx?.drawImage(texture, 0, 0, 960, 720);
        resolve(textureCanvas);
      };
      texture.src = './sampleassets/wallpaper.jpg';
    }, timeout);
  });
}