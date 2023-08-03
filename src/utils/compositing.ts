import { Bounds } from 'bodysegmentation-video/baseplayer';
import { Settings } from "../settings";

const TAGLINE_IMG: HTMLImageElement = new Image();
TAGLINE_IMG.src = '/assets/iwasreplaced.png';

export const createFinalOutput = (video: HTMLVideoElement, mask: ImageData, texture: OffscreenCanvas | undefined, prompt: string, justTheImage = false) => {
  const finalcanvas = document.createElement('canvas');
  finalcanvas.width = video.videoWidth;
  finalcanvas.height = justTheImage ? video.videoHeight : video.videoHeight + TAGLINE_IMG.height;
  const ctx = finalcanvas.getContext('2d') as CanvasRenderingContext2D;
  render(ctx, video, mask, texture, { width: video.videoWidth, height: video.videoHeight, x: 0, y: 0 });
  if (ctx) {
    ctx.fillRect(0, video.videoHeight, finalcanvas.width, finalcanvas.height);
    if (!justTheImage) {
      ctx.drawImage(TAGLINE_IMG, 0, video.videoHeight);
      ctx.fillStyle = 'white';
      ctx.font = '26px Adobe Clean';
      ctx.fillText(`by ${prompt}`, 20, video.videoHeight + 105, finalcanvas.width);
    }
  }
  return finalcanvas;
}

export const render = (ctx: CanvasRenderingContext2D, videoSource: HTMLVideoElement, maskImg: ImageData, texture: OffscreenCanvas | undefined, dest: Bounds) => {
  const maskBlurAmount = Settings.segmentation.blur;
  if (ctx && maskImg) {
    const mask = new OffscreenCanvas(videoSource.videoWidth, videoSource.videoHeight);
    mask.width = maskImg.width;
    mask.height = maskImg.height;
    const maskCtx = mask.getContext('2d');
    if (maskCtx) {
      maskCtx.putImageData(maskImg, 0, 0);
      maskCtx.filter = `blur(${maskBlurAmount}px)`;
      maskCtx.drawImage(mask, 0, 0, videoSource.videoWidth, videoSource.videoHeight);

      ctx.clearRect(0, 0, dest.width, dest.height);
      ctx.drawImage(videoSource, 0, 0, dest.width, dest.height);

      if (texture) {
        ctx.globalCompositeOperation = 'destination-atop';
        ctx.drawImage(mask, 0, 0, dest.width, dest.height);
        ctx.drawImage(texture, 0, 0, dest.width, dest.height);
        ctx.globalCompositeOperation = 'source-over';
      } else {
        ctx.globalCompositeOperation = 'destination-atop';
        ctx.drawImage(mask, 0, 0, dest.width, dest.height);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  }
}

export const download = (canvas: HTMLCanvasElement) => {
  const download = document.createElement('a');
  const image = canvas.toDataURL('image/jpg')
    .replace('image/jpg', 'image/octet-stream');
  download.setAttribute('download', 'mypic.jpg');
  download.setAttribute('href', image);
  download.click();
}