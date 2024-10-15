import { castError } from '@corentinth/chisels';

export { svgToBase64Png };

function svgToBase64Png({ svg, width, height }: { svg: string; width: number; height: number }): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.width = width;
    img.height = height;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get 2d context'));
        return;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => {
      reject(castError(err));
    };
    img.src = `data:image/svg+xml;base64,${btoa(svg)}`;
  });
}
