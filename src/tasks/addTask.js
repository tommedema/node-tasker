/**
 * Adds a task to the given tasker.
 * 
 * Callback looks like:

   function(onDone, checkNext) {

        // execute our task here, eg. spawning a child process
    
        // when task is initialized, you must call checkNext() to ensure that the next task will be processed.
    
        // when task is done, inform tasker by calling onDone();

    }
    
 */

module.exports = function(tasker, cb) {
    
    /* get queue for given tasker (new queue module with getQueue(tasker)) function */
    
    /* add to queue */
    
    /* fire appropriate event */
    
    /* DO NOT check queue for possibly needed activity (checkNext must be called) */
    
    /* return id for this new task */
    
};