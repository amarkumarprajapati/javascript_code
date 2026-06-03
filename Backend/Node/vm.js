// What is the VM Module?
// The VM module provides APIs for compiling and running code within V8 Virtual Machine contexts.
// It allows you to execute JavaScript code in a separate context, similar to eval() but with more control.

const vm = require('vm');

// 1. vm.runInThisContext()
// Compile and run code in the current context

const code1 = 'const x = 10; x + 5;';
const result1 = vm.runInThisContext(code1);
console.log('Result:', result1); // 15
console.log('x in this context:', typeof x); // undefined (x is not in this scope)

// 2. vm.runInNewContext()
// Compile and run code in a new context

const sandbox = { x: 10, y: 20 };
const code2 = 'x + y';
const result2 = vm.runInNewContext(code2, sandbox);
console.log('Result:', result2); // 30
console.log('Sandbox:', sandbox); // { x: 10, y: 20 }

// 3. vm.runInContext()
// Compile and run code in a specific context

const context = vm.createContext({ a: 5, b: 3 });
const code3 = 'a * b';
const result3 = vm.runInContext(code3, context);
console.log('Result:', result3); // 15

// 4. createContext()
// Create a new context for running code

const myContext = vm.createContext({
  console: console,
  Math: Math,
  result: 0
});

const code4 = 'result = Math.sqrt(16)';
vm.runInContext(code4, myContext);
console.log('Context result:', myContext.result); // 4

// 5. isContext()
// Check if an object is a context

console.log('Is context:', vm.isContext(myContext)); // true
console.log('Is context:', vm.isContext({})); // false

// 6. Script Class
// Pre-compile code for multiple executions

const script = new vm.Script('x + y');

const sandbox1 = { x: 10, y: 20 };
const sandbox2 = { x: 5, y: 3 };

console.log('Script result 1:', script.runInNewContext(sandbox1)); // 30
console.log('Script result 2:', script.runInNewContext(sandbox2)); // 8

// 7. Script with Options
// Configure script compilation and execution

const scriptOptions = {
  filename: 'myscript.js',
  displayErrors: true,
  timeout: 1000 // 1 second timeout
};

const timedScript = new vm.Script(
  'while(true) {}', // Infinite loop
  scriptOptions
);

try {
  timedScript.runInNewContext({});
} catch (err) {
  console.log('Script timeout error:', err.message);
}

// 8. Module Wrapper
// Simulate CommonJS module behavior

const moduleWrapper = (function(exports, require, module, __filename, __dirname) {
  return function(src) {
    return vm.runInNewContext(src, {
      exports,
      require,
      module,
      __filename,
      __dirname,
      console,
      Buffer
    });
  };
})({}, require, module, __filename, __dirname);

const moduleCode = `
  exports.message = 'Hello from module!';
  exports.add = (a, b) => a + b;
`;

const wrappedModule = moduleWrapper(moduleCode);
console.log('Module message:', wrappedModule.message);
console.log('Module add:', wrappedModule.add(2, 3));

// 9. Secure Sandbox
// Create a restricted environment

const secureSandbox = {
  console: {
    log: (msg) => console.log('[Sandbox]', msg)
  },
  Math: Math
};

const secureCode = `
  console.log(Math.PI);
  // process.exit(); // This would fail - process is not defined
`;

try {
  vm.runInNewContext(secureCode, secureSandbox);
} catch (err) {
  console.error('Sandbox error:', err);
}

// 10. Practical Example: Template Engine
// Simple template rendering with VM

function renderTemplate(template, data) {
  const sandbox = { ...data };
  const code = `
    \`${template.replace(/\$\{([^}]+)\}/g, '${$1}')}\`
  `;
  return vm.runInNewContext(code, sandbox);
}

const template = 'Hello, ${name}! You are ${age} years old.';
const rendered = renderTemplate(template, { name: 'John', age: 30 });
console.log('Rendered template:', rendered);

// 11. Practical Example: Expression Evaluator
// Safe mathematical expression evaluation

function evaluateExpression(expr, variables = {}) {
  const sandbox = {
    ...variables,
    Math: Math,
    result: undefined
  };

  const code = `result = ${expr}`;
  vm.runInNewContext(code, sandbox);
  return sandbox.result;
}

console.log('Expression result:', evaluateExpression('x * y + z', { x: 2, y: 3, z: 5 })); // 11

// 12. Practical Example: Code Profiler
// Measure code execution time

function profileCode(code, iterations = 1000) {
  const script = new vm.Script(code);
  const start = Date.now();

  for (let i = 0; i < iterations; i++) {
    script.runInNewContext({});
  }

  const duration = Date.now() - start;
  console.log(`Executed ${iterations} times in ${duration}ms`);
  console.log(`Average: ${(duration / iterations).toFixed(3)}ms per execution`);
}

profileCode('Math.sqrt(Math.random() * 100)');

// 13. Practical Example: Custom REPL
// Build a custom read-eval-print loop

const readline = require('readline');

const replContext = vm.createContext({
  console,
  Math,
  Buffer,
  JSON
});

const repl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'vm> '
});

repl.prompt();

repl.on('line', (line) => {
  if (line === 'exit') {
    repl.close();
    return;
  }

  try {
    const result = vm.runInContext(line, replContext);
    console.log('=>', result);
  } catch (err) {
    console.error('Error:', err.message);
  }

  repl.prompt();
});

// 14. Practical Example: Plugin System
// Load and execute plugin code

class PluginSystem {
  constructor() {
    this.plugins = [];
    this.context = vm.createContext({
      register: (plugin) => this.plugins.push(plugin),
      console,
      exports: {}
    });
  }

  loadPlugin(code) {
    vm.runInContext(code, this.context);
  }

  executePlugins() {
    this.plugins.forEach(plugin => {
      if (plugin.execute) plugin.execute();
    });
  }
}

const pluginSystem = new PluginSystem();

const pluginCode = `
  register({
    name: 'Logger',
    execute: () => console.log('Plugin executed!')
  });
`;

pluginSystem.loadPlugin(pluginCode);
console.log('Loaded plugins:', pluginSystem.plugins.map(p => p.name));

// 15. Practical Example: JSONPath-like Query
// Query objects using expressions

function queryObject(obj, expr) {
  const sandbox = { obj, result: undefined };
  const code = `result = ${expr}`;
  vm.runInNewContext(code, sandbox);
  return sandbox.result;
}

const data = {
  users: [
    { name: 'John', age: 30 },
    { name: 'Alice', age: 25 }
  ]
};

const result = queryObject(data, 'obj.users[0].name');
console.log('Query result:', result); // John

console.log('VM module examples loaded.');
