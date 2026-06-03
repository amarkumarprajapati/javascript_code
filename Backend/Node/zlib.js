// What is the Zlib Module?
// The zlib module provides compression and decompression functionality using Gzip, Deflate, and Brotli.
// It's used for compressing data to reduce size and improve transmission speed.

const zlib = require('zlib');
const fs = require('fs');

// 1. Gzip Compression
// Compress data using gzip

const input = 'Hello, World! This is a test string for compression.';
const compressed = zlib.gzipSync(input);
console.log('Original size:', input.length);
console.log('Compressed size:', compressed.length);
console.log('Compression ratio:', ((input.length - compressed.length) / input.length * 100).toFixed(2), '%');

// 2. Gzip Decompression
// Decompress gzip data

const decompressed = zlib.gunzipSync(compressed);
console.log('Decompressed:', decompressed.toString());

// 3. Deflate Compression
// Compress using deflate algorithm

const deflated = zlib.deflateSync(input);
console.log('Deflated size:', deflated.length);

const inflated = zlib.inflateSync(deflated);
console.log('Inflated:', inflated.toString());

// 4. Brotli Compression
// Compress using Brotli algorithm (Node.js 10.16+)

const brotliCompressed = zlib.brotliCompressSync(input);
console.log('Brotli compressed size:', brotliCompressed.length);

const brotliDecompressed = zlib.brotliDecompressSync(brotliCompressed);
console.log('Brotli decompressed:', brotliDecompressed.toString());

// 5. Asynchronous Compression
// Compress data asynchronously

zlib.gzip(input, (err, compressed) => {
  if (err) {
    console.error('Compression error:', err);
    return;
  }
  console.log('Async compressed size:', compressed.length);

  // Asynchronous decompression
  zlib.gunzip(compressed, (err, decompressed) => {
    if (err) {
      console.error('Decompression error:', err);
      return;
    }
    console.log('Async decompressed:', decompressed.toString());
  });
});

// 6. Compression with Streams
// Compress file streams

const readStream = fs.createReadStream('./renamed.txt');
const gzipStream = zlib.createGzip();
const writeStream = fs.createWriteStream('./renamed.txt.gz');

readStream.pipe(gzipStream).pipe(writeStream);

writeStream.on('finish', () => {
  console.log('File compressed successfully');
});

// 7. Decompression with Streams
// Decompress file streams

const readGzip = fs.createReadStream('./renamed.txt.gz');
const gunzipStream = zlib.createGunzip();
const writeDecompressed = fs.createWriteStream('./renamed-decompressed.txt');

readGzip.pipe(gunzipStream).pipe(writeDecompressed);

writeDecompressed.on('finish', () => {
  console.log('File decompressed successfully');
});

// 8. Compression Options
// Configure compression level and strategy

const compressionOptions = {
  level: zlib.constants.Z_BEST_COMPRESSION, // 1-9, default: 6
  strategy: zlib.constants.Z_DEFAULT_STRATEGY
};

const customCompressed = zlib.gzipSync(input, compressionOptions);
console.log('Custom compressed size:', customCompressed.length);

// 9. Compression Levels
// Compare different compression levels

const levels = [1, 3, 6, 9];
levels.forEach((level) => {
  const compressed = zlib.gzipSync(input, { level });
  console.log(`Level ${level}: ${compressed.length} bytes`);
});

// 10. Creating a Zip-like Archive
// Compress multiple files

/*
const archiver = require('archiver'); // External library
// For true zip creation, use external libraries like archiver
// zlib only handles single file compression
*/

// 11. Practical Example: HTTP Response Compression
// Compress HTTP responses

const http = require('http');

const compressedServer = http.createServer((req, res) => {
  const text = 'This is a long response that should be compressed...'.repeat(100);
  
  // Check if client accepts gzip
  const acceptEncoding = req.headers['accept-encoding'];
  
  if (acceptEncoding && acceptEncoding.includes('gzip')) {
    res.writeHead(200, { 'Content-Encoding': 'gzip' });
    const gzip = zlib.createGzip();
    res.pipe(gzip).pipe(res);
    gzip.end(text);
  } else {
    res.writeHead(200);
    res.end(text);
  }
});

