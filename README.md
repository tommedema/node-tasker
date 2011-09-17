node-tasker (system resource based task queue)
=============

Tasker allows you to queue simultaneous and asynchronous tasks based on the system's CPU usage, and/or memory usage and/or the amount of tasks running simultaneously.

Install
=======
    npm install tasker

API: tasker.create(options)
=======

Creates and returns a new tasker, which is an EventEmitter. Options is an object with the following properties:

* maxCpu: percentage (0-100) of processing power used in the last 10 seconds of total processing power available. If limit is exceeded, new tasks will be queued until resource is available again.
* maxMem: percentage (0-100) of memory of total memory available. If this limit is exceeded, new tasks will be queued until resource is available again.
* maxTasks: number of tasks that can run simultaneously. If this limit is exceeded, new tasks will be queue until one or more tasks have finished.
* pollRate: polling rate in milliseconds (defaults to 500) at which resources will be checked when tasks currently in queue need to be executed as soon as resource limits are no longer being exceeded.

API: planner (returned by tasker.create)
=======

planner.addTask(cb)
-------
cb is a function which is called immediately if no queue is necessary, or later when this task first needs to be queued:

    function(onDone, checkNext) {
        
        //execute our task here, eg. spawning a child process
        
        //when task is initialized, you must call checkNext() to ensure that the next task will be processed.
        
        //when task is done, inform tasker by calling onDone();
        
    }

You must call checkNext when your task has initialized. This ensures that your system's resource usage is inspected after your task has been setup (eg. increase of RAM after spawning a child process).

You must call onDone when the task has ended. A task has ended when it succeeded or failed.

This method returns a unique identifier (an integer) appointed to this task, like setTimeout does. 

planner.removeTask(id)
------
Removes the task represented by the given identifier from the queue. Note that tasks are removed from the queue when they are executed. Thus, if you wish to cancel a running task, you need to do so manually. This is outside the scope of tasker.

planner.destruct()
------
Destructs the planner, removing all event listeners and flushing the queue.

planner.getTasksRunning()
------
Returns the amount of currently running tasks.

planner.getTasksQueued()
------
Returns the amount of currently queued tasks.

All planner functions are chainable.

Planner events:
------

* planner.on('newTask', function(id) { }) : emitted when a new task has been added
* planner.on('taskStarted' function(id) { }) : emitted when a new task has started
* planner.on('taskQueued' function(id) { }) : emitted when a new task has been added to the queue
* planner.on('taskDone' function(id) { }) : emitted when a new task has finished
* planner.on('maxCpu' function(currentCpu) { }) : emitted when max cpu boundary has been exceeded
* planner.on('maxMem' function(currentMem) { }) : emitted when max mem boundary has been exceeded
* planner.on('maxTasks' function(currentAmount) { }) : emitted when max simultaneous tasks boundary has been exceeded

Usage Example
======

    var exec = require('child_process').exec,
        planner;

    planner = require('tasker').create({
        maxCpu: 90 /* queue new tasks when cpu is used over 90% */
      , maxMem: 80 /* queue new tasks when more than 80% of total memory is consumed */
      , maxTasks: 200 /* queue new tasks when more than 200 simultaneous tasks are running */
      , pollRate: 500 /* if the queue is populated, check for resource usage changes every 500ms */
    });
    
    /* spawn 500 processes planned such that we never use too many resources */
    var child;
    for (var i = 0, il = 500; i < il; i++) {
        planner.addTask(function(onDone, checkNext) {
        
            /* create and run process */
            child = exec('du -a /', function (error, stdout, stderr) {
                
                /* run onDone on end (success or failure) */
                onDone();
            });
            
            /* check next when initialized */
            checkNext();            
        
        });
    }
    
    /* listen to some useful events */
    planner
    .on('newTask', function(id) {
        console.log('new task created: ' + id);
    })
    .on('taskStarted', function(id) {
        console.log('new task started: ' + id);
    })
    .on('taskQueued', function(id) {
        console.log('new task queued: ' + id);
    })
    .on('taskDone', function(id) {
        console.log('task finished: ' + id);
    })
    .on('maxCpu', function(cpu) {
        console.log('cpu limit exceeded: ' + cpu);
    })
    .on('maxMem', function(mem) {
        console.log('mem limit exceeded: ' + mem);
    })
    .on('maxTasks', function(amount) {
        console.log('max tasks running: ' + amount);
    });

Things you should know
=======

Cpu usage is calculated in the following manner:

    var os          = require('os'),
        prevTimes   = getCpuTimes();
    
    function getCpuTimes() {
        var cpus    = os.cpus(),
            cpusl   = cpus.length,
            times   = {
                user: 0
              , sys : 0
              , nice: 0
              , idle: 0
            };
            
        cpus.forEach(function(cpu) {
            times.user += cpu.times.user;
            times.sys += cpu.times.sys;
            times.nice += cpu.times.nice;
            times.idle += cpu.times.idle;
        });
        
        times.user = times.user / cpusl;
        times.sys = times.sys / cpusl;
        times.nice = times.nice / cpusl;
        times.idle = times.idle / cpusl;
        
        return times;
    }
    
    function getCpuUsage() {
        var times   = getCpuTimes(),
            user    = prevTimes.user - times.user,
            sys     = prevTimes.sys - times.sys,
            nice    = prevTimes.nice - times.nice,
            idle    = prevTimes.idle - times.idle;
            
        prevTimes = times;
        
        return (user + sys + nice) / idle * 100;    
    }
    
    setInterval(function() {
        console.log('cpu usage percentage: ' + getCpuUsage());
    }, 1000);
    
 Memory usage is calculated like so:
 
    var os      = require('os'),
        perc    = os.freemem() / os.totalmem() * 100;
        
    console.log('memory usage percentage: ' + perc);