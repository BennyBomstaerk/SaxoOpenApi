function BatsPricesControl() {


    function DisplayRow(instrumentInfo) {
        this.uic = instrumentInfo.saxoUic;
        this.symbol = instrumentInfo.saxoSymbol;
        this.batsUic = instrumentInfo.batsUic;
        this.batsSymbol = instrumentInfo.batsSymbol;
    }



    var transportAuth = new iit.openapi.TransportAuth(config.baseUrl, {
        token: config.token,
        expiry: new Date(new Date().getTime() + 1000 * 60 * 60 * 10),
        language: 'en-US'
    });

    var pricetableDiv = $("#pricetable");
    var ACCOUNTKEY = "fm5s1UdFs9lsILh9v-4r9g==";  ///(login 3885897)
    var batsInstruments = new BatsInstruments();
    var InstrumentsPerCall = 100;
    var index = 0;
    var ready = true;

    var showPrices = function () {
        addTableRow(pricetableDiv, ["Uic", "Symbol", "BatsUic", "BatsSymbol", "AskStock", "BidStock", "PtAsk", "PtBid", "ErrorCode", "LastClose", "LastTraded", "NetChange"]);
        loadMorePrices();
/*
        loadSomePrices();
        setTimeout(function () {
            loadMorePrices;
        }, 1000);
        */
    }

    var loadMorePrices = function () {
        console.log("loadMorePrices", index);
        if (index < batsInstruments.length) {
            if (ready) {
                console.log("ready is true");
                loadSomePrices();
            } else {
                console.log("ready is false");
            }

            setTimeout(function () {
                loadMorePrices();
            }, 200);
        }
    }

    var loadSomePrices = function () {
        console.log("loadSomePrices:", index);
        ready = false;
        var j = 0;
        var uics = "";
        var instrumentInfo;
        var rowObjects = [];
        while (j < InstrumentsPerCall && index < batsInstruments.length) {
            if (j != 0) {
                uics += ",";
            }
            instrumentInfo = batsInstruments[index];
            rowObjects.push(new DisplayRow(instrumentInfo));
            uics += instrumentInfo.saxoUic;
            j++;
            index++;
        }

        var priceArgs = {
            accountKey: ACCOUNTKEY,
            fieldGroups: "DisplayAndFormat,Quote,PriceInfo,PriceInfoDetails",
            assetType: "Stock",
            uics: uics
        }

        transportAuth.get("trade", "v1/infoprices/list?Uics={uics}&AccountKey={accountKey}&AssetType={assetType}&FieldGroups={fieldGroups}", priceArgs)
                      .then(function (result) {
                          console.log("response", result);
                          for (var k = 0; k < result.response.Data.length; k++) {
                              var da = result.response.Data[k];
                              rowObjects[k].askStock = d(da.Quote.Ask);
                              rowObjects[k].bidStock = d(da.Quote.Bid);
                              rowObjects[k].ptAskStock = d(da.Quote.PriceTypeAsk);
                              rowObjects[k].ptBidStock = d(da.Quote.PriceTypeBid);
                              rowObjects[k].errorCode = d(da.Quote.ErrorCode);
                              rowObjects[k].lastClose = d(d(da.PriceInfoDetails).LastClose);
                              rowObjects[k].lastTraded = d(d(da.PriceInfoDetails).LastTraded);
                              rowObjects[k].netChange = d(d(da.PriceInfo).NetChange);

                          }
                          addRowsToTable(rowObjects);
                          ready = true;
                          /*
                          priceArgs.assetType = "CfdOnStock";
                          transportAuth.get("trade", "v1/infoprices/list?Uics={uics}&AccountKey={accountKey}&AssetType={assetType}&FieldGroups={fieldGroups}", priceArgs)
                                     .then(function (result) {
                                         console.log("response", result);
                                         for (var k = 0; k < result.response.Data.length; k++) {
                                             var da = result.response.Data[k];
                                             rowObjects[k].askCfd = d(da.Quote.Ask);
                                             rowObjects[k].bidCfd = d(da.Quote.Bid);
                                             rowObjects[k].ptAskCfd = d(da.Quote.PriceTypeAsk);
                                             rowObjects[k].ptBidCfd = d(da.Quote.PriceTypeBid);
                                         }
                                         addRowsToTable(rowObjects);
                                         ready = true;
                                     },
                                     function (result) {
                                         console.log("request Error (CFD)", priceArgs);
                                         addRowsToTable(rowObjects);
                                         ready = true;
                                         //index = 99999;
                                     });
                                     */
                      },
                      function (result) {
                          console.log("request error (stock)", priceArgs);
                          addRowsToTable(rowObjects);
                          ready = true;
                          //index = 99999;
                      });
    }

    var addRowsToTable = function (rowObjects) {
        for (var i = 0; i < rowObjects.length; i++) {
            var r = rowObjects[i];
            addTableRow(pricetableDiv, [
                r.uic,
                r.symbol,
                r.batsUic,
                r.batsSymbol,
                r.askStock,
                r.bidStock,
                r.ptAskStock,
                r.ptBidStock,
                r.errorCode,
                r.lastClose,
                r.lastTraded,
                r.netChange
            ]);
        }
    }



    var d = function (value) {
        if (typeof value === "undefined") {
            return "-";
        } else {
            return value;
        }
    }

    var addTableRow = function (div, values) {
        var rowString = "";
        for (var i = 0; i < values.length; i++) {
            rowString += "<td>" + values[i] + "</td>";
        }
        div.append("<tr>" + rowString + "</tr>");
    }

    return {
        showPrices: showPrices
    }

}


/*
    var row = {
            Uic: 21,
            AssetType: "FxSpot",
            Symbol: "EURUSD",
            InstrumentPriceDetails: {
                EstPriceBuy:12
            },
            Quote: {
                Ask:1.34
            }
        }
    */