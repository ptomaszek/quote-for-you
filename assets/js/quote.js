var CURRENT_QUOTE;

$(document).ready(function () {
    initStorage(loadScreen);
});

function loadScreen() {
    bindLinksAndModals();

    $("html body").animate({
    }, {
        start: function () {
            loadBackground();
            loadQuote();
        }
    });

}

function loadBackground() {
    log('fetching background image...');

    var uri = 'http://pipsum.com/1280x720.jpg';
    uri = 'dev_tmp/2560x1600.jpg'; //todo remove
    // uri = 'dev_tmp/640x480.jpg'; //todo remove

    $("<img>")
        .attr("src", uri)
        .on('load', function () {
            $("#backgroundImg")
                .hide()
                .attr("src", $(this).attr("src"))
                .fadeIn('slow');
        });

}

function loadQuote() {
    performForOption(FRESH_QUOTE_FREQUENCY_KEY, function (option) {
        switch (option) {
            case 'everyTab':
                fetchNewQuote();
                break;
            case 'everyDay':
                fetchTodaysQuote();
                break;
            default:
                throw 'none option set!';
        }
    });
}

function todayString() {
    return $.datepicker.formatDate('dd MM yy', new Date());
}

function displayQuote(quote) {
    quote.quoteDate = todayString();
    CURRENT_QUOTE = quote;
    storeQuote(quote);

    $('#quote').hide().text(quote.quoteText).fadeIn('fast');
    $('#author').hide().text(quote.quoteAuthor).fadeIn();
}

function storeQuote(newQuote) {
    performForOption(LAST_QUOTES_KEY, function (lastQuotesStored) {
            var lastQuotes = FixedQueue(3, lastQuotesStored);

            log('new quote to be stored:');
            log(newQuote);

            var lastQuotesLinks = lastQuotes.map(function (quote) {// links are like IDs
                return quote.quoteLink;
            });

            if ($.inArray(newQuote.quoteLink, lastQuotesLinks) !== -1) {
                log('quote already in store');
                return;
            }

            lastQuotes.push(newQuote);

            var storage = {};
            storage[LAST_QUOTES_KEY] = lastQuotes;
            chrome.storage.sync.set(storage, function () {
                log('new quote has been saved');
            });
        }
    );
}

function getBackupQuote() {
    //todo fetch from local store
    //todo check not shown recently
    return {
        quoteText: 'If there\'s no Internet, there are no quotes and no cats. So just relax.',
        quoteAuthor: "Anonymous",
        quoteLink: 'getBackupQuote'
    };
}

var fetchTodaysQuote = function () {
    log('fetching today\'s quote...')

    performForOption(LAST_QUOTES_KEY, function (lastQuotes) {
        var lastQuote = lastQuotes[lastQuotes.length - 1];

        if (typeof lastQuote !== 'undefined' && todayString() === lastQuote.quoteDate) {
            displayQuote(lastQuote);
        } else {
            fetchNewQuote();
        }
    });
};

var fetchNewQuote = function () {
    //todo language options
    var uri = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    uri = 'dev_tmp/test.json'; //todo remove
    // uri = 'dev_tmp/invalid.json'; //todo remove

    log('fetching new quote...')
    $.get(uri,
        function (quote) {
            quote = $.parseJSON(quote.replace(/\\'/g, "'"));
            displayQuote(quote);
        },
        'text')
        .fail(function (d, textStatus, err) {
            error("get() failed, status: " + textStatus + ", error: " + err)
            error(d);
            displayQuote(getBackupQuote());
        });
};
