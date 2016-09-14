$(document).ready(function () {
    $("html body").animate({
        backgroundColor: "#F7F7F7"
    }, {
        start: fetchQuote
    });

    //bind modals
    $('#settingsLink').click(function () {
        $('#settingsModal')
            .modal({
                fadeDuration: 150,
                fadeDelay: 0.50
            })
            .on($.modal.CLOSE, function () {
                saveOptions();
            })
            .on($.modal.OPEN, function () {
                loadOptions();
            });
        return false;
    });
});


function showQuote(quote) {
    $('#quote').hide().text(quote.quoteText).fadeIn('fast');
    $('#author').hide().text(quote.quoteAuthor).fadeIn();
}

function storeQuote(newQuote) {
    chrome.storage.sync.get(
        'lastQuotes'
        , function (data) {
            var lastQuotes = data.lastQuotes;
            if (typeof lastQuotes === "undefined") {
                lastQuotes = FixedQueue(3, []);
            } else {
                lastQuotes = FixedQueue(3, lastQuotes);
            }

            log('lastQuotes before save:');
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

            lastQuotes.unshift(newQuote);

            chrome.storage.sync.set({
                'lastQuotes': lastQuotes
            }, function () {
                log('new quote has been saved');
            });

        }
    );

}

function populateWithBackupQuote() {
    //todo fetch from local store
    //todo check not shown recently
    var quote = {
        quoteText: 'Cold is cold',
        quoteAuthor: "and that's bold"
    };
    showQuote(quote)
}

var fetchQuote = function () {
    //todo language options
    var uri = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    uri = 'test.json'; //todo remove
    // uri = 'invalid.json'; //todo remove

    $.get(uri,
        function (quote) {
            quote = $.parseJSON(quote.replace(/\\'/g, "'"));
            showQuote(quote);
            storeQuote(quote);
        },
        'text')
        .fail(function (d, textStatus, error) {
            error("get() failed, status: " + textStatus + ", error: " + error)
            error(d);
            populateWithBackupQuote();
        });
};

$('#clearLast').click(function () {
    chrome.storage.sync.set({'lastQuotes': undefined});
});