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
    const symbolResp = await fetch(`http://localhost:5043/Stocks/GetSymbol?stockCode=${symbolSearch.value.trim()}&exchange=${exchangeName.value}`, {
        "headers": {
            "Accept": "application/json",
        },
        "method": "GET",
        "mode": "cors"
    });
    if (symbolResp.status == 200) {
        symbolResp.json().then(symbol => {
            divSearchResultCompanyName.innerText = symbol.companyName;
        });
        const response = await fetch(`http://localhost:5043/Stocks/GetStock?symbol=${symbolSearch.value.trim()}&lastDays=${lastDaysLimit.value}&exchangeCode=${exchangeName.value}`, {
            "headers": {
                "Accept": "application/json",
            },
            "method": "GET",
            "mode": "cors"
        });
        response.json().then(stocks => {
            stocksTableBody.replaceChildren();
            var candles = [
                {
                    name: 'candles',
                    data: []
                }
            ];
            var volumes = [
                {
                    name: 'volumes',
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
                volumes[0].data.push({
                    x: new Date(stock.datetime),
                    y: stock.volume
                })
            });
            stocksChartCandlesticksApex.updateSeries(candles);
            stocksChartVolumeApex.updateSeries(volumes);
        });
    } else {
        divSearchResultCompanyName.innerText = "--";
    }
}
const debouncedGetData = debounce(getData, 300)
var symbolSearch = document.getElementById("table-stocks-symbol-text-search");
var lastDaysLimit = document.getElementById("table-stocks-last-days-limit");
var exchangeName = document.getElementById("table-stocks-exchange-select");
var stocksTableBody = document.getElementById("table-stocks-body");
var divSearchResultCompanyName = document.getElementById("stocks-search-result-company-name");
symbolSearch.addEventListener("change", (elem, ev) => {
    debouncedGetData(elem, ev);
})
lastDaysLimit.addEventListener("change", (elem, ev) => {
    debouncedGetData(elem, ev);
})
exchangeName.addEventListener("change", (elem, ev) => {
    debouncedGetData(elem, ev);
})






var stocksChartCandlesticks = document.getElementById("chart-stocks-candlesticks");
var stocksChartVolume = document.getElementById("chart-stocks-volume");

var stocksChartCandlesticksApex = new ApexCharts(stocksChartCandlesticks, {
    series: [
        {
            name: 'candles',
            data: []
        }
    ],
    chart: {
        height: 350,
        type: 'candlestick',
        id: 'candles',
        group: 'stocks',
    },
    xaxis: {
        type: 'datetime'
    },
    fill: {
        opacity: .16,
        type: 'solid'
    },
    yaxis: {
        forceNiceScale: true,
        decimalsInFloat: 2,
        title: {
            text: "Price"
        },
        tooltip: {
            enabled: true
        }
    }
});
stocksChartCandlesticksApex.render();

var stocksChartVolumeApex = new ApexCharts(stocksChartVolume, {
    series: [
        {
            name: 'volumes',
            data: []
        }
    ],
    chart: {
        height: 150,
        type: 'bar',
        id: 'volumes',
        group: 'stocks',
    },
    dataLabels: {
        enabled:false
    },
    xaxis: {
        type: 'datetime'
    },
    yaxis: {
        forceNiceScale: true,
        decimalsInFloat: 2,
        title: {
            text: "Volume"
        },
        tooltip: {
            enabled: true
        }
    }
});
stocksChartVolumeApex.render();



var btnLoadMissing = document.getElementById("stocks-load-missing");
btnLoadMissing.addEventListener("click", async (ev) => {
    var elem = ev.currentTarget;
    elem.disabled = true;
    elem.getElementsByClassName("spinner-border")[0].classList.remove("visually-hidden");
    elem.getElementsByClassName("icon")[0].classList.add("visually-hidden");
    try {
        var response = await fetch(`http://localhost:5043/Stocks/LoadMissingHistoricalStockDataFromYahoo?period=0&symbol=${symbolSearch.value.trim()}&lastDays=${lastDaysLimit.value}&exchangeCode=${exchangeName.value}`, {
            "headers": {
                "Accept": "application/json",
            },
            "method": "GET",
            "mode": "cors"
        });
        if (response.ok) {
            elem.getElementsByClassName("spinner-border")[0].classList.add("visually-hidden");
            elem.getElementsByClassName("icon")[0].classList.remove("visually-hidden");
            setTimeout(() => {
                elem.getElementsByClassName("icon")[0].classList.add("visually-hidden");
            }, 1000);
        } else {
            elem.getElementsByClassName("spinner-border")[0].classList.add("visually-hidden");
            elem.getElementsByClassName("icon")[0].classList.add("visually-hidden");
        }
    } catch (error) {
        elem.getElementsByClassName("spinner-border")[0].classList.add("visually-hidden");
        elem.getElementsByClassName("icon")[0].classList.add("visually-hidden");
    }
    elem.disabled = false;
});
var btnLoadFull = document.getElementById("stocks-load-full");
btnLoadFull.addEventListener("click", async (ev) => {
    var elem = ev.currentTarget;
    elem.disabled = true;
    elem.getElementsByClassName("spinner-border")[0].classList.remove("visually-hidden");
    elem.getElementsByClassName("icon")[0].classList.add("visually-hidden");
    try {
        var response = await fetch(`http://localhost:5043/Stocks/LoadHistoricalStockDataFromYahoo?period=0&symbol=${symbolSearch.value.trim()}&lastDays=${lastDaysLimit.value}&exchangeCode=${exchangeName.value}`, {
            "headers": {
                "Accept": "application/json",
            },
            "method": "GET",
            "mode": "cors"
        });
        if (response.ok) {
            elem.getElementsByClassName("spinner-border")[0].classList.add("visually-hidden");
            elem.getElementsByClassName("icon")[0].classList.remove("visually-hidden");
            setTimeout(() => {
                elem.getElementsByClassName("icon")[0].classList.add("visually-hidden");
            }, 1000);
            getData();
        } else {
            elem.getElementsByClassName("spinner-border")[0].classList.add("visually-hidden");
            elem.getElementsByClassName("icon")[0].classList.add("visually-hidden");
        }
    } catch (error) {
        elem.getElementsByClassName("spinner-border")[0].classList.add("visually-hidden");
        elem.getElementsByClassName("icon")[0].classList.add("visually-hidden");
    }
    elem.disabled = false;
});