/**
 * Tasker, for Node.js.
 * 
 * Tasker allows you to queue simultaneous and asynchronous tasks based on the system's CPU usage, and/or memory usage and/or the amount of tasks running simultaneously.
 */

/* references and default settings */
var EventEmitter    = require('eventemitter2'),
    tasks           = require('./tasks'),
    queue           = require('./queue'),
    scheduler       = require('./scheduler'),
    defaultPollRate = 500;

/* create Tasker prototype */
var Tasker = Object.create(EventEmitter.prototype);
    Tasker.destruct = destructTasker;
    Tasker.addTask = tasks.addTask;
    Tasker.removeTask = tasks.removeTask;
    Tasker.getTasksRunning = scheduler.getTasksRunning;
    Tasker.getTasksQueued = queue.getTasksQueued;

/* creates a new tasker */
var create = exports.create = function(options) {
    
    /* validate input */
    if (!options.maxCpu && !options.maxMem && !options.maxTasks) throw new Error('Not a single resource limit has been set.');
    if (options.maxCpu && (typeof(options.maxCpu !== 'number') || options.maxCpu > 100 || options.maxCpu < 0)) throw new Error('maxCpu is set but not a valid number (0-100)');
    if (options.maxMem && (typeof(options.maxMem !== 'number') || options.maxMem > 100 || options.maxMem < 0)) throw new Error('maxMem is set but not a number (0-100)');
    if (options.maxTasks && (typeof(options.maxTasks !== 'number') || options.maxTasks < 1)) throw new Error('maxTasks is set but not a number (1 - Infinity)');
    if (options.pollRate && (typeof(options.pollRate !== 'number') || options.pollRate < 0)) throw new Error('pollRate must be a valid number > 0');
    
    /* set defaults */
    if (!options.pollRate) options.pollRate = defaultPollRate;
    
    /* create tasker */
    var tasker = Object.create(Tasker);
    
    /* set options and create empty state */
    tasker.options  = options;
    tasker.state    = {};
    
    /* return */
    return tasker;
};

/* destructs the given tasker */
function destructTasker() {
    var tasker = this;
    
    
}