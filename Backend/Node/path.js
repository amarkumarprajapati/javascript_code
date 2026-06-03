// What is the Path Module?
// The path module provides utilities for working with file and directory paths.
// It handles path formatting, joining, resolving, and parsing across different operating systems.

const path = require('path');

// 1. path.join()
// Joins path segments together, handling separators correctly

const joinedPath = path.join('/users', 'john', 'documents', 'file.txt');
console.log('Joined path:', joinedPath);
// Output: /users/john/documents/file.txt (Unix) or \users\john\documents\file.txt (Windows)

// 2. path.resolve()
// Resolves a sequence of paths into an absolute path

const resolvedPath = path.resolve('folder', 'file.txt');
console.log('Resolved path:', resolvedPath);
// Output: /current/working/directory/folder/file.txt

// 3. path.basename()
// Returns the last portion of a path (filename)

const filePath = '/users/john/documents/file.txt';
const filename = path.basename(filePath);
console.log('Filename:', filename);
// Output: file.txt

// With extension removal
const nameWithoutExt = path.basename(filePath, '.txt');
console.log('Filename without extension:', nameWithoutExt);
// Output: file

// 4. path.dirname()
// Returns the directory name of a path

const dirname = path.dirname(filePath);
console.log('Directory name:', dirname);
// Output: /users/john/documents

// 5. path.extname()
// Returns the file extension

const extname = path.extname(filePath);
console.log('Extension:', extname);
// Output: .txt

// 6. path.parse()
// Parses a path into an object with components

const parsedPath = path.parse(filePath);
console.log('Parsed path:', parsedPath);
// Output: { root: '/', dir: '/users/john/documents', base: 'file.txt', ext: '.txt', name: 'file' }

// 7. path.format()
// Creates a path string from an object

const pathObject = {
  root: '/',
  dir: '/users/john/documents',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
};
const formattedPath = path.format(pathObject);
console.log('Formatted path:', formattedPath);
// Output: /users/john/documents/file.txt

// 8. path.normalize()
// Normalizes a path, resolving '..' and '.' segments

const messyPath = '/users/john/../john/./documents/file.txt';
const normalizedPath = path.normalize(messyPath);
console.log('Normalized path:', normalizedPath);
// Output: /users/john/documents/file.txt

// 9. path.isAbsolute()
// Checks if a path is absolute

console.log('Is absolute?', path.isAbsolute('/users/john'));
console.log('Is absolute?', path.isAbsolute('users/john'));

// 10. path.relative()
// Computes the relative path from one path to another

const from = '/users/john/documents';
const to = '/users/john/pictures';
const relativePath = path.relative(from, to);
console.log('Relative path:', relativePath);
// Output: ../pictures

// 11. path.sep
// Platform-specific path separator

console.log('Path separator:', path.sep);
// Output: \ on Windows, / on Unix

// 12. path.delimiter
// Platform-specific path delimiter (used in PATH environment variable)

console.log('Path delimiter:', path.delimiter);
// Output: ; on Windows, : on Unix

// 13. Working with __dirname and __filename
// __dirname: directory name of current module
// __filename: file name of current module

console.log('Current directory (__dirname):', __dirname);
console.log('Current file (__filename):', __filename);

// Combining with path module
const fullPath = path.join(__dirname, 'data', 'config.json');
console.log('Full path to config:', fullPath);

// 14. Cross-platform path handling
// Always use path module for cross-platform compatibility

const configPath = path.join(__dirname, 'config', 'settings.json');
console.log('Cross-platform config path:', configPath);

console.log('Path module examples loaded.');
