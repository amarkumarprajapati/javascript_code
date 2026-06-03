// What is the File System (fs) Module?
// The fs module provides an API for interacting with the file system in a manner closely modeled around standard POSIX functions.
// It supports both synchronous and asynchronous operations.

const fs = require('fs');
const path = require('path');

// 1. Reading Files
// Asynchronous reading (recommended)

fs.readFile('./example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content (async):', data);
});

// Synchronous reading (blocks execution)
try {
  const syncData = fs.readFileSync('./example.txt', 'utf8');
  console.log('File content (sync):', syncData);
} catch (err) {
  console.error('Sync read error:', err);
}

// 2. Writing Files
// Asynchronous writing

fs.writeFile('./output.txt', 'Hello, Node.js!', 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully!');
});

// Synchronous writing
try {
  fs.writeFileSync('./output-sync.txt', 'Sync write example', 'utf8');
  console.log('Sync file written successfully!');
} catch (err) {
  console.error('Sync write error:', err);
}

// 3. Appending to Files
// Adding content to existing file

fs.appendFile('./output.txt', '\nAppended content!', 'utf8', (err) => {
  if (err) console.error('Append error:', err);
  else console.log('Content appended!');
});

// 4. Checking if File/Directory Exists
// Using fs.stat or fs.access

fs.stat('./example.txt', (err, stats) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.log('File does not exist');
    } else {
      console.error('Error checking file:', err);
    }
  } else {
    console.log('File exists');
    console.log('Is file:', stats.isFile());
    console.log('Is directory:', stats.isDirectory());
    console.log('File size:', stats.size, 'bytes');
  }
});

// 5. Creating Directories
// Create a single directory

fs.mkdir('./newDir', (err) => {
  if (err && err.code !== 'EEXIST') {
    console.error('Error creating directory:', err);
  } else {
    console.log('Directory created or already exists');
  }
});

// Create nested directories (recursive)
fs.mkdir('./parent/child/grandchild', { recursive: true }, (err) => {
  if (err) console.error('Error creating nested directory:', err);
  else console.log('Nested directory created');
});

// 6. Reading Directories
// List files in a directory

fs.readdir('.', (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }
  console.log('Directory contents:', files);
});

// 7. Deleting Files
// Remove a file

fs.unlink('./output-sync.txt', (err) => {
  if (err) console.error('Error deleting file:', err);
  else console.log('File deleted');
});

// 8. Deleting Directories
// Remove empty directory

fs.rmdir('./newDir', (err) => {
  if (err) console.error('Error deleting directory:', err);
  else console.log('Directory deleted');
});

// Remove directory recursively (Node.js 12.10+)
fs.rm('./parent', { recursive: true, force: true }, (err) => {
  if (err) console.error('Error deleting directory recursively:', err);
  else console.log('Directory deleted recursively');
});

// 9. Renaming Files/Directories
// Move or rename

fs.rename('./output.txt', './renamed.txt', (err) => {
  if (err) console.error('Error renaming:', err);
  else console.log('File renamed');
});

// 10. File Streams
// Read large files in chunks

const readStream = fs.createReadStream('./renamed.txt', 'utf8');
readStream.on('data', (chunk) => {
  console.log('Stream chunk:', chunk);
});
readStream.on('end', () => {
  console.log('Stream finished');
});

// Write stream
const writeStream = fs.createWriteStream('./stream-output.txt');
writeStream.write('Stream write example\n');
writeStream.end();

// 11. Using Promises (fs.promises)
// Modern async/await approach

const fsPromises = fs.promises;

async function readFileAsync() {
  try {
    const data = await fsPromises.readFile('./renamed.txt', 'utf8');
    console.log('Promise-based read:', data);
  } catch (err) {
    console.error('Promise read error:', err);
  }
}

readFileAsync();

console.log('FS module examples loaded.');
