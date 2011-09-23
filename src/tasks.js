var queue = require('./queue');

/* adds given task to the queue
 * returns the task that was added
 * 
 * taskCb is expected to have the following format: function(onDone, checkNext) {}
 * where onDone is called when the task has completed or failed,
 * and where checkNext is called when the task has initialized */
var addTask = exports.addTask = function(taskCb) {
    
    /* function is part of Tasker prototype */
    var tasker = this;
    
    /* add new task to queue, returns id */
    var task = tasker.queue.addTask(taskCb);
    
    /* task queued */
    tasker.emit('taskQueued', task);
    
    /* return id of task */
    return task;
};

/* removes given task from the queue */
var removeTask = exports.removeTask = function(task) {
    
    /* function is part of Tasker prototype */
    var tasker = this;
    
    /* remove by id */
    if (tasker.queue.removeTask(task)) {
        
        /* task removed */
        tasker.emit('taskRemoved', task);
    }
};

/* Task object */
var Task = exports.Task = function(id, cb, queued) {
    if (typeof(queued) !== 'boolean') queued = false;
    this.id = id;
    this.cb = cb;
    this.queued = queued;
};

/* executes the task */
Task.prototype.execute = function(checkNext, onDone) {
    
    /* ensure that it is queued */
    
    /* execute callback, passing checkNext and onDone */
    
    /* remove task from queue */
    
    /* ensure task queued is set to false */
};