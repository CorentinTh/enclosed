export { getFileIcon };

// Available icons :
// i-tabler-file-3d i-tabler-file-ai i-tabler-file-alert i-tabler-file-analytics i-tabler-file-arrow-left i-tabler-file-arrow-right i-tabler-file-barcode i-tabler-file-bitcoin i-tabler-file-broken i-tabler-file-certificate i-tabler-file-chart i-tabler-file-check i-tabler-file-code i-tabler-file-code-2 i-tabler-file-cv i-tabler-file-database i-tabler-file-delta i-tabler-file-description i-tabler-file-diff i-tabler-file-digit i-tabler-file-dislike i-tabler-file-dollar i-tabler-file-dots i-tabler-file-download i-tabler-file-euro i-tabler-file-excel i-tabler-file-export i-tabler-file-filled i-tabler-file-function i-tabler-file-horizontal i-tabler-file-import i-tabler-file-infinity i-tabler-file-info i-tabler-file-invoice i-tabler-file-isr i-tabler-file-lambda i-tabler-file-like i-tabler-file-minus i-tabler-file-music i-tabler-file-neutral i-tabler-file-off i-tabler-file-orientation i-tabler-file-pencil i-tabler-file-percent i-tabler-file-phone i-tabler-file-plus i-tabler-file-power i-tabler-file-report i-tabler-file-rss i-tabler-file-sad i-tabler-file-scissors i-tabler-file-search i-tabler-file-settings i-tabler-file-shredder i-tabler-file-signal i-tabler-file-smile i-tabler-file-spreadsheet i-tabler-file-stack i-tabler-file-star i-tabler-file-symlink i-tabler-file-text i-tabler-file-text-ai i-tabler-file-time i-tabler-file-type-bmp i-tabler-file-type-css i-tabler-file-type-csv i-tabler-file-type-doc i-tabler-file-type-docx i-tabler-file-type-html i-tabler-file-type-jpg i-tabler-file-type-js i-tabler-file-type-jsx i-tabler-file-type-pdf i-tabler-file-type-php i-tabler-file-type-png i-tabler-file-type-ppt i-tabler-file-type-rs i-tabler-file-type-sql i-tabler-file-type-svg i-tabler-file-type-ts i-tabler-file-type-tsx i-tabler-file-type-txt i-tabler-file-type-vue i-tabler-file-type-xls i-tabler-file-type-xml i-tabler-file-type-zip i-tabler-file-typography i-tabler-file-unknown i-tabler-file-upload i-tabler-file-vector i-tabler-file-word i-tabler-file-x i-tabler-file-x-filled i-tabler-file-zip

export const iconByFileType = {
  '*': 'i-tabler-file',
  'image': 'i-tabler-photo',
  'video': 'i-tabler-video',
  'audio': 'i-tabler-file-music',
  'application': 'i-tabler-file-code',
  'application/pdf': 'i-tabler-file-type-pdf',
  'application/zip': 'i-tabler-file-zip',
  'application/vnd.ms-excel': 'i-tabler-file-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'i-tabler-file-excel',
  'application/msword': 'i-tabler-file-word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'i-tabler-file-word',
  'application/json': 'i-tabler-file-code',
  'application/xml': 'i-tabler-file-code',
  'application/javascript': 'i-tabler-file-type-js',
  'application/typescript': 'i-tabler-file-type-ts',
  'application/vnd.ms-powerpoint': 'i-tabler-file-type-ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'i-tabler-file-type-ppt',
  'text/plain': 'i-tabler-file-text',
  'text/html': 'i-tabler-file-type-html',
  'text/css': 'i-tabler-file-type-css',
  'text/csv': 'i-tabler-file-type-csv',
  'text/xml': 'i-tabler-file-type-xml',
  'text/javascript': 'i-tabler-file-type-js',
  'text/typescript': 'i-tabler-file-type-ts',
};

type FileTypes = keyof typeof iconByFileType;

function getFileIcon({ file, iconsMap = iconByFileType }: { file: File; iconsMap?: Record<string, string> & { '*': string } }): string {
  const fileType = file.type;
  const fileTypeGroup = fileType?.split('/')[0];

  const icon = iconsMap[fileType as FileTypes] ?? iconsMap[fileTypeGroup as FileTypes] ?? iconsMap['*'];

  return icon;
}
