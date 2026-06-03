// What is the Readline Module?
// The readline module provides an interface for reading data from a Readable stream (like process.stdin) one line at a time.
// It's commonly used for creating interactive command-line interfaces.

const readline = require('readline');

// 1. Basic readline Interface
// Create a readline interface from stdin and stdout

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 2. Asking a Question
// Prompt the user for input

rl.question('What is your name? ', (answer) => {
  console.log(`Hello, ${answer}!`);
  rl.close();
});

// 3. Multiple Questions
// Chain multiple questions

/*
rl.question('What is your name? ', (name) => {
  rl.question('What is your age? ', (age) => {
    console.log(`Name: ${name}, Age: ${age}`);
    rl.close();
  });
});
*/

// 4. Reading Line by Line
// Process input line by line

/*
const lineReader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

lineReader.prompt();

lineReader.on('line', (line) => {
  console.log(`You entered: ${line}`);
  if (line === 'exit') {
    lineReader.close();
  } else {
    lineReader.prompt();
  }
});
*/

// 5. Reading from a File
// Read a file line by line

/*
const fs = require('fs');
const fileStream = fs.createReadStream('./example.txt');

const fileReader = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let lineNumber = 0;

fileReader.on('line', (line) => {
  lineNumber++;
  console.log(`Line ${lineNumber}: ${line}`);
});

fileReader.on('close', () => {
  console.log('File reading completed');
});
*/

// 6. Events
// Handle various readline events

/*
const eventRl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

eventRl.on('line', (input) => {
  console.log(`Received: ${input}`);
});

eventRl.on('close', () => {
  console.log('Readline closed');
});

eventRl.on('pause', () => {
  console.log('Readline paused');
});

eventRl.on('resume', () => {
  console.log('Readline resumed');
});

eventRl.on('SIGINT', () => {
  console.log('SIGINT received');
  eventRl.close();
});
*/

// 7. pause() and resume()
// Control the flow of input

/*
const pauseRl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

pauseRl.question('Press Enter to pause... ', () => {
  pauseRl.pause();
  console.log('Paused - input is ignored');

  setTimeout(() => {
    pauseRl.resume();
    console.log('Resumed - input is accepted');
    pauseRl.question('Press Enter to exit... ', () => {
      pauseRl.close();
    });
  }, 3000);
});
*/

// 8. setPrompt() and prompt()
// Customize the prompt

/*
const customRl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

customRl.setPrompt('Enter command > ');
customRl.prompt();

customRl.on('line', (line) => {
  console.log(`Command: ${line}`);
  customRl.prompt();
});
*/

// 9. Writing to Output
// Use write() to output without newline

/*
const writeRl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

writeRl.write('Welcome to the interactive terminal!\n');
writeRl.write('Type "help" for commands.\n\n');

writeRl.setPrompt('$ ');
writeRl.prompt();

writeRl.on('line', (line) => {
  if (line === 'help') {
    writeRl.write('Available commands: help, exit, clear\n');
  } else if (line === 'clear') {
    writeRl.write('\x1B[2J\x1B[0f'); // Clear screen
  } else if (line === 'exit') {
    writeRl.close();
  }
  writeRl.prompt();
});
*/

// 10. Practical Example: Simple Calculator
// Interactive calculator using readline

/*
const calcRl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function calculate() {
  calcRl.question('Enter expression (e.g., 2 + 3): ', (expr) => {
    if (expr === 'exit') {
      calcRl.close();
      return;
    }

    try {
      const result = eval(expr);
      console.log(`Result: ${result}`);
    } catch (err) {
      console.log('Invalid expression');
    }

    calculate();
  });
}

calculate();
*/

// 11. Practical Example: Todo List CLI
// Command-line todo application

/*
const todoRl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const todos = [];

function showMenu() {
  console.log('\n=== Todo List ===');
  todos.forEach((todo, index) => {
    console.log(`${index + 1}. ${todo}`);
  });
  console.log('\nCommands: add, remove, exit');
}

function handleCommand() {
  todoRl.question('Enter command: ', (cmd) => {
    if (cmd === 'exit') {
      todoRl.close();
    } else if (cmd === 'add') {
      todoRl.question('Enter todo: ', (todo) => {
        todos.push(todo);
        showMenu();
        handleCommand();
      });
    } else if (cmd === 'remove') {
      todoRl.question('Enter todo number: ', (num) => {
        todos.splice(parseInt(num) - 1, 1);
        showMenu();
        handleCommand();
      });
    } else {
      console.log('Unknown command');
      handleCommand();
    }
  });
}

showMenu();
handleCommand();
*/

// 12. Practical Example: Password Input
// Hide password input (not natively supported in Node.js)

/*
const passwordRl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Note: This doesn't actually hide the input in standard Node.js
// For hidden input, use external libraries like 'readline-sync' or 'prompt'

passwordRl.question('Enter password: ', (password) => {
  console.log('Password received');
  passwordRl.close();
});
*/

// 13. Completer Function
// Add tab completion

/*
const completeRl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: (line) => {
    const commands = ['help', 'exit', 'list', 'add', 'remove'];
    const hits = commands.filter((c) => c.startsWith(line));
    return [hits.length ? hits : commands, line];
  }
});

completeRl.setPrompt('> ');
completeRl.prompt();

completeRl.on('line', (line) => {
  console.log(`You entered: ${line}`);
  completeRl.prompt();
});
*/

// 14. History
// Access command history

/*
const historyRl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

historyRl.on('line', (line) => {
  console.log(`History length: ${historyRl.history.length}`);
  console.log(`Last command: ${historyRl.history[historyRl.history.length - 1]}`);
  historyRl.prompt();
});

historyRl.setPrompt('> ');
historyRl.prompt();
*/

// 15. Practical Example: Interactive Quiz
// Simple quiz application

/*
const quizRl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  { q: 'What is 2 + 2?', a: '4' },
  { q: 'What is the capital of France?', a: 'Paris' },
  { q: 'What is 5 * 5?', a: '25' }
];

let score = 0;
let currentQuestion = 0;

function askQuestion() {
  if (currentQuestion >= questions.length) {
    console.log(`\nQuiz complete! Score: ${score}/${questions.length}`);
    quizRl.close();
    return;
  }

  const q = questions[currentQuestion];
  quizRl.question(`${q.q} `, (answer) => {
    if (answer.toLowerCase() === q.a.toLowerCase()) {
      console.log('Correct!');
      score++;
    } else {
      console.log(`Wrong! Answer: ${q.a}`);
    }
    currentQuestion++;
    askQuestion();
  });
}

console.log('Welcome to the Quiz!');
askQuestion();
*/

console.log('Readline module examples loaded.');
