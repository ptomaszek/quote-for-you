var LOGGING_ENABLED_KEY = 'loggingEnabled';
log = function (value) {
    function logIt() {
        if ((value && typeof value !== 'object') || (typeof value === 'object' && Object.keys(value).length !== 0)) {
            console.log(JSON.stringify(value, null, 4));
        }
    }

    chrome.storage.local.get(LOGGING_ENABLED_KEY, function (options) {
        // if (options[LOGGING_ENABLED_KEY]) {
            logIt();
        // }
    });
};

error = function (value) {
        console.error(JSON.stringify(value, null, 4));
};