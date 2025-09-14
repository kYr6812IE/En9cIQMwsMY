// 代码生成时间: 2025-09-14 13:47:05
const process = Npm.require('child_process');

// ProcessManager class responsible for managing processes
class ProcessManager {
  constructor() {
    this.processes = {}; // Store the processes
  }

  // Run a command in a new process
  runCommand(command, args, callback) {
    try {
      const options = {
        detached: true, // Run the process in the background
        stdio: 'ignore' // Ignore the standard I/O of the child process
      };

      const child = process.spawn(command, args, options);
      child.unref(); // Allow the parent to exit independently of the child process

      this.processes[child.pid] = child;

      // Handle the stdout and stderr streams
      child.stdout.on('data', (data) => {
        console.log(`STDOUT: ${data}`);
      });

      child.stderr.on('data', (data) => {
        console.error(`STDERR: ${data}`);
      });

      // Handle the close event of the process
      child.on('close', (code) => {
        console.log(`Process ${child.pid} exited with code ${code}`);
        delete this.processes[child.pid];
        if (typeof callback === 'function') {
          callback(null, code);
        }
      });

      child.on('error', (error) => {
        console.error(`Failed to start process: ${error.message}`);
        if (typeof callback === 'function') {
          callback(error);
        }
      });
    } catch (error) {
      console.error('Error running command:', error.message);
      if (typeof callback === 'function') {
        callback(error);
      }
    }
  }

  // Terminate a process by its PID
  terminateProcess(pid, callback) {
    const child = this.processes[pid];
    if (child) {
      child.kill();
      console.log(`Process ${pid} terminated`);
      if (typeof callback === 'function') {
        callback(null);
      }
    } else {
      console.error(`Process ${pid} not found`);
      if (typeof callback === 'function') {
        callback(new Error(`Process ${pid} not found`));
      }
    }
  }
}

// Example usage:
const manager = new ProcessManager();
manager.runCommand('ls', ['-l'], (error, code) => {
  if (error) {
    console.error('Error running command:', error);
  } else {
    console.log(`Command executed with exit code: ${code}`);
  }
});

// Terminate the process after 5 seconds
setTimeout(() => {
  const pid = Object.keys(manager.processes)[0];
  manager.terminateProcess(pid, (error) => {
    if (error) {
      console.error('Error terminating process:', error);
    } else {
      console.log(`Process ${pid} terminated successfully`);
    }
  });
}, 5000);