var BLACK_LAY_OPACITY = 0.1;
var LINKS_HALF_HIDDEN_OPACITY = 0.4;
var LINKS_SHOWN_OPACITY = 0.9;
var HOVER_ON_SPEED = 150;
var HOVER_OFF_SPEED = 300;

function bindLinksAndModals() {
    $('#lay').animate({ opacity: BLACK_LAY_OPACITY });
    $('.linksContainerStyle').delay(1000).animate({ opacity: LINKS_HALF_HIDDEN_OPACITY });

    bindLatestLink();
    bindSettingsLink();
    bindAboutLink();
}

function lookup(array, prop, value) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] && array[i][prop] === value) {
            return array[i];
        }
    }
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

function bindAboutLink() {
    $('#aboutLink').click(function () {
         $('#aboutModal')
             .modal({
                 fadeDuration: 150,
                 fadeDelay: 0.50
             })
        return false;
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
    var leftColumn = $('<div class="leftColumn"></div>')
        .append($('<p class="modalQuoteDate"></p>').text(quote.quoteDate));

    var rightColumn= $('<div class="rightColumn"></div>')
        .append($('<p class="modalQuoteText"></p>').text(quote.quoteText))
        .append($('<p class="modalQuoteAuthor"></p>').text(quote.quoteAuthor));

    return $('<div class="modalRowParent"></div>')
        .attr("id", quote.quoteLink)
        .append(leftColumn)
        .append(rightColumn);
}

$("#quoteArea").hover(function() {
    $('#lay').stop().fadeTo(200, 0.7);
}, function() {
    $('#lay').stop().fadeTo(500, BLACK_LAY_OPACITY);
});

$("#layMenu").hover(function() {
    $(this).stop().fadeTo(HOVER_ON_SPEED, 0.8);
    $('.linksContainerStyle').stop().animate({ opacity: LINKS_SHOWN_OPACITY });
}, function() {
    $(this).stop().fadeTo(HOVER_OFF_SPEED, 0);
    $('.linksContainerStyle').stop().animate({ opacity: LINKS_HALF_HIDDEN_OPACITY });
 });

$(".linksContainerStyle").hover(function() {
    $(".linksContainerStyle").stop().animate({ opacity: LINKS_SHOWN_OPACITY });
    $('#layMenu').stop().fadeTo(HOVER_ON_SPEED, .8);
}, function() {
    $(".linksContainerStyle").stop().animate({ opacity: LINKS_HALF_HIDDEN_OPACITY });
    $('#layMenu').stop().fadeTo(HOVER_OFF_SPEED, 0);
});
