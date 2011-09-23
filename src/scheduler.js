/* returns amount of tasks currently running */
var getTasksRunning = exports.getTasksRunning = function() {
    
    /* function is part of Tasker prototype */
    var tasker = this;
    
    /* return amount */
    return tasker.tasksRunning;
};

/* TaskScheduler */
var TaskScheduler = exports.TaskScheduler = function(tasker) {
    
    /* save reference to tasker */
    this.tasker = tasker;
    
    /* set interval */
    this.interval = setInterval(this.checkQueue, tasker.options.pollRate);
};

/* checks the queue for possibly needed activity */
TaskScheduler.prototype.checkQueue = function() {
    
    /* this is the scheduler */
    var scheduler   = this,
        tasker      = scheduler.tasker;
    
    /* check if queue is populated */
    if (!tasker.getTasksQueued()) return;
    
    /* check CPU, MEM and TasksRunning */
    if (!this.shouldExecTask()) return;
    
    /* call callback of first task, pass checkNext and onDone */
    var task  = tasker.queue.getFromIndex(0);
    //task.execute();
    
    /* pass checkNext, onDone */
    
    /* clear interval until checkNext is called */
    
    /* update running tasks on onDone */
    
};

/* returns whether our resources and options indicate that we should execute new tasks (true/false) */
TaskScheduler.prototype.shouldExecTask = function() {
    
    /* this is the scheduler */
    var scheduler   = this,
        tasker      = scheduler.tasker,
        options     = tasker.options;
    
    /* check each resource */
    if (options.maxCpu && getCpuUsage() > options.maxCpu) {
        tasker.emit('maxCpu');
        return false;
    }
    if (options.maxMem && getMemUsage() > options.maxMem) {
        tasker.emit('maxMem');
        return false;
    }
    if (options.maxTasks && tasker.getTasksRunning() > options.maxTasks) {
        tasker.emit('maxTasks');
        return false;
    }
    
    /* we should execute new tasks */
    return true;
};

/* returns cpu usage as a percentage of total processing power (0-100) */
TaskScheduler.prototype.getCpuUsage = function() {
    
};

/* returns memory usage as a percentage of total memory available (0-100) */
TaskScheduler.prototype.getMemUsage = function() {
    
};