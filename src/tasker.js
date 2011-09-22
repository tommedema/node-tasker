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
    if (options.maxCpu && typeof(options.maxCpu !== 'number')) throw new Error('maxCpu is set but not a number');
    if (options.maxMem && typeof(options.maxMem !== 'number')) throw new Error('maxMem is set but not a number');
    if (options.maxTasks && typeof(options.maxTasks !== 'number')) throw new Error('maxTasks is set but not a number');
    
    /* set defaults */
    if (!options.pollRate) options.pollRate = defaultPollRate;
    
    /* create tasker (an EventEmitter) */
    var tasker = new EventEmitter();
    tasker.options = options;
    
    /* public API */
    tasker.addTask = function(cb) {};
    tasker.removeTask = function(id) {};
    tasker.destruct = function() {};
    tasker.getTasksRunning = function() {};
    tasker.getTasksQueued = function() {};
};