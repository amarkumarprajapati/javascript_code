// What is the Stream Module?
// Streams are objects that let you read data from a source or write data to a destination in a continuous fashion.
// They are used for handling large files and data efficiently without loading everything into memory.

const fs = require('fs');
const { Readable, Writable, Duplex, Transform } = require('stream');

// 1. Readable Streams
// Streams from which data can be read

const readableStream = fs.createReadStream('./renamed.txt', 'utf8');

readableStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});

readableStream.on('end', () => {
  console.log('No more data to read.');
});

readableStream.on('error', (err) => {
  console.error('Error:', err);
});

// 2. Writable Streams
// Streams to which data can be written

const writableStream = fs.createWriteStream('./stream-output.txt');

writableStream.write('Hello, Stream!\n');
writableStream.write('This is a writable stream.\n');
writableStream.end('End of stream.\n');

writableStream.on('finish', () => {
  console.log('All writes completed.');
});

writableStream.on('error', (err) => {
  console.error('Error:', err);
});

// 3. Pipe - Connecting Streams
// Pipe readable stream to writable stream

const readStream = fs.createReadStream('./renamed.txt');
const writeStream = fs.createWriteStream('./piped-output.txt');

readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('File copied successfully using pipe.');
});

// 4. Duplex Streams
// Streams that are both Readable and Writable

// Example: A simple duplex stream that echoes input
class EchoStream extends Duplex {
  _write(chunk, encoding, callback) {
    console.log('Received:', chunk.toString());
    callback();
  }

  _read(size) {
    this.push('Echo: ');
  }
}

const echoStream = new EchoStream();
echoStream.on('data', (chunk) => console.log('Duplex read:', chunk.toString()));

// 5. Transform Streams
// Duplex streams where output is computed from input

// Example: Convert text to uppercase
class UppercaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}

const uppercaseStream = new UppercaseTransform();
const readStream2 = fs.createReadStream('./renamed.txt');
const writeStream2 = fs.createWriteStream('./uppercase-output.txt');

readStream2
  .pipe(uppercaseStream)
  .pipe(writeStream2);

writeStream2.on('finish', () => {
  console.log('File converted to uppercase.');
});

// 6. Creating a Custom Readable Stream
// Manual implementation of a readable stream

class MyReadable extends Readable {
  constructor(options) {
    super(options);
    this.count = 0;
  }

  _read(size) {
    if (this.count >= 5) {
      this.push(null); // Signal end of stream
      return;
    }
    this.push(`Line ${this.count + 1}\n`);
    this.count++;
  }
}

const myReadable = new MyReadable();
myReadable.on('data', (chunk) => console.log('Custom readable:', chunk.toString()));

// 7. Creating a Custom Writable Stream
// Manual implementation of a writable stream

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    console.log('Writing:', chunk.toString());
    callback();
  }
}

const myWritable = new MyWritable();
myWritable.write('Hello from custom writable\n');
myWritable.end();

// 8. Stream Events
// Common events on streams

const eventStream = fs.createReadStream('./renamed.txt');

eventStream.on('open', () => console.log('File opened'));
eventStream.on('close', () => console.log('File closed'));
eventStream.on('pause', () => console.log('Stream paused'));
eventStream.on('resume', () => console.log('Stream resumed'));

// 9. Stream.pipe() with Error Handling
// Proper error handling when piping

readStream.on('error', (err) => {
  console.error('Read error:', err);
});

writeStream.on('error', (err) => {
  console.error('Write error:', err);
});

// 10. Using pipeline() (Node.js 10+)
// Better alternative to pipe() with error handling

const { pipeline } = require('stream');

pipeline(
  fs.createReadStream('./renamed.txt'),
  new UppercaseTransform(),
  fs.createWriteStream('./pipeline-output.txt'),
  (err) => {
    if (err) console.error('Pipeline failed:', err);
    else console.log('Pipeline succeeded');
  }
);

// 11. Compressing Files with Streams
// Using zlib with streams

const zlib = require('zlib');

const gzip = zlib.createGzip();
const compressInput = fs.createReadStream('./renamed.txt');
const compressOutput = fs.createWriteStream('./renamed.txt.gz');

compressInput
  .pipe(gzip)
  .pipe(compressOutput);

compressOutput.on('finish', () => {
  console.log('File compressed successfully.');
});

// 12. Decompressing Files with Streams

const gunzip = zlib.createGunzip();
const decompressInput = fs.createReadStream('./renamed.txt.gz');
const decompressOutput = fs.createWriteStream('./renamed-decompressed.txt');

decompressInput
  .pipe(gunzip)
  .pipe(decompressOutput);

decompressOutput.on('finish', () => {
  console.log('File decompressed successfully.');
});

// 13. Processing CSV with Streams
// Transform stream to process CSV data

class CsvToJson extends Transform {
  constructor(options) {
    super(options);
    this.headers = null;
  }

  _transform(chunk, encoding, callback) {
    const line = chunk.toString().trim();
    if (!line) {
      callback();
      return;
    }

    const values = line.split(',');

    if (!this.headers) {
      this.headers = values;
      callback();
    } else {
      const obj = {};
      this.headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      this.push(JSON.stringify(obj) + '\n');
      callback();
    }
  }
}

// Usage example (requires CSV file)
/*
const csvStream = fs.createReadStream('./data.csv');
const jsonStream = fs.createWriteStream('./data.json');

csvStream
  .pipe(new CsvToJson())
  .pipe(jsonStream);
*/

console.log('Stream module examples loaded.');
