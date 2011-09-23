/* adds given task to the queue
 * returns a unique identifier for this task
 * 
 * taskCb is expected to have the following format: function(onDone, checkNext) {}
 * where onDone is called when the task has completed or failed,
 * and where checkNext is called when the task has initialized */
var addTask = exports.addTask = function(taskCb) {
    var tasker = this;
    
};

/* removes given task from the queue */
var removeTask = exports.removeTask = function(taskId) {
    var tasker = this;
    
};