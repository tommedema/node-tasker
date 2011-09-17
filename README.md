node-tasker (system resource based task queue)
=============

Tasker allows you to queue simultaneous and asynchronous tasks based on the system's CPU usage, and/or memory usage and/or the amount of tasks running simultaneously.


API: tasker.create(options)
=======

Creates and returns a new tasker, which is an EventEmitter. Options is an object with the following properties:

* maxCpu: percentage (0-100) of processing power used in the last 10 seconds of total processing power available. If limit is exceeded, new tasks will be queued until resource is available again.
* maxMem: percentage (0-100) of memory of total memory available. If this limit is exceeded, new tasks will be queued until resource is available again.
* maxTasks: number of tasks that can run simultaneously. If this limit is exceeded, new tasks will be queue until one or more tasks have finished.
* pollRate: polling rate in milliseconds (defaults to 500) at which resources will be checked when tasks currently in queue need to be executed as soon as resource limits are no longer being exceeded.

API: planner (returned by tasker.create)
=======

planner.addTask(cb, name)
-------
cb is a function which is called immediately if no queue is necessary, or later when this task first needs to be queued:

    function(onDone, checkNext) {
        
        //execute our task here, eg. spawning a child process
        
        //when task is initialized, you must call checkNext() to ensure that the next task will be processed.
        
        //when task is done, inform tasker by calling onDone();
        
    }

You must call checkNext when your task has initialized. This ensures that your system's resource usage is inspected while your task has been setup (eg. increase of RAM by spawning a child process).

Name is optional. It is only needed if you wish to remove tasks from the queue.

planner.removeTask(name)
------
Removes the task represented by the given name (identifier) from the queue. Note that tasks are removed from the queue when they are executed. Thus, if you wish to cancel a running task, you need to do so manually. This is outside the scope of tasker.

planner.destruct
------
Destructs the planner, removing all event listeners and flushing the queue.

Getters/setters:
-------

* planner.getMaxCpu() : returns current max cpu setting
* planner.setMaxCpu(percentage) : sets new max cpu setting
* planner.getMaxMem() : returns current max mem setting
* planner.setMaxMem(percentage) : sets new max mem setting
* planner.getMaxTasks() : returns current max simultaneous tasks setting
* planner.setMaxTasks(amount) : sets new max simultaneous tasks setting
* planner.getTasksAmount() : returns current amount of simultaneously running tasks

All planner functions are chainable.

Planner events:
------

* planner.on('newTask', function(name) { }) : emitted when a new task has been added
* planner.on('taskStarted' function(name) { }) : emitted when a new task has started
* planner.on('taskQueued' function(name) { }) : emitted when a new task has been added to the queue
* planner.on('taskDone' function(name) { }) : emitted when a new task has finished
* planner.on('maxCpu' function(currentCpu) { }) : emitted when max cpu boundary has been exceeded
* planner.on('maxMem' function(currentMem) { }) : emitted when max mem boundary has been exceeded
* planner.on('maxTasks' function(currentAmount) { }) : emitted when max simultaneous tasks boundary has been exceeded