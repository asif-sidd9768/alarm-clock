const isValidDaysFormat = (days) => {
    const dayPattern = /^[0-6](,[0-6])*$/;
    const dayArray = days.split(',').map(Number);
    return dayPattern.test(days) && dayArray.every(day => day >= 0 && day <= 6);
}

module.exports = isValidDaysFormat