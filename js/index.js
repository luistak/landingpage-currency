var gama = [];
gama.coins = [];
gama.coinReceived = null;
gama.errorContainter = document.querySelector('[gama-error]');
gama.resultContainer = document.querySelector('[gama-result]');

gama.initialize = function() {
    gama.setup();
    gama.converterListener();
}

gama.setup = function () {
    let oReq = new XMLHttpRequest();

    let url = 'https://api.coinmarketcap.com/v1/ticker/?convert=BRL&limit=10';

    oReq.open('GET', url, true);
    oReq.responseType = 'json';
    oReq.onload = function(e) {
        var json = oReq.response;
        gama.setTableValues(json);
        gama.setCurrencySelectOptions(json);
    }

    oReq.send();
}

gama.setCurrencySelectOptions = function (json) {
    let select = document.querySelector('[gama-converter-currency]');    
    for (let index = 0; index < json.length; index++) {
        let coin = json[index];
        let option = document.createElement('option');
        option.value = coin.id;
        option.text = coin.name;

        select.appendChild(option);
    }
}

gama.setTableValues = function (json) {
    let tableBodySelector = '[gama-table] tbody';
    let tableBody = document.querySelector(tableBodySelector);
    
    for (let index = 0; index < json.length; index++) {
        let coin = json[index];
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(coin.rank));
        tr.appendChild(th);
        tr.setAttribute('scope', 'row');
        // Nome
        let tdNome = document.createElement('td');
        tdNome.appendChild(document.createTextNode(coin.name));
        tr.appendChild(tdNome);
        // Simbolo
        let tdSymbol = document.createElement('td');
        tdSymbol.appendChild(document.createTextNode(coin.symbol));
        tr.appendChild(tdSymbol);
        // Temers
        let tdBRL = document.createElement('td');
        tdBRL.appendChild(document.createTextNode(coin.price_brl));
        tr.appendChild(tdBRL);
        // Dols
        let tdDOL = document.createElement('td');
        tdDOL.appendChild(document.createTextNode(coin.price_usd));
        tr.appendChild(tdDOL);

        tableBody.appendChild(tr);
    }
}

gama.converterListener = function () {
    let converterForm = document.querySelector('[gama-converter]');

    converterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Clear error message
        gama.errorContainter.innerHTML = '';
        gama.resultContainer.innerHTML = '';

        let currencySelect = document.querySelector('[gama-converter-currency]');
        let selectedOption = gama.getSelectedOption(currencySelect);
        if (selectedOption.value == 0) {
            let message = 'Oops, é necessário selecionar algum valor';
            gama.errorContainter.appendChild(document.createTextNode(message));
            return;
        }
        
        let input = document.querySelector('[gama-converter-value]');
        if (input.value <= 0) {
            let message = 'Oops, é necessário informar um valor maior que zero';
            gama.errorContainter.appendChild(document.createTextNode(message));
            return;
        }
        gama.getCurrency(selectedOption.value);

        document.addEventListener('coin-received', function () {
            let result = '';
            let coinBrl = +gama.coinReceived.price_brl;
            result = input.value/coinBrl;
            result = result.toFixed(10);
            gama.resultContainer.innerHTML = result;
        })
    });
}

gama.getSelectedOption = function (sel) {
    var opt;
    for ( var i = 0, len = sel.options.length; i < len; i++ ) {
        opt = sel.options[i];
        if ( opt.selected === true ) {
            break;
        }
    }
    return opt;
}

gama.getCurrency = function (currency) {
    let oReq = new XMLHttpRequest();

    let url = 'https://api.coinmarketcap.com/v1/ticker/' + currency + '/?convert=BRL';

    oReq.open('GET', url, true);
    oReq.responseType = 'json';
    oReq.onload = function(e) {
        var coin = oReq.response;
        gama.coinReceived = coin[0];

        var event = new Event('coin-received');
        document.dispatchEvent(event);
    }
    oReq.send();
}

gama.initialize();
