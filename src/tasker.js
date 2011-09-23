/**
 * Tasker, for Node.js.
 * 
 * Tasker allows you to queue simultaneous and asynchronous tasks based on the system's CPU usage, and/or memory usage and/or the amount of tasks running simultaneously.
 */

/* references and default settings */
var EventEmitter    = require('eventemitter2').EventEmitter2,
    util            = require('util'),
    tasks           = require('./tasks'),
    queue           = require('./queue'),
    scheduler       = require('./scheduler'),
    defaultPollRate = 500;

/* the Tasker object */
var Tasker = exports.Tasker = function(options) {
    
    /* inherit from EventEmitter */
    EventEmitter.call(this);
    
    /* validate input */
    if (!options.maxCpu && !options.maxMem && !options.maxTasks) throw new Error('Not a single resource limit has been set.');
    if (options.maxCpu && (typeof(options.maxCpu) !== 'number' || options.maxCpu > 100 || options.maxCpu < 0)) throw new Error('maxCpu is set but not a valid number (0-100)');
    if (options.maxMem && (typeof(options.maxMem) !== 'number' || options.maxMem > 100 || options.maxMem < 0)) throw new Error('maxMem is set but not a number (0-100)');
    if (options.maxTasks && (typeof(options.maxTasks) !== 'number' || options.maxTasks < 1)) throw new Error('maxTasks is set but not a number (1 - Infinity)');
    if (options.pollRate && (typeof(options.pollRate) !== 'number' || options.pollRate < 0)) throw new Error('pollRate must be a valid number > 0');
    
    /* set defaults */
    if (!options.pollRate) options.pollRate = defaultPollRate;
    
    /* set options and initialize state */
    tasker.options      = options;
    tasker.queue        = new queue.TaskQueue();
    tasker.tasksRunning = 0;
    tasker.scheduler    = new scheduler.TaskScheduler(tasker);
};

/* build prototype, inheriting from EventEmitter */
util.inherits(Tasker, EventEmitter);

/* public API */
Tasker.prototype.destruct = destructTasker;
Tasker.prototype.addTask = tasks.addTask;
Tasker.prototype.removeTask = tasks.removeTask;
Tasker.prototype.getTasksRunning = scheduler.getTasksRunning;
Tasker.prototype.getTasksQueued = queue.getTasksQueued;

/* destructs the given tasker */
function destructTasker() {
    
    /* function is part of Tasker prototype */
    var tasker = this;
    
    /* TODO: destruct tasker */
}