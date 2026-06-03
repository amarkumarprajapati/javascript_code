// What is the Child Process Module?
// The child_process module provides the ability to spawn subprocesses in a manner similar to popen(3).
// It allows Node.js to run system commands and other processes.

const { spawn, exec, execFile, fork } = require('child_process');

// 1. spawn()
// Spawn a new process and stream its output

const ls = spawn('ls', ['-la', '.']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// 2. exec()
// Execute a command in a shell and buffer the output

exec('ls -la', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

// 3. execFile()
// Execute a file directly (more secure than exec)

execFile('node', ['-v'], (error, stdout, stderr) => {
  if (error) {
    console.error(`execFile error: ${error}`);
    return;
  }
  console.log(`Node version: ${stdout.trim()}`);
});

// 4. fork()
// Spawn a Node.js process with IPC communication

// Note: This requires a separate file (worker.js)
/*
const child = fork('./worker.js');

child.on('message', (msg) => {
  console.log('Message from child:', msg);
});

child.send({ hello: 'from parent' });
*/

// 5. Spawn with Options
// Configure spawn with various options

const spawnOptions = {
  cwd: './',
  env: { ...process.env, CUSTOM_VAR: 'custom-value' },
  stdio: 'inherit', // Inherit parent's stdio
  shell: true
};

const customSpawn = spawn('echo', ['Hello from spawn'], spawnOptions);

// 6. Exec with Promise
// Wrap exec in a Promise for async/await

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });
}

async function runCommand() {
  try {
    const output = await execPromise('node -v');
    console.log('Node version (Promise):', output.trim());
  } catch (error) {
    console.error('Error:', error);
  }
}

runCommand();

// 7. Spawn with Streams
// Pipe spawn output to other streams

const grep = spawn('grep', ['package']);
const cat = spawn('cat', ['package.json']);

cat.stdout.pipe(grep.stdin);
grep.stdout.pipe(process.stdout);

// 8. Killing a Child Process
// Terminate a running child process

const longProcess = spawn('sleep', ['10']);

setTimeout(() => {
  console.log('Killing the sleep process...');
  longProcess.kill('SIGTERM');
}, 2000);

longProcess.on('exit', (code, signal) => {
  console.log(`Process exited with code ${code}, signal ${signal}`);
});

// 9. Detached Process
// Spawn a detached process that runs independently

const detachedProcess = spawn('node', ['-e', 'console.log("Detached process running")'], {
  detached: true,
  stdio: 'ignore'
});

detachedProcess.unref();
console.log('Detached process spawned');

// 10. IPC Communication
// Send messages between parent and child processes

const ipcChild = spawn('node', ['-e', `
  process.on('message', (msg) => {
    console.log('Child received:', msg);
    process.send({ reply: 'Pong' });
  });
`], {
  stdio: ['pipe', 'pipe', 'pipe', 'ipc']
});

ipcChild.on('message', (msg) => {
  console.log('Parent received:', msg);
});

ipcChild.send({ greeting: 'Ping' });

// 11. ExecSync (Synchronous)
// Execute a command synchronously (blocks event loop)

const { execSync } = require('child_process');

try {
  const output = execSync('node -v');
  console.log('Node version (sync):', output.toString().trim());
} catch (error) {
  console.error('Sync exec error:', error);
}

// 12. ExecFileSync (Synchronous)
// Execute a file synchronously

const { execFileSync } = require('child_process');

try {
  const output = execFileSync('node', ['-v']);
  console.log('Node version (sync file):', output.toString().trim());
} catch (error) {
  console.error('Sync execFile error:', error);
}

// 13. SpawnSync (Synchronous)
// Spawn a process synchronously

const { spawnSync } = require('child_process');

const result = spawnSync('echo', ['Hello from spawnSync']);
console.log('SpawnSync output:', result.stdout.toString());

// 14. Practical Example: Running Shell Commands
// Helper function to run shell commands

function runShellCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject({ error, stderr });
      else resolve(stdout);
    });
  });
}

async function shellExample() {
  try {
    const files = await runShellCommand('ls -la');
    console.log('Files:', files);
  } catch (error) {
    console.error('Shell error:', error);
  }
}

shellExample();

// 15. Practical Example: Process Pool
// Create a pool of worker processes

class ProcessPool {
  constructor(size, script) {
    this.size = size;
    this.script = script;
    this.workers = [];
    this.taskQueue = [];
    this.init();
  }

  init() {
    for (let i = 0; i < this.size; i++) {
      const worker = fork(this.script);
      worker.on('message', (msg) => {
        this.handleWorkerMessage(worker, msg);
      });
      this.workers.push({ worker, busy: false });
    }
  }

  handleWorkerMessage(worker, msg) {
    const workerObj = this.workers.find(w => w.worker === worker);
    if (workerObj) {
      workerObj.busy = false;
      if (this.taskQueue.length > 0) {
        const task = this.taskQueue.shift();
        this.assignTask(workerObj, task);
      }
    }
  }

  assignTask(workerObj, task) {
    workerObj.busy = true;
    workerObj.worker.send(task);
  }

  execute(task) {
    const availableWorker = this.workers.find(w => !w.busy);
    if (availableWorker) {
      this.assignTask(availableWorker, task);
    } else {
      this.taskQueue.push(task);
    }
  }
}

// Usage example (requires worker.js file)
// const pool = new ProcessPool(4, './worker.js');
// pool.execute({ data: 'some task' });

console.log('Child process module examples loaded.');
