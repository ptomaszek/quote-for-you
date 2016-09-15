// values are overridden by WebExtensions storage settings
var DEFAULT_OPTIONS = {};

var LOGGING_ENABLED_KEY = 'loggingEnabled';

DEFAULT_OPTIONS[LOGGING_ENABLED_KEY] = false;
DEFAULT_OPTIONS[LAST_QUOTES_KEY] = [];


function loadOptions() {
    chrome.storage.sync.get(
        DEFAULT_OPTIONS
        , function (options) {
            document.querySelector('#logSetting').checked = options[LOGGING_ENABLED_KEY];
        });
}

function saveOptions() {
    var options = {};
    options[LOGGING_ENABLED_KEY] = document.querySelector('#logSetting').checked;
    chrome.storage.sync.set(options);
}

//storage keys (not options)
var LAST_QUOTES_KEY = 'lastQuotes';
var FAVOURITE_QUOTES_KEY = 'favouritesQuotes';