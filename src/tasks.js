var queue = require('./queue');

/* adds given task to the queue
 * returns a unique identifier for this task
 * 
 * taskCb is expected to have the following format: function(onDone, checkNext) {}
 * where onDone is called when the task has completed or failed,
 * and where checkNext is called when the task has initialized */
var addTask = exports.addTask = function(taskCb) {
    
    /* function is part of Tasker prototype */
    var tasker = this;
    
    /* add new task to queue, returns id */
    var id = tasker.queue.addTask(taskCb);
    
    /* return id of task */
    return id;
};

/* removes given task from the queue */
var removeTask = exports.removeTask = function(taskId) {
    
    /* function is part of Tasker prototype */
    var tasker = this;
    
    /* remove by id */
    tasker.queue.removeTask(taskId);
};

/* Task object */
var Task = exports.Task = function(id, cb) {
    this.id = id;
    this.cb = cb;
};