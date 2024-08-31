import process from 'node:process';

export { readFromStdin };

function readFromStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';

    process.stdin.resume();

    process.stdin.setEncoding('utf8');

    process.stdin.on('data', (chunk) => {
      data += chunk;
    });

    process.stdin.on('end', () => {
      resolve(data);
    });
  });
}
