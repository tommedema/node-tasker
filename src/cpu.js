/**
 * Deals with cpu calculations.
 */

var os          = require('os'),
    prevTimes   = getCpuTimes(),
    cpuUsage    = 0;

exports.getCpuUsage = function() {
    return cpuUsage;
};

function getCpuTimes() {
    var cpus = os.cpus(),
        times = {
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

    return times;
}

function updateCpuUsage() {
    var times = getCpuTimes(),
        user = prevTimes.user - times.user,
        sys = prevTimes.sys - times.sys,
        nice = prevTimes.nice - times.nice,
        idle = prevTimes.idle - times.idle,
        usage = user + sys + nice;

    prevTimes = times;

    cpuUsage = usage / (usage + idle) * 100;
}

setInterval(updateCpuUsage, 500);
updateCpuUsage();