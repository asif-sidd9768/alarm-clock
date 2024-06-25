const { EventEmitter } = require('events');

// Alarm
class Alarm extends EventEmitter {
    constructor(time, days) {
        console.log("THIS RUNS")
        super();
        this.time = time;
        this.days = days;
        this.snoozeCount = 0;
        this.maxSnooze = 3;
        this.snoozeInterval = 5 * 60 * 1000;
        this.active = true;
    }

    // Checking the alarm and if it condition matches emit the event.
    checkAlarm() {
        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.toTimeString().slice(0, 5);

        if (this.days.includes(currentDay) && this.time === currentTime && this.active) {
            this.emit('alert');
        }
    }

    // Snooze the alarm by 5 minutes
    snooze() {
        if (this.snoozeCount < this.maxSnooze) {
            this.snoozeCount++;
            this.active = false;
            setTimeout(() => {
                this.active = true;
                this.emit('alert');
            }, this.snoozeInterval);
        } else {
            console.log('Max snooze limit reached');
        }
    }

    // Reset the snooze on "no" press.
    resetSnooze() {
        this.snoozeCount = 0;
        this.active = true;
    }
}

module.exports = Alarm