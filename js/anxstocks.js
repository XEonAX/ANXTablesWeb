function debounce(callback, delay) {
    let timer
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(async () => {
            await callback(...args);
        }, delay)
    }
}
const getData = async function (...args) {
    console.log(...args);
    const response = await fetch(`http://localhost:5043/Stocks/GetStock?symbol=${symbolSearch.value.trim()}&lastDays=${lastDaysLimit.value}&exchangeCode=NSE`, {
        "headers": {
            "Accept": "application/json",
        },
        "method": "GET",
        "mode": "cors"
    });
    response.json().then(stocks => {
        stocksTableBody.replaceChildren();
        var candles = [{
            name: 'candlestick',
            data: []
        },
        {
            name: 'volume',
            type: "bar",
            data: []
        }
        ];

        stocks.forEach(stock => {
            var row = document.createElement('tr');
            var cell = document.createElement('td');
            cell.innerText = stock.symbol;
            row.append(cell);
            cell = document.createElement('td');
            cell.innerText = dayjs(stock.datetime).format('YYYY-MM-DD');
            row.append(cell);
            cell = document.createElement('td');
            cell.innerText = stock.open;
            row.append(cell);
            cell = document.createElement('td');
            cell.innerText = stock.high;
            row.append(cell);
            cell = document.createElement('td');
            cell.innerText = stock.low;
            row.append(cell);
            cell = document.createElement('td');
            cell.innerText = stock.close;
            row.append(cell);
            cell = document.createElement('td');
            cell.innerText = stock.volume;
            row.append(cell);
            stocksTableBody.append(row);
            candles[0].data.push({
                x: new Date(stock.datetime),
                y: [stock.open, stock.high, stock.low, stock.close]
            });
            candles[1].data.push({
                x: new Date(stock.datetime),
                y: stock.volume
            })
        });
        stocksChartCandlesticksApex.updateSeries(candles);

    });

}
const debouncedGetData = debounce(getData, 300)
var symbolSearch = document.getElementById("table-stocks-symbol-text-search");
var lastDaysLimit = document.getElementById("table-stocks-last-days-limit");
var stocksTableBody = document.getElementById("table-stocks-body");
symbolSearch.addEventListener("change", (elem, ev) => {
    debouncedGetData(elem, ev);
})
lastDaysLimit.addEventListener("change", (elem, ev) => {
    debouncedGetData(elem, ev);
})


var stocksChartCandlesticks = document.getElementById("chart-stocks-candlesticks");

var stocksChartCandlesticksApex = new ApexCharts(stocksChartCandlesticks, {
    series: [{
        name: 'candles',
        data: [
        ]
    },
    {
        name: 'volume',
        type: 'bar',
        data: [
        ]
    }
    ],
    chart: {
        height: 350,
        type: 'candlestick',
    },
    xaxis: {
        type: 'datetime'
    },
    fill: {
        opacity: .16,
        type: 'solid'
    },
    yaxis: [{
        forceNiceScale: true,
        decimalsInFloat: 2,
        title: {
            text: "Price"
        },
        tooltip: {
            enabled: true
        }
    }, {
        forceNiceScale: true,
        decimalsInFloat: 2,
        title: {
            text: "Volume"
        },
        opposite: true,
        tooltip: {
            enabled: true
        }
    }]
});
stocksChartCandlesticksApex.render();
