$(document).ready(function () {
    $("html body").animate({
        backgroundColor: "#F7F7F7"
    }, {
        start: fetchQuote
    });
});

function populateWithQuote(quote) {
    $('#quote').text(quote.quoteText);
    $('#author').text(quote.quoteAuthor);
}

function populateWithBackupQuote() {
    //todo fetch from local store
    //todo check not shown recently
    var quote = {
        quoteText: 'Cold is cold',
        quoteAuthor: "and that's bold"
    };
    populateWithQuote(quote)
}

var fetchQuote = function () {
    //todo language options
    var uri = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    uri = 'test.json'; //todo remove
    uri = 'invalid.json'; //todo remove

    $.get(uri,
        function (quote) {
            quote = quote.replace("\\'", "'");
            populateWithQuote($.parseJSON(quote));
        },
        'text'
    )
        .fail(function (d, textStatus, error) {
            console.error("getJSON failed, status: " + textStatus + ", error: " + error)
            populateWithBackupQuote();
        });
};