// compressedServer.listen(3000, () => console.log('Compression server on port 3000'));

// 12. Practical Example: File Compression Utility
// Compress a file to a specified output

function compressFile(inputPath, outputPath, algorithm = 'gzip') {
  const readStream = fs.createReadStream(inputPath);
  const writeStream = fs.createWriteStream(outputPath);
  
  let compressStream;
  switch (algorithm) {
    case 'gzip':
      compressStream = zlib.createGzip();
      break;
    case 'deflate':
      compressStream = zlib.createDeflate();
      break;
    case 'brotli':
      compressStream = zlib.createBrotliCompress();
      break;
    default:
      throw new Error('Unknown compression algorithm');
  }
  
  readStream.pipe(compressStream).pipe(writeStream);
  
  return new Promise((resolve, reject) => {
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  });
}

// compressFile('./renamed.txt', './renamed.compressed.gz', 'gzip')
//   .then(() => console.log('File compressed'))
//   .catch(err => console.error('Compression error:', err));

// 13. Practical Example: Real-time Data Compression
// Compress data as it's generated

class DataCompressor {
  constructor() {
    this.chunks = [];
  }

  addChunk(data) {
    this.chunks.push(data);
  }

  compress() {
    const combined = Buffer.concat(this.chunks);
    return zlib.gzipSync(combined);
  }

  reset() {
    this.chunks = [];
  }
}

const compressor = new DataCompressor();
compressor.addChunk(Buffer.from('Hello, '));
compressor.addChunk(Buffer.from('World!'));

const compressedData = compressor.compress();
console.log('Compressed chunks:', compressedData.length);

// 14. Practical Example: Compression Middleware
// Express middleware for response compression

/*
const express = require('express');
const app = express();

function compressionMiddleware(req, res, next) {
  const acceptEncoding = req.headers['accept-encoding'];
  
  if (acceptEncoding && acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    const gzip = zlib.createGzip();
    res.pipe(gzip).pipe(res);
    res.write = (chunk) => gzip.write(chunk);
    res.end = (chunk) => {
      if (chunk) gzip.write(chunk);
      gzip.end();
    };
  }
  
  next();
}

app.use(compressionMiddleware);

app.get('/', (req, res) => {
  res.send('Hello, compressed world!');
});
*/

// 15. Practical Example: Checksum Verification
// Use Adler-32 and CRC32 checksums

const data = Buffer.from('Hello, World!');

const adler32 = zlib.adler32(data);
console.log('Adler-32 checksum:', adler32);

const crc32 = zlib.crc32(data);
console.log('CRC-32 checksum:', crc32);

// Verify checksum
const verifiedAdler32 = zlib.adler32(data);
console.log('Adler-32 verified:', adler32 === verifiedAdler32);

// 16. Practical Example: Streaming Compression with Progress
// Track compression progress

function compressWithProgress(inputPath, outputPath) {
  const readStream = fs.createReadStream(inputPath);
  const writeStream = fs.createWriteStream(outputPath);
  const gzip = zlib.createGzip();
  
  let totalBytes = 0;
  let compressedBytes = 0;
  
  readStream.on('data', (chunk) => {
    totalBytes += chunk.length;
  });
  
  gzip.on('data', (chunk) => {
    compressedBytes += chunk.length;
    const ratio = ((totalBytes - compressedBytes) / totalBytes * 100).toFixed(2);
    console.log(`Progress: ${totalBytes} bytes -> ${compressedBytes} bytes (${ratio}% reduction)`);
  });
  
  readStream.pipe(gzip).pipe(writeStream);
  
  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log('Final compression ratio:', ((totalBytes - compressedBytes) / totalBytes * 100).toFixed(2), '%');
      resolve();
    });
    writeStream.on('error', reject);
  });
}

// compressWithProgress('./renamed.txt', './renamed.progress.gz');

console.log('Zlib module examples loaded.');
