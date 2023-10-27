const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, './windows11');

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading the directory:', err);
    return;
  }

  files.forEach(file => {
    // Check if it's a file and not a directory
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isFile()) {
      const fileExtension = path.extname(file);
      const baseName = path.basename(file, fileExtension);
      const newFileName = `${baseName}-maskable${fileExtension}`;

      fs.rename(filePath, path.join(directoryPath, newFileName), err => {
        if (err) {
          console.error('Error renaming the file:', err);
        } else {
          console.log(`${file} -> ${newFileName}`);
        }
      });
    }
  });
});
