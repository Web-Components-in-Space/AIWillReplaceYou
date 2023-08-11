import { Settings } from "../settings";

const requestGeneration = (prompt: string, endpoint: string) => {
  return new Promise(resolve => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        prompt,
        steps: Settings.stablediffusion.steps,
        sampler_index: Settings.stablediffusion.sampler,
        tiling: Settings.stablediffusion.tiling,
        width: Settings.stablediffusion.width,
        height: Settings.stablediffusion.height,
      })
    };
    fetch(endpoint, requestOptions)
      .then(response => response.json())
      .then(data => {
        resolve(data.images[0]);
      }).catch(_err => {
      resolve(null);
    });
  });
}

export const loadFakeGenAIImage = (_prompt: string): Promise<OffscreenCanvas> => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(new OffscreenCanvas(Settings.stablediffusion.width, Settings.stablediffusion.height));
    }, 4000);
  })
}

export const loadGenAIImage = (prompt: string): Promise<OffscreenCanvas> => {
  return new Promise((resolve, _reject) => {
    requestGeneration(prompt, Settings.stablediffusion.uri).then((imageData => {
      const texture = new Image();
      const textureCanvas = new OffscreenCanvas(Settings.stablediffusion.width, Settings.stablediffusion.height);
      texture.onload = () => {
        const ctx = textureCanvas.getContext('2d');
        for (let i=0; i < Math.ceil(Settings.segmentation.cameraWidth / Settings.stablediffusion.patternWidth); i++) {
          for (let j=0; j < Math.ceil(Settings.segmentation.cameraHeight / Settings.stablediffusion.patternHeight); j++) {
            ctx?.drawImage(texture, 0, 0,
              Settings.stablediffusion.width, Settings.stablediffusion.height,
              j * Settings.stablediffusion.patternWidth, i * Settings.stablediffusion.patternHeight,
              Settings.stablediffusion.patternWidth, Settings.stablediffusion.patternHeight);
          }
        }
        resolve(textureCanvas);
      };
      texture.src = 'data:image/png;base64,' + imageData as string;
    }));
  });
}