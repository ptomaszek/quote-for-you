var CURRENT_QUOTE;

$(document).ready(function () {
    $("html body").animate({
        backgroundColor: "#F7F7F7"
    }, {
        start: fetchQuote
    });
});

function showQuote(quote) {
    quote.quoteDate = $.datepicker.formatDate('dd MM yy', new Date());
    CURRENT_QUOTE = quote;
    storeQuote(quote);

    $('#quote').hide().text(quote.quoteText).fadeIn('fast');
    $('#author').hide().text(quote.quoteAuthor).fadeIn();
}

function storeQuote(newQuote) {
    chrome.storage.sync.get(
        LAST_QUOTES_KEY
        , function (data) {
            var lastQuotes = data[LAST_QUOTES_KEY];
            if (typeof lastQuotes === "undefined") {
                lastQuotes = FixedQueue(3, []);
            } else {
                lastQuotes = FixedQueue(3, lastQuotes);
            }

            log('latest quotes before save:');
            log(lastQuotes);
            log('new quote to be stored before save:');
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

var fetchQuote = function () {
    //todo language options
    var uri = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    uri = 'test.json'; //todo remove
    uri = 'invalid.json'; //todo remove

    $.get(uri,
        function (quote) {
            quote = $.parseJSON(quote.replace(/\\'/g, "'"));
            showQuote(quote);
        },
        'text')
        .fail(function (d, textStatus, err) {
            error("get() failed, status: " + textStatus + ", error: " + err)
            error(d);
            showQuote(getBackupQuote());
        });
};
