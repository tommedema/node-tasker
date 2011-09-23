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

/* adds task to the queue, returns id */
TaskQueue.prototype.addTask = function(cb) {
    var id = this.generateTaskId();
    this.taskList.push(new tasks.Task(id, cb));
    return id;
};

/* removes a task from the queue, by id */
TaskQueue.prototype.removeTask = function(id) {
    this.taskList = this.taskList.filter(function(item) {
        return (item.id !== id);
    });
};

/* generates unique id for a task */
TaskQueue.prototype.generateTaskId = function() {
    return ++this.newTaskId;
};