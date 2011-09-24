var exec = require('child_process').exec,
    Tasker = require('../src/tasker').Tasker;

var tasker = new Tasker({
    maxCpu: 40 /* queue new tasks when cpu is used over 90% */
  , maxMem: 40 /* queue new tasks when more than 80% of total memory is consumed */
  , maxTasks: 200 /* queue new tasks when more than 200 simultaneous tasks are running */
  , pollRate: 500 /* if the queue is populated, check for resource usage changes every 500ms */
});

/* listen to some useful events */
tasker
.on('taskStarted', function(task) {
    console.log('new task started: %o', task);
})
.on('taskQueued', function(task) {
    console.log('new task queued: %o', task);
})
.on('taskRemoved', function(task) {
    console.log('task removed from queue: %o', task);
})
.on('taskDone', function(task) {
    console.log('task finished: %o', task);
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

/* spawn 500 processes planned such that we never use too many resources */
var child;
for (var i = 0, il = 50; i < il; i++) {
    tasker.addTask(function(checkNext, onDone) {

        /* create and run process */
        child = exec('du -a /', function (error, stdout, stderr) {

            /* run onDone on end (success or failure) */
            onDone();
        });

        /* check next when initialized */
        checkNext();            

    });
}
