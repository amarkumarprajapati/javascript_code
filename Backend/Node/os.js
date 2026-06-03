// What is the OS Module?
// The os module provides operating system-related utility methods and properties.
// It allows you to get information about the operating system, CPU, memory, and network.

const os = require('os');

// 1. Platform Information
// Get the operating system platform

console.log('Platform:', os.platform());
// Output: 'win32', 'darwin', 'linux', etc.

console.log('OS Type:', os.type());
// Output: 'Windows_NT', 'Darwin', 'Linux', etc.

console.log('OS Release:', os.release());
// Output: kernel version string

console.log('OS Architecture:', os.arch());
// Output: 'x64', 'arm', 'ia32', etc.

// 2. System Information
// Get system uptime in seconds

console.log('System Uptime (seconds):', os.uptime());
console.log('System Uptime (hours):', (os.uptime() / 3600).toFixed(2));

// Get total and free memory

const totalMemory = os.totalmem();
const freeMemory = os.freemem();

console.log('Total Memory:', (totalMemory / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('Free Memory:', (freeMemory / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('Used Memory:', ((totalMemory - freeMemory) / 1024 / 1024 / 1024).toFixed(2), 'GB');

// 3. CPU Information
// Get CPU details

console.log('CPU Model:', os.cpus()[0].model);
console.log('CPU Speed:', os.cpus()[0].speed, 'MHz');
console.log('Number of CPUs:', os.cpus().length);

// 4. Network Interfaces
// Get network interface information

const networkInterfaces = os.networkInterfaces();
console.log('Network Interfaces:', networkInterfaces);

// 5. Home Directory
// Get the current user's home directory

console.log('Home Directory:', os.homedir());

// 6. Temporary Directory
// Get the default directory for temporary files

console.log('Temp Directory:', os.tmpdir());

// 7. Hostname
// Get the hostname of the operating system

console.log('Hostname:', os.hostname());

// 8. User Information
// Get information about the current user

console.log('User Info:', os.userInfo());
// Output: { uid, gid, username, homedir, shell }

// 9. Endianness
// Get the endianness of the CPU

console.log('Endianness:', os.endianness());
// Output: 'LE' (little-endian) or 'BE' (big-endian)

// 10. Load Average
// Get the system load average (1, 5, and 15 minute averages)
// Note: Only available on Unix-like systems

console.log('Load Average:', os.loadavg());

// 11. Constants
// OS-related constants for signal codes, error codes, etc.

console.log('Signal constants:', os.constants.signals);
console.log('Error constants:', os.constants.errno);

// 12. Practical Example: System Monitor
// Display a summary of system resources

function displaySystemInfo() {
  console.log('\n=== System Information ===');
  console.log('Platform:', os.platform());
  console.log('Architecture:', os.arch());
  console.log('CPU Cores:', os.cpus().length);
  console.log('Total Memory:', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), 'GB');
  console.log('Free Memory:', (os.freemem() / 1024 / 1024 / 1024).toFixed(2), 'GB');
  console.log('Memory Usage:', ((1 - os.freemem() / os.totalmem()) * 100).toFixed(2), '%');
  console.log('Uptime:', (os.uptime() / 3600).toFixed(2), 'hours');
  console.log('Hostname:', os.hostname());
  console.log('==========================\n');
}

displaySystemInfo();

// 13. CPU Usage Calculation
// Calculate CPU usage percentage

function getCpuUsage() {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const idle = totalIdle / cpus.length;
  const total = totalTick / cpus.length;
  const usage = 100 - (100 * idle / total);

  console.log('Average CPU Usage:', usage.toFixed(2), '%');
}

getCpuUsage();

console.log('OS module examples loaded.');
