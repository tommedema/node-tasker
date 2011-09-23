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
    this.interval = setInterval(function() {
        
        /* check if queue is populated */
        
        /* check CPU, MEM and TasksRunning */
        
        /* call callback of first task */
        
        /* pass checkNext, onDone */
        
        /* clear interval until checkNext is called */
        
        /* update running tasks on onDone */
        
    }, tasker.options.pollRate);
};