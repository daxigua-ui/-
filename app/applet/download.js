import https from 'https';
import fs from 'fs';

const url = 'https://files.oaiusercontent.com/file-5e3d2f4e-7a1b-4c3d-8f2a-9b87654d210';
const dest = './public/bg-image.png';

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: ${res.statusCode}`);
    return;
  }
  const file = fs.createWriteStream(dest);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download completed');
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
