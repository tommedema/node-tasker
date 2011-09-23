/**
 * Tasker, for Node.js.
 * 
 * Tasker allows you to queue simultaneous and asynchronous tasks based on the system's CPU usage, and/or memory usage and/or the amount of tasks running simultaneously.
 */

/* references and default settings */
var EventEmitter    = require('events').EventEmitter,
    defaultPollRate = 500;

/* creates a new tasker */
var create = exports.create = function(options) {
    
    /* validate input */
    if (!options.maxCpu && !options.maxMem && !options.maxTasks) throw new Error('Not a single resource limit has been set.');
    if (options.maxCpu && (typeof(options.maxCpu !== 'number') || options.maxCpu > 100 || options.maxCpu < 0)) throw new Error('maxCpu is set but not a valid number (0-100)');
    if (options.maxMem && (typeof(options.maxMem !== 'number') || options.maxMem > 100 || options.maxMem < 0)) throw new Error('maxMem is set but not a number (0-100)');
    if (options.maxTasks && (typeof(options.maxTasks !== 'number') || options.maxTasks < 1)) throw new Error('maxTasks is set but not a number (1 - Infinity)');
    
    /* set defaults */
    if (!options.pollRate) options.pollRate = defaultPollRate;
    
    /* create tasker (an EventEmitter) */
    var tasker = new EventEmitter();
    tasker.options = options;
    
    /* public API */
    tasker.destruct = function() {};
    tasker.addTask = function() {};
    tasker.removeTask = function() {};
    tasker.getTasksRunning = function() {};
    tasker.getTasksQueued = function() {};
};