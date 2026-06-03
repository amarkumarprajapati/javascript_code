// What is the Events Module?
// The events module provides the EventEmitter class, which is used to handle events in Node.js.
// Many Node.js core modules inherit from EventEmitter, allowing you to work with events.

const EventEmitter = require('events');

// 1. Creating an EventEmitter
// Create a new event emitter instance

const myEmitter = new EventEmitter();

// 2. Registering Event Listeners
// Add a listener for an event

myEmitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// 3. Emitting Events
// Trigger an event

myEmitter.emit('greet', 'John');
myEmitter.emit('greet', 'Alice');

// 4. Multiple Listeners for Same Event
// Multiple functions can listen to the same event

myEmitter.on('greet', (name) => {
  console.log(`Hi there, ${name}!`);
});

myEmitter.emit('greet', 'Bob');
// Both listeners will be called

// 5. Once() - Listener that runs only once
// Register a listener that will be removed after first execution

myEmitter.once('special', () => {
  console.log('This will only run once!');
});

myEmitter.emit('special');
myEmitter.emit('special'); // This won't trigger the listener

// 6. Removing Event Listeners
// Remove specific listener

const goodbyeHandler = (name) => {
  console.log(`Goodbye, ${name}!`);
};

myEmitter.on('goodbye', goodbyeHandler);
myEmitter.emit('goodbye', 'John');

myEmitter.off('goodbye', goodbyeHandler);
myEmitter.emit('goodbye', 'John'); // Won't trigger anymore

// 7. Removing All Listeners
// Remove all listeners for an event

myEmitter.on('test', () => console.log('Test 1'));
myEmitter.on('test', () => console.log('Test 2'));
myEmitter.on('test', () => console.log('Test 3'));

myEmitter.emit('test'); // All three will run

myEmitter.removeAllListeners('test');
myEmitter.emit('test'); // Nothing will run

// 8. Getting Listener Count
// Count number of listeners for an event

myEmitter.on('click', () => console.log('Click 1'));
myEmitter.on('click', () => console.log('Click 2'));
myEmitter.on('click', () => console.log('Click 3'));

console.log('Click listener count:', myEmitter.listenerCount('click'));

// 9. Getting All Listener Names
// Get array of event names with registered listeners

myEmitter.on('start', () => {});
myEmitter.on('stop', () => {});

console.log('Event names:', myEmitter.eventNames());

// 10. Error Events
// Special 'error' event - if not handled, it will crash the process

myEmitter.on('error', (err) => {
  console.error('Error occurred:', err.message);
});

myEmitter.emit('error', new Error('Something went wrong!'));

// 11. Creating a Custom Class with EventEmitter
// Extend EventEmitter to create your own event-driven classes

class MyLogger extends EventEmitter {
  log(message) {
    console.log(`[LOG]: ${message}`);
    this.emit('logged', message);
  }

  error(message) {
    console.error(`[ERROR]: ${message}`);
    this.emit('error', new Error(message));
  }
}

const logger = new MyLogger();

logger.on('logged', (msg) => {
  console.log(`Message was logged: ${msg}`);
});

logger.on('error', (err) => {
  console.error(`Error was emitted: ${err.message}`);
});

logger.log('Application started');
logger.error('Database connection failed');

// 12. Raw Listeners
// Access raw listener functions

myEmitter.on('raw', () => console.log('Raw listener'));
console.log('Raw listeners:', myEmitter.rawListeners('raw'));

// 13. Max Listeners
// Set maximum number of listeners (default is 10 to prevent memory leaks)

console.log('Default max listeners:', EventEmitter.defaultMaxListeners);
EventEmitter.defaultMaxListeners = 20;
console.log('Updated max listeners:', EventEmitter.defaultMaxListeners);

// Set max listeners for specific emitter
myEmitter.setMaxListeners(5);

// 14. Practical Example: Simple Pub/Sub System
// Publisher-Subscriber pattern using EventEmitter

class PubSub extends EventEmitter {
  subscribe(topic, callback) {
    this.on(topic, callback);
  }

  publish(topic, data) {
    this.emit(topic, data);
  }

  unsubscribe(topic, callback) {
    this.off(topic, callback);
  }
}

const pubSub = new PubSub();

pubSub.subscribe('news', (news) => {
  console.log('News received:', news);
});

pubSub.subscribe('news', (news) => {
  console.log('Processing news:', news);
});

pubSub.publish('news', 'New JavaScript framework released!');

console.log('Events module examples loaded.');
