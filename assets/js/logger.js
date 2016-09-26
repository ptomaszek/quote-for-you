log = function (value) {
    function logIt() {
        if ((value && typeof value !== 'object') || (typeof value === 'object' && Object.keys(value).length !== 0)) {
            console.log(JSON.stringify(value, null, 4));
        }
    }

    performForOption(LOGGING_ENABLED_KEY, function (option) {
        if (option) {
            logIt();
        }
    });
};

error = function (value) {
    console.error(JSON.stringify(value, null, 4));
};
