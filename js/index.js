gama = [];

gama.initialize = function() {
    gama.setup();
}

gama.setup = function () {
    let oReq = new XMLHttpRequest();

    let url = 'https://api.coinmarketcap.com/v1/ticker/?convert=BRL&limit=10';

    oReq.open("GET", url, true);
    oReq.responseType = "json";
    oReq.onload = function(e) {
    var json = oReq.response; // não é responseText
    console.log(e);
    console.log(json);
    }
    oReq.send();
}

gama.initialize();
