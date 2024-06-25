const readline = require('readline');
const chalk = require("chalk");
const Alarm = require('./Alarm');
const DAYS = require('../constants/days');
const isValidTimeFormat = require('../utils/checkTime');
const isValidDaysFormat = require('../utils/checkDays');

// Alarm clock
class AlarmClock {
    constructor() {
        this.alarms = [];
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk.bold('Alarm Clock> ')
        });

        this.menu();
        this.alignToNextMinute(() => this.checkAlarms());
    }

    // Display the current time on menu.
    showCurrentTime() {
        return new Date().toLocaleTimeString()
    }

    // Shows the menu for alarm clock.
    menu() {
        console.log(chalk.blue('\nAlarm Clock Menu:'));
        console.log(chalk.red(`Current Time: ${this.showCurrentTime()}`));
        console.log(chalk.yellow('1. Create Alarm'));
        console.log(chalk.yellow('2. Delete Alarm'));
        console.log(chalk.yellow('3. List Alarms'));
        console.log(chalk.yellow('4. Exit'));
        this.readline.prompt();

        this.readline.removeAllListeners('line');
        this.readline.on('line', (line) => {
            switch (line.trim()) {
                case '1':
                    this.createAlarm();
                    break;
                case '2':
                    this.deleteAlarm();
                    break;
                case '3':
                    this.listAlarms();
                    break;
                case '4':
                    this.exit();
                    break;
                default:
                    console.log('Invalid option');
                    this.menu();
            }
        });
    }

    // Creating alarm with two arguments, time and days.
    createAlarm() {
        this.readline.question('Enter alarm time (HH:MM) in 24 hours: ', (time) => {
            // checks for invalid input
            if (!isValidTimeFormat(time)) {
                console.log('Invalid time format. Please enter in HH:MM format.');
                return this.createAlarm();
            }
            this.readline.question('Enter days (comma-separated 0-6 where 0 is Sunday) default 0: ', (days) => {
                days = days === "" ? "0" : days
                console.log({days})
                if (!isValidDaysFormat(days)) {
                    console.log('Invalid days format. Please enter numbers 0-6, separated by commas.');
                    return this.handleCreateAlarm();
                }

                const dayArray = days.split(',').map(Number);
                const alarm = new Alarm(time, dayArray);
                // alert will be shown when alarm time matches current time.
                alarm.on('alert', () => {
                    console.log(`\nAlarm! Time: ${time}`);
                    this.readline.question('Snooze? (y/n): ', (answer) => {
                        if (answer.toLowerCase() === 'y') {
                            alarm.snooze();
                            this.menu()
                        } else {
                            alarm.resetSnooze();
                            this.menu()
                        }
                        this.readline.prompt();
                    });
                });
                this.alarms.push(alarm);
                this.menu();
            });
        });
    }

    // Deletes the alarm by alarm number.
    deleteAlarm() {
        this.listAlarms();
        this.readline.question('Enter alarm number to delete: ', (index) => {
            const alarmIndex = parseInt(index.trim(), 10) - 1;
            if (alarmIndex >= 0 && alarmIndex < this.alarms.length) {
                const alarm = this.alarms[alarmIndex]
                this.alarms.splice(alarmIndex, 1);
                alarm.removeAllListeners('alert');
                console.log('Alarm deleted');
            } else {
                console.log('Invalid alarm number');
            }
            this.menu();
        });
    }

    // Shows the list of alarms.
    listAlarms() {        
        if(this.alarms.length>0){
            console.log('Current Alarms: ');
            this.alarms.forEach((alarm, index) => {
                let days = alarm.days.length === 7 ? "Everyday" : alarm.days.map(day => DAYS[day]).join(',')
                console.log(`${index + 1}. Time: ${alarm.time}, Days: ${days}`);
            });
        }else{
            console.log('\nNo Current Alarms');
        }
        this.menu();
    }

    // Exit the alarm clock menu.
    exit() {
        console.log('Exiting...');
        this.readline.close();
        process.exit(0);
    }

    // Utility function to align check alarm to start of each minute.
    alignToNextMinute(callback) {
        const now = new Date();
        const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

        setTimeout(() => {
            callback();
            setInterval(callback, 60000);
        }, delay);
    }

    // Checking alarms at every minute.
    checkAlarms() {
        this.alarms.forEach(alarm => alarm.checkAlarm());
    }
}

module.exports = AlarmClock