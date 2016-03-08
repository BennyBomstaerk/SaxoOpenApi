function DemoDataFeedControl() {
    var transportAuth = new iit.openapi.TransportAuth(config.baseUrl, {
        token: config.token,
        expiry: new Date(new Date().getTime() + 1000 * 60 * 60 * 10),
        language: 'en-US'
    });

    var pricetableDiv = $("#pricetable");
    var netpositionstableDiv = $("#netpositionstable");
    var positionstableDiv = $("#positionstable");
    var orderstableDiv = $("#orderstable");

    var ACCOUNTKEY = "PEzZn7BKl51mDtj6DKzU6A==";

 
    var loadPrices = function () {
        addTableRow(pricetableDiv, ["Uic", "AssetType", "Symbol", "EstimatedCfdPrice", "EstPriceBuy", "EstPriceSell", "UnderlyingVWAPAsk", "UnderlyingVWAPBid",
                                    "MD-Ask", "AskOrders", "AskSize", "MD-Bid", "BidOrders", "BidSize", "NoOfBids", "NoOfOffers", "UsingOrders",   //market depth
                                    "High", "Low", "NetChange", "PercentChange", "AskSize", "AskYield", "BidSize", "BidYield", "LastClose",
                                    "LastTraded", "LastTradedSize", "Open", "Volume","Amount","Ask","Bid","DelayedByMinutes","Mid","PriceTypeAsk","PriceTypeBid"
        ]);

        loadPrice({uic: 21,accountKey:ACCOUNTKEY, assetType:"FxSpot",amount:10000,fieldGroups:"DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote",expiryDate:""});
        loadPrice({uic: 8177, accountKey: ACCOUNTKEY, assetType: "FxSpot", amount: 10000, fieldGroups: "DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote",expiryDate:"" });
        loadPrice({ uic: 492273, accountKey: ACCOUNTKEY, assetType: "CfdOnStock", amount: 10000, fieldGroups: "DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote", expiryDate: "" });
        loadPrice({ uic: 27098, accountKey: ACCOUNTKEY, assetType: "CfdOnIndex", amount: 10000, fieldGroups: "DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote", expiryDate: "" });
        loadPrice({ uic: 1443276, accountKey: ACCOUNTKEY, assetType: "CfdOnFutures", amount: 10000, fieldGroups: "DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote", expiryDate: "" });
        loadPrice({ uic: 51394, accountKey: ACCOUNTKEY, assetType: "CfdOnStock", amount: 10000, fieldGroups: "DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote", expiryDate: "" });
        loadPrice({ uic: 492273, accountKey: ACCOUNTKEY, assetType: "Stock", amount: 10000, fieldGroups: "DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote", exipryDate: "" });
        loadPrice({ uic: 51394, accountKey: ACCOUNTKEY, assetType: "Stock", amount: 10000, fieldGroups: "DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote", expiryDate: "" });
        loadPrice({ uic: 1850680, accountKey: ACCOUNTKEY, assetType: "Stock", amount: 10000, fieldGroups: "DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote", expiryDate: "" });
        loadPrice({ uic: 1845514, accountKey: ACCOUNTKEY, assetType: "ContractFutures", amount: 10000, fieldGroups: "DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote", expiryDate: "" });
        loadPrice({ uic: 1845607, accountKey: ACCOUNTKEY, assetType: "FuturesStrategy", amount: 10000, fieldGroups: "DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote", expiryDate: "" });
        loadPrice({ uic: 1067233, accountKey: ACCOUNTKEY, assetType: "Bond", amount: 10000, fieldGroups: "DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote", expiryDate: "" });
        loadPrice({ uic: 211, accountKey: ACCOUNTKEY, assetType: "Stock", amount: 10000, fieldGroups: "DisplayAndFormat,InstrumentPriceDetails,MarketDepth,PriceInfo,PriceInfoDetails,Quote", expiryDate: "" });

    }





    var loadPrice = function (priceArgs) {
        console.log("loadPrice", priceArgs);
        transportAuth.get("trade", "v1/infoprices?Uic={uic}&AccountKey={accountKey}&AssetType={assetType}&Amount={amount}&FieldGroups={fieldGroups}&ExpiryDate={expiryDate}", priceArgs)
                            .then(function (result) {
                                console.log("response", result);
                                addPriceToTable(result.response);
                            },
                            function (result) {
                                console.log("request error", priceArgs);
                            });

    }



    var addPriceToTable = function (row) {
        console.log("AddpriceToTable:" + row.Uic, row);
        addTableRow(pricetableDiv, [
            d(row.Uic),
            d(row.AssetType),
            d(d(row.DisplayAndFormat).Symbol),
            d(d(row.InstrumentPriceDetails).EstimatedCfdPrice),
            d(d(row.InstrumentPriceDetails).EstPriceBuy),
            d(d(row.InstrumentPriceDetails).EstPriceSell),
            d(d(row.InstrumentPriceDetails).UnderlyingVWAPAsk),
            d(d(row.InstrumentPriceDetails).UnderlyingVWAPBid),
            d(d(d(row.MarketDepth).Ask)[0]),
            d(d(d(row.MarketDepth).AskOrders)[0]),
            d(d(d(row.MarketDepth).AskSize)[0]),
            d(d(d(row.MarketDepth).Bid)[0]),
            d(d(d(row.MarketDepth).BidOrders)[0]),
            d(d(d(row.MarketDepth).BidSize)[0]),
            d(d(d(row.MarketDepth).NoOfBids)[0]),
            d(d(d(row.MarketDepth).NoOfOffers)[0]),
            d(d(d(row.MarketDepth).UsingOrders)[0]),
            d(d(row.PriceInfo).High),
            d(d(row.PriceInfo).Low),
            d(d(row.PriceInfo).NetChange),
            d(d(row.PriceInfo).PercentChange),
            d(d(row.PriceInfoDetails).AskSize),
            d(d(row.PriceInfoDetails).AskYield),
            d(d(row.PriceInfoDetails).BidSize),
            d(d(row.PriceInfoDetails).BidYield),
            d(d(row.PriceInfoDetails).LastClose),
            d(d(row.PriceInfoDetails).LastTraded),
            d(d(row.PriceInfoDetails).LastTradedSize),
            d(d(row.PriceInfoDetails).Open),
            d(d(row.PriceInfoDetails).Volume),
            d(d(row.Quote).Amount),
            d(d(row.Quote).Ask),
            d(d(row.Quote).Bid),
            d(d(row.Quote).DelayedByMinutes),
            d(d(row.Quote).Mid),
            d(d(row.Quote).PriceTypeAsk),
            d(d(row.Quote).PriceTypeBid)
            ]);
    }


    var loadNetPositions = function () {
        addTableRow(netpositionstableDiv, ["Uic", "AssetType", "Symbol", "MarketValue", "MarketValueInBaseCurrency", "CalculationReliability", "CurrentPrice", "CurrentPriceDelayMinutes",
                                    "CurrentPriceLastTraded", "CurrentPriceType", "Exposure", "ExposureCurrency", "ExposureInBaseCurrency", " InstrumentPriceDayPercentChange",    
                                    "ProfitLossOnTrade", "ProfitLossOnTradeInBaseCurrency", "TradeCostsTotal", " TradeCostsTotalInBaseCurrency", "PositionView"
        ]);
        transportAuth.get("port", "v1/netpositions/me?FieldGroups={fieldGroups}", {fieldGroups:"DisplayAndFormat,ExchangeInfo,NetPositionBase,NetPositionView"})
                      .then(function (result) {
                          console.log("response:", result);
                          var r=result.response.Data;
                          for (var i=0;i<r.length;i++) {
                              addNetPositionToTable(r[i]);
                          }
                      },
                      function (result) {
                          console.log("request error", result);
                      });

    }


    var addNetPositionToTable = function (row) {
        console.log("AddNetPostionToTable:" + row.NetPositionBase.Uic, row);
        addTableRow(netpositionstableDiv, [
            d(row.NetPositionBase.Uic),
            d(d(row.NetPositionBase).AssetType),
            d(d(row.DisplayAndFormat).Symbol),
            d(d(row.NetPositionDetails).MarketValue),
            d(d(row.NetPositionDetails).MarketValueInBaseCurrency),
            d(d(row.NetPositionView).CalculationReliability),
            d(d(row.NetPositionView).CurrentPrice),
            d(d(row.NetPositionView).CurrentPriceDelayMinutes),
            d(d(row.NetPositionView).CurrentPriceLastTraded),
            d(d(row.NetPositionView).CurrentPriceType),
            d(d(row.NetPositionView).Exposure),
            d(d(row.NetPositionView).ExposureCurrency),
            d(d(row.NetPositionView).ExposureInBaseCurrency),
            d(d(row.NetPositionView).InstrumentPriceDayPercentChange),
            d(d(row.NetPositionView).ProfitLossOnTrade),
            d(d(row.NetPositionView).ProfitLossOnTradeInBaseCurrency),
            d(d(row.NetPositionView).TradeCostsTotal),
            d(d(row.NetPositionView).TradeCostsTotalInBaseCurrency),
            "NA"
        ]);
    }

    var loadPositions = function () {
        addTableRow(positionstableDiv, ["Uic", "AssetType", "Symbol", "MarketValue", "CalculationReliability","ConversionRateClose","ConversionRateCurrent","ConversionRateOpen",
                                        "CurrentPrice", "CurrentPriceDelayMinutes","CurrentPriceLastTraded", "CurrentPriceType", "Exposure", "ExposureCurrency", "ExposureInBaseCurrency", " InstrumentPriceDayPercentChange",
                                        "ProfitLossOnTrade", "ProfitLossOnTradeInBaseCurrency", "TradeCostsTotal", " TradeCostsTotalInBaseCurrency"
        ]);
        transportAuth.get("port", "v1/positions/me?FieldGroups={fieldGroups}", { fieldGroups: "DisplayAndFormat,ExchangeInfo,PositionBase,PositionView" })
                      .then(function (result) {
                          console.log("loadPositions-response"+result.Uic, result);
                          var r = result.response.Data;
                          for (var i = 0; i < r.length; i++) {
                              addPositionToTable(r[i]);
                          }
                      },
                      function (result) {
                          console.log("request error", result);
                      });

    }


    var addPositionToTable = function (row) {
        console.log("AddPositionToTable:"+row.PositionBase.Uic,row)
        addTableRow(positionstableDiv, [
            d(row.PositionBase.Uic),
            d(d(row.PositionBase).AssetType),
            d(d(row.DisplayAndFormat).Symbol),
            d(d(row.PositionDetails).MarketValue),
            d(d(row.PositionView).CalculationReliability),
            d(d(row.PositionView).ConversionRateClose),
            d(d(row.PositionView).ConversionRateCurrent),
            d(d(row.PositionView).ConversionRateOpen),
            d(d(row.PositionView).CurrentPrice),
            d(d(row.PositionView).CurrentPriceDelayMinutes),
            d(d(row.PositionView).CurrentPriceLastTraded),
            d(d(row.PositionView).CurrentPriceType),
            d(d(row.PositionView).Exposure),
            d(d(row.PositionView).ExposureCurrency),
            d(d(row.PositionView).ExposureInBaseCurrency),
            d(d(row.PositionView).InstrumentPriceDayPercentChange),
            d(d(row.PositionView).ProfitLossOnTrade),
            d(d(row.PositionView).ProfitLossOnTradeInBaseCurrency),
            d(d(row.PositionView).TradeCostsTotal),
            d(d(row.PositionView).TradeCostsTotalInBaseCurrency),
            "NA"
        ]);
    }

    var loadOrders= function () {
        addTableRow(orderstableDiv, ["Uic", "AssetType", "Symbol", "CurrentPrice", "CurrentPriceDelayMinutes", "CurrentPriceLastTraded", "CurrentPriceType", "DistanceToMarket",
                                        "MarketPrice" 
        ]);
        transportAuth.get("port", "v1/orders/me?FieldGroups={fieldGroups}", { fieldGroups: "DisplayAndFormat,ExchangeInfo" })
                      .then(function (result) {
                          console.log("response", result);
                          var r = result.response.Data;
                          for (var i = 0; i < r.length; i++) {
                              addOrderToTable(r[i]);
                          }
                      },
                      function (result) {
                          console.log("request error", result);
                      });

    }


    var addOrderToTable = function (row) {
        console.log("AddOrderToTable:"+row.Uic,row);
        addTableRow(orderstableDiv, [
            d(row.Uic),
            d(row.AssetType),
            d(d(row.DisplayAndFormat).Symbol),
            d(row.CurrentPrice),
            d(row.CurrentPriceDelayMinutes),
            d(row.CurrentPriceLastTraded),
            d(row.CurrentPriceType),
            d(row.DistanceToMarket),
            d(row.MarketPrice)
        ]);
    }




    var d = function (value) {
        if (typeof value === "undefined") {
            return "-";
        } else {
            return value;
        }
    }

    var addTableRow = function (div, values) {
        var rowString="";
        for (var i = 0; i < values.length;i++) {
            rowString += "<td>" + values[i] + "</td>";
        }
        div.append("<tr>" + rowString + "</tr>");
    }

    return {
        loadPrices: loadPrices,
        loadNetPositions: loadNetPositions,
        loadPositions: loadPositions,
        loadOrders: loadOrders
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