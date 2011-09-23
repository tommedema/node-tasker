var tasks = require('./tasks');

/* returns amount of tasks currently in queue */
var getTasksQueued = exports.getTasksQueued = function() {
    
    /* function is part of Tasker prototype */
    var tasker = this;
    
    /* return amount */
    return tasker.queue.taskList.length;
};

/* TaskQueue object */
var TaskQueue = exports.TaskQueue = function() {
    
    /* init empty taskList and set new task id */
    this.taskList = [];
    this.newTaskId = 0;
};

/* adds task to the queue, returns task */
TaskQueue.prototype.addTask = function(cb) {
    
    /* create task */
    var id      = this.generateTaskId(),
        task    = new tasks.Task(id, cb);
    
    /* add to list */
    this.taskList.push(task);
    
    /* return task */
    return task;
};

/* removes a task from the queue, returns removed task or null */
TaskQueue.prototype.removeTask = function(task) {
    for (var i = 0, il = this.taskList.length; i < il; i++) {
        if (this.taskList[i] === task) {
            taskList.splice(i, 1);
            return task;
        }
    }
    return null;
};

/* returns tasks at given index, or null if non-existant */
TaskQueue.prototype.getFromIndex = function(index) {
    return this.taskList[index];
};

/* generates unique id for a task */
TaskQueue.prototype.generateTaskId = function() {
    return ++this.newTaskId;
};