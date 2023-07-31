import { Bounds } from 'bodysegmentation-video/baseplayer';

const TAGLINE_IMG: HTMLImageElement = new Image();
TAGLINE_IMG.src = '/assets/iwasreplaced.png';

export const createFinalOutput = (video: HTMLVideoElement, mask: ImageData, texture: OffscreenCanvas | undefined) => {
  const finalcanvas = document.createElement('canvas');
  finalcanvas.width = video.videoWidth;
  finalcanvas.height = video.videoHeight + TAGLINE_IMG.height;
  const ctx = finalcanvas.getContext('2d') as CanvasRenderingContext2D;
  render(ctx, video, mask, texture, { width: video.videoWidth, height: video.videoHeight, x: 0, y: 0 });
  if (ctx) {
    ctx.drawImage(TAGLINE_IMG, 0, video.videoHeight);
  }
  download(finalcanvas);
}

export const render = (ctx: CanvasRenderingContext2D, videoSource: HTMLVideoElement, maskImg: ImageData, texture: OffscreenCanvas | undefined, dest: Bounds) => {
  const maskBlurAmount = 10;
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