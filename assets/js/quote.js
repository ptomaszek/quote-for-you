var CURRENT_QUOTE;

$(document).ready(function () {
    $("html body").animate({
        backgroundColor: "#F7F7F7"
    }, {
        start: fetchQuote
    });

    bindAddToFavouritesLink();
    bindFavouritesLink();
    bindLastQuotesLink();
    bindSettingsLink();
});

function bindAddToFavouritesLink() {
    $('#addToFavourites').click(function () {
        chrome.storage.sync.get(
            FAVOURITE_QUOTES_KEY
            , function (data) {
                var favouriteQuotes = data[FAVOURITE_QUOTES_KEY];
                if (typeof favouriteQuotes === "undefined") {
                    favouriteQuotes = FixedQueue(10, []);
                } else {
                    favouriteQuotes = FixedQueue(10, favouriteQuotes);
                }

                log('favouriteQuotes before save:');
                log(favouriteQuotes);
                log('quote to be added to favourites:');
                log(CURRENT_QUOTE);

                var favouriteQuotesLinks = favouriteQuotes.map(function (quote) {// links are like IDs
                    return quote.quoteLink;
                });

                if ($.inArray(CURRENT_QUOTE.quoteLink, favouriteQuotesLinks) !== -1) {
                    log('quote already in favourites');
                    return;
                }

                favouriteQuotes.unshift(CURRENT_QUOTE);

                var storage = {};
                storage[FAVOURITE_QUOTES_KEY] = favouriteQuotes;
                chrome.storage.sync.set(storage, function () {
                    log('new quote has been saved');
                });

            }
        );
    });
}

function bindFavouritesLink() {
    $('#favouritesLink').click(function () {
        $('#favouritesModal')
            .modal({
                fadeDuration: 150,
                fadeDelay: 0.50
            })
            .on($.modal.OPEN, function () {
                reloadFavourites();
            });
        return false;
    });
}

function bindLastQuotesLink() {
    $('#lastQuotesLink').click(function () {
        $('#lastQuotesModal')
            .modal({
                fadeDuration: 150,
                fadeDelay: 0.50
            })
            .on($.modal.OPEN, function () {
                reloadLastQuotes();
            });
        return false;
    });
}

function bindSettingsLink() {
    $('#settingsLink').click(function () {
        $('#settingsModal')
            .modal({
                showClose: false,
                fadeDuration: 150,
                fadeDelay: 0.50
            })
            .on($.modal.OPEN, function () {
                loadOptions();
            })
            .on($.modal.CLOSE, function () {
                saveOptions();
            });
        return false;
    });
}


function reloadFavourites() {
    chrome.storage.sync.get(FAVOURITE_QUOTES_KEY, function (data) {
        var favourites = data[FAVOURITE_QUOTES_KEY];

        $('#favouritesModal').empty();
        $(favourites).each(function (index, quote) {
            $('#favouritesModal')
                .append($('<p class="favouriteQuoteText"></p>').text(quote.quoteText))
                .append($('<p class="favouriteQuoteAuthor"></p>').text(quote.quoteAuthor))
        });
    });
}

function reloadLastQuotes() {
    chrome.storage.sync.get(LAST_QUOTES_KEY, function (data) {
        var lastQuotes = data[LAST_QUOTES_KEY];

        $('#lastQuotesModal').empty();
        $(lastQuotes).each(function (index, quote) {
            $('#lastQuotesModal')
                .append($('<p class="favouriteQuoteText"></p>').text(quote.quoteText))
                .append($('<p class="favouriteQuoteAuthor"></p>').text(quote.quoteAuthor))
        });
    });
}

function showQuote(quote) {
    CURRENT_QUOTE = quote;
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

            var storage = {};
            storage[LAST_QUOTES_KEY] = lastQuotes;
            chrome.storage.sync.set(storage, function () {
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
    uri = 'invalid.json'; //todo remove

    $.get(uri,
        function (quote) {
            quote = $.parseJSON(quote.replace(/\\'/g, "'"));
            showQuote(quote);
            storeQuote(quote);
        },
        'text')
        .fail(function (d, textStatus, err) {
            error("get() failed, status: " + textStatus + ", error: " + err)
            error(d);
            populateWithBackupQuote();
        });
};

$('#clearFavouritesQuotes').click(function () {
    var storage = {};
    storage[FAVOURITE_QUOTES_KEY] = undefined;
    chrome.storage.sync.set(storage);
});