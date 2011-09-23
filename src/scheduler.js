var os  = require('os'),
    cpu = require('./cpu');

/* returns amount of tasks currently running */
var getTasksRunning = exports.getTasksRunning = function() {
    
    /* function is part of Tasker prototype */
    var tasker = this;
    
    /* return amount */
    return tasker.scheduler.runningTasks;
};

/* TaskScheduler */
var TaskScheduler = exports.TaskScheduler = function(tasker) {
    
    /* save reference to tasker */
    this.tasker = tasker;
    
    /* default to 0 running tasks */
    this.runningTasks = 0;
    
    /* check queue */
    this.checkQueue();
};

/* checks the queue for possibly needed activity */
TaskScheduler.prototype.checkQueue = function() {
    
    /* this is the scheduler */
    var scheduler   = this,
        tasker      = scheduler.tasker;
    
    /* check if queue is populated */
    if (!tasker.getTasksQueued()) return checkQueueSoon();
    
    /* check CPU, MEM and TasksRunning */
    if (!this.shouldExecTask()) return checkQueueSoon();
    
    /* call callback of first task, pass checkNext and onDone */
    var task = tasker.queue.getFromIndex(0);
    
    /* function to be called to check next task */
    var checkNext = function() {
        
        /* check the queue again */
        this.checkQueue();
    };
    
    /* function to be called when task finishes */
    var onDone = function() {
        
        /* update running tasks */
        scheduler.runningTasks--;
        
        /* task done */
        tasker.emit('taskDone', task);
    };
    
    /* execute task */
    this.executeTask(task, checkNext, onDone);
};

/* checks the queue after the poll rate interval */
TaskScheduler.prototype.checkQueueSoon = function() {
    setTimeout(checkQueue.bind(this), this.tasker.options.pollRate);
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
    return cpu.getCpuUsage();
};

/* returns memory usage as a percentage of total memory available (0-100) */
TaskScheduler.prototype.getMemUsage = function() {
    return os.freemem() / os.totalmem() * 100;
};

/* executes the given task, removing it from the queue */
TaskScheduler.prototype.executeTask = function(task, checkNext, onDone) {
    
    /* this is the scheduler */
    var scheduler   = this,
        tasker      = scheduler.tasker;
    
    /* remove task from queue */
    if (tasker.queue.removeTask(task)) {
        
        /* task removed */
        tasker.emit('taskRemoved', task);
    }
    
    /* execute task */
    task.cb.apply(this, checkNext, onDone);
    
    /* task started */
    tasker.emit('taskStarted', task);
};