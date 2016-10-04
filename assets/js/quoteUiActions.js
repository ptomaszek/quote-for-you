function bindLinksAndModals() {
    bindAddToFavouritesLink();
    bindFavouritesLink();
    bindLatestLink();
    bindSettingsLink();
}

function addQuoteToFavourites(quote) {
    performForOption(FAVOURITE_QUOTES_KEY, function (favouritesStored) {
            var favourites = FixedQueue(10, favouritesStored);

            log('quote to be added to favourites:');
            log(quote);

            var favouriteQuotesLinks = favourites.map(function (quote) {// links are like IDs
                return quote.quoteLink;
            });

            if ($.inArray(quote.quoteLink, favouriteQuotesLinks) !== -1) {
                log('quote already in favourites');
                return;
            }

            favourites.push(quote);

            var storage = {};
            storage[FAVOURITE_QUOTES_KEY] = favourites;
            chrome.storage.sync.set(storage, function () {
                log('new quote has been saved');
            });
        }
    );
}
function bindAddToFavouritesLink() {
    $('#addToFavourites').click(function () {
        addQuoteToFavourites(CURRENT_QUOTE);
    });
}


function bindAddToFavouritesChosenLink() {
    $('.addToFavouritesChosen').click(function () {
        var chosenQuoteId = $(this).parent().attr('id');

        performForOption(LAST_QUOTES_KEY, function (lastQuotes) {
            var chosenQuote = lookup(lastQuotes, 'quoteLink', chosenQuoteId);
            addQuoteToFavourites(chosenQuote);
        })
    });
}

function lookup(array, prop, value) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] && array[i][prop] === value) {
            return array[i];
        }
    }
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
            $latestContent.append(
                buildModalQuoteRow(quote)
                    .append($(' <a href="#" class="addToFavouritesChosen">Add to favourites TODO</a>'))
            );
        });

        bindAddToFavouritesChosenLink();
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

//todo remove or move to settings as 'Clear all the settings, last quotes, favourites and so on'
$('#clearAllDevLink').click(function () {
    chrome.storage.sync.clear();
});

$("#quoteArea").hover(function() {
    $('#lay').fadeTo(200, 0.7);
}, function() {
    $('#lay').fadeTo(200, 0);
});