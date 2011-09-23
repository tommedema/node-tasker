/* returns amount of tasks currently running */
var getTasksRunning = exports.getTasksRunning = function() {
    
    /* function is part of Tasker prototype */
    var tasker = this;
    
    /* return amount */
    return tasker.tasksRunning;
};