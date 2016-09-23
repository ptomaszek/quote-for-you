$(document).ready(function () {
    bindAddToFavouritesLink();
    bindFavouritesLink();
    bindLatestLink();
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

                favouriteQuotes.push(CURRENT_QUOTE);

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

function bindLatestLink() {
    $('#latestLink').click(function () {
        $('#latestModal')
            .modal({
                fadeDuration: 150,
                fadeDelay: 0.50
            })
            .on($.modal.OPEN, function () {
                reloadLatest();
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

        var $favouritesContent = $('#favouritesModal div[content]');
        $favouritesContent.empty();
        $(favourites).each(function (index, quote) {
            $favouritesContent.append(buildModalQuoteRow(quote));
        });
    });
}

function reloadLatest() {
    chrome.storage.sync.get(LAST_QUOTES_KEY, function (data) {
        var lastQuotes = data[LAST_QUOTES_KEY];

        var $latestContent = $('#latestModal div[content]');
        $latestContent.empty();
        $(lastQuotes).each(function (index, quote) {
            $latestContent.append(buildModalQuoteRow(quote));
        });
    });
}

function buildModalQuoteRow(quote) {
    return $('<div class="modalQuoteRow"></div>')
        .attr("id", quote.quoteLink)
        .append($('<p class="modalQuoteText"></p>').text(quote.quoteText))
        .append($('<p class="modalQuoteAuthor"></p>').text(quote.quoteAuthor))
        .append($('<p class="modalQuoteDate"></p>').text(quote.quoteDate));
}

$('#clearFavourites').click(function () {
    var storage = {};
    storage[FAVOURITE_QUOTES_KEY] = FixedQueue(10, []);
    chrome.storage.sync.set(storage);
    reloadFavourites();
});