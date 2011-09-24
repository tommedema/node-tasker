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
    
    /* check if queue is populated, if not check queue soon */
    if (!tasker.getTasksQueued()) return scheduler.checkQueueSoon();
    
    /* check CPU, MEM and TasksRunning, or check queue again soon */
    if (!scheduler.shouldExecTask()) return scheduler.checkQueueSoon();
    
    /* call callback of first task, pass checkNext and onDone */
    var task = tasker.queue.getFromIndex(0);
    
    /* execute task */
    this.executeTask(task);
};

/* checks the queue after the poll rate interval */
TaskScheduler.prototype.checkQueueSoon = function() {
    setTimeout(this.checkQueue.bind(this), this.tasker.options.pollRate);
};

/* returns whether our resources and options indicate that we should execute new tasks (true/false) */
TaskScheduler.prototype.shouldExecTask = function() {
    
    /* this is the scheduler */
    var scheduler   = this,
        tasker      = scheduler.tasker,
        options     = tasker.options;
    
    /* check each resource */
    var cpuUsage = getCpuUsage();
    if (options.maxCpu && cpuUsage > options.maxCpu) {
        tasker.emit('maxCpu', cpuUsage);
        return false;
    }
    var memUsage = getMemUsage();
    if (options.maxMem && memUsage.percentage > options.maxMem) {
        tasker.emit('maxMem', memUsage.percentage, memUsage.usage, memUsage.total);
        return false;
    }
    var tasksRunning = tasker.getTasksRunning();
    if (options.maxTasks && tasksRunning > options.maxTasks) {
        tasker.emit('maxTasks', tasksRunning);
        return false;
    }
    
    /* we should execute new tasks */
    return true;
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
    
    /* function to be called to check next task */
    var checkNext = function() {
        
        /* check the queue again */
        scheduler.checkQueue();
    };
    
    /* function to be called when task finishes */
    var onDone = function() {
        
        /* update running tasks */
        scheduler.runningTasks--;
        
        /* task done */
        tasker.emit('taskDone', task);
    };
    
    /* execute task */
    scheduler.runningTasks++;
    task.cb.apply(this, checkNext, onDone);
    
    /* task started */
    tasker.emit('taskStarted', task);
};

/* returns cpu usage as a percentage of total processing power (0-100) */
function getCpuUsage() {
    return cpu.getCpuUsage();
};

/* returns memory usage as a percentage of total memory available (0-100) */
function getMemUsage() {
    var total   = os.totalmem(),
        usage   = total - os.freemem(),
        perc    = usage / total * 100;

    return {
        usage       : usage
      , total       : total
      , percentage  : perc
    };
};