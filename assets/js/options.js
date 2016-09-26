// values are overridden by WebExtensions storage settings
var LOGGING_ENABLED_KEY = 'loggingEnabled';
var FRESH_QUOTE_FREQUENCY_KEY = 'freshQuoteFrequency';


function loadOptions() {
    chrome.storage.sync.get(
        [LOGGING_ENABLED_KEY,
            FRESH_QUOTE_FREQUENCY_KEY]
        , function (options) {
            document.querySelector('#logSetting').checked = options[LOGGING_ENABLED_KEY];
            document.querySelector('#frequencySetting [value="' + options[FRESH_QUOTE_FREQUENCY_KEY] + '"]').selected = true;
        });
}

function saveOptions() {
    var options = {};
    options[LOGGING_ENABLED_KEY] = document.querySelector('#logSetting').checked;
    options[FRESH_QUOTE_FREQUENCY_KEY] = document.querySelector('#frequencySetting option:checked').value;

    chrome.storage.sync.set(options);
}


function performForOption(optionKey, callback) {
    chrome.storage.sync.get(optionKey, function (options) {
        callback(options[optionKey]);
    });
}

//quotes storage (not options)
var LAST_QUOTES_KEY = 'latestQuotes';
var FAVOURITE_QUOTES_KEY = 'favouritesQuotes';

// init storage with defaults
function initStorage(callback) {
    chrome.storage.sync.get('initialized', function (options) {
        if (options.initialized) {
            callback();
        } else {
            initWithDefaults(callback);
        }

        function initWithDefaults(callback) {
            var defaultOptions = {};
            defaultOptions[LOGGING_ENABLED_KEY] = true;
            defaultOptions[FRESH_QUOTE_FREQUENCY_KEY] = 'everyTab';

            var defaultQuotesStorage = {};
            defaultQuotesStorage[LAST_QUOTES_KEY] = [];
            defaultQuotesStorage[FAVOURITE_QUOTES_KEY] = [];

            chrome.storage.sync.get(
                $.extend({}, defaultOptions, defaultQuotesStorage, {initialized: true})
                , function (options) {
                    chrome.storage.sync.set(options, callback);
                });
        }
    });
}
