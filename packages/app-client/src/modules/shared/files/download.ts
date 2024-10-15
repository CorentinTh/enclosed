export { downloadBase64File, downloadFile, downloadSvgFile };

function downloadSvgFile({ svg, fileName }: { svg: string; fileName: string }) {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  downloadFile({ blob, fileName });
}

function downloadFile({ blob, fileName }: { blob: Blob; fileName: string }) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadBase64File({ base64, fileName }: { base64: string; fileName: string }) {
  const a = document.createElement('a');
  a.href = base64;
  a.download = fileName;
  a.click();
}
