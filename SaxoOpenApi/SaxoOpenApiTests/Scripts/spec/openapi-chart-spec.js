describe("chart", () => {
    ES6Promise.polyfill();

    const log = iit.log;

    /* - useful for testing*/
    log.on(log.DEBUG, console.debug.bind(console));
    log.on(log.INFO, console.info.bind(console));
    log.on(log.WARN, console.info.bind(console));
    log.on(log.ERROR, console.error.bind(console));
    /**/
    var openApi = openApiSetup(config);
    var transport = openApi.transport;
    var streaming = openApi.streaming;


    describe("when retrieving 1 minute chart for EURUSD", () => {
        var result = null;

        beforeEach(function (done) {
            if (result === null) {
                console.log("go fetch data");
                var currentTime = new Date().toISOString();
                transport.get("chart", "v1/charts?Mode={Mode}&Time={Time}&Uic={Uic}&AssetType={AssetType}&Horizon={Horizon}&TimeZoneId={TimeZoneId}&Count={Count}&FieldGroups={FieldGroups}",
                    { Mode: "UpTo", Time: currentTime, Uic: 21, AssetType: "FxSpot", Horizon: 1, Count: 100, TimeZoneId: 0, FieldGroups: "ChartInfo,Data,DisplayAndFormat" })
                        .then(function (res) {
                            console.log("before each:1 minute chart for EURUSD - returns data", res.status, res.response);
                            result = res;
                            done();
                        },
                        function (res) {
                            result = res;
                            fail("call failed");
                            done();
                        });

            }
            else {
                console.log("already has data");
                done();
            }
        });
        it("returns data", function () {
            expect(result.status).toEqual(200);
            expect(result.response).toEqual(jasmine.any(Object));
        }),
        it("returns both ChartInfo, DisplayAndFormat, Data objects and a DataVersion", function () {
            expect(result.response.ChartInfo).toEqual(jasmine.any(Object));
            expect(result.response.Data).toEqual(jasmine.any(Object));
            expect(result.response.DisplayAndFormat).toEqual(jasmine.any(Object));
            expect(result.response.DataVersion).toBeGreaterThan(0);
        });
        it("returns correct ChartInfo", function () {
            var chartInfo = result.response.ChartInfo;
            expect(chartInfo.DelayedByMinutes).toEqual(0);
            expect(chartInfo.ExchangeId).toEqual("SBFX");
            expect(typeof (chartInfo.FirstSampleTime)).toEqual('string');
            expect(chartInfo.Horizon).toEqual(1);
            expect(chartInfo.TimeZoneId).toEqual(0);
        })
        it("returns correct DisplayAndFormat", function () {
            var displayAndFormat = result.response.DisplayAndFormat;
            expect(displayAndFormat.Currency).toEqual("USD");
            expect(displayAndFormat.Decimals).toEqual(5);
            expect(displayAndFormat.Description).toBe("Euro/US Dollar");
            expect(displayAndFormat.Format).toBe("AllowDecimalPips");
            expect(displayAndFormat.Symbol).toBe("EURUSD");
        })
        it("returns correct Data", function () {
            var data = result.response.Data;
            expect(data.length).toBe(100);
            var sample = data[0];
            expect(sample.CloseAsk).toBeGreaterThan(0);
            expect(sample.CloseBid).toBeGreaterThan(0);
            expect(sample.HighAsk).toBeGreaterThan(0);
            expect(sample.HighBid).toBeGreaterThan(0);
            expect(sample.LowAsk).toBeGreaterThan(0);
            expect(sample.LowBid).toBeGreaterThan(0);
            expect(sample.OpenAsk).toBeGreaterThan(0);
            expect(sample.OpenBid).toBeGreaterThan(0);

        })
    })
    xdescribe("when retrieving 1 minute chart for VodaPhone", () => {
        var result = null;

        beforeEach(function (done) {
            if (result === null) {
                console.log("go fetch data");
                var currentTime = new Date().toISOString();
                transport.get("chart", "v1/charts?Mode={Mode}&Time={Time}&Uic={Uic}&AssetType={AssetType}&Horizon={Horizon}&TimeZoneId={TimeZoneId}&Count={Count}&FieldGroups={FieldGroups}",
                    { Mode: "UpTo", Time: currentTime, Uic: 899, AssetType: "Stock", Horizon: 1, Count: 100, TimeZoneId: 0, FieldGroups: "ChartInfo,Data,DisplayAndFormat" })
                        .then(function (res) {
                            console.log("before each:1 minute chart for Vodaphone - returns data", res.status, res.response);
                            result = res;
                            done();
                        },
                        function (res) {
                            result = res;
                            fail("call failed");
                            done();
                        });

            }
            else {
                console.log("already has data");
                done();
            }
        });
        it("returns data", function () {
            expect(result.status).toEqual(200);
            expect(result.response).toEqual(jasmine.any(Object));
        }),
        it("returns both ChartInfo, DisplayAndFormat, Data objects and a DataVersion", function () {
            expect(result.response.ChartInfo).toEqual(jasmine.any(Object));
            expect(result.response.Data).toEqual(jasmine.any(Object));
            expect(result.response.DisplayAndFormat).toEqual(jasmine.any(Object));
            expect(result.response.DataVersion).toBeGreaterThan(0);
        });
        it("returns correct ChartInfo", function () {
            var chartInfo = result.response.ChartInfo;
            expect(chartInfo.DelayedByMinutes).toEqual(15);
            expect(chartInfo.ExchangeId).toEqual("LSE_SETS");
            expect(typeof (chartInfo.FirstSampleTime)).toEqual('string');
            expect(chartInfo.Horizon).toEqual(1);
            expect(chartInfo.TimeZoneId).toEqual(0);
        })
        it("returns correct DisplayAndFormat", function () {
            var displayAndFormat = result.response.DisplayAndFormat;
            expect(displayAndFormat.Currency).toEqual("GBP");
            expect(displayAndFormat.Decimals).toEqual(2);
            expect(displayAndFormat.Description).toBe("Vodafone Group Plc");
            expect(displayAndFormat.Format).toBe("AllowDecimalPips");
            expect(displayAndFormat.Symbol).toBe("VOD:xlon");
        })
        it("returns correct Data", function () {
            var data = result.response.Data;
            expect(data.length).toBe(100);
            var sample = data[0];
            expect(sample.Close).toBeGreaterThan(0);
            expect(sample.High).toBeGreaterThan(0);
            expect(sample.Low).toBeGreaterThan(0);
            expect(sample.Open).toBeGreaterThan(0);
            expect(sample.Interest).toBeGreaterThan(-0.1);
            expect(sample.TZ).toBe(0);

        })
    })
    describe("when subscribing to 1 minute chart for EURUSD", () => {
        var result = null;

        beforeEach(function (done) {
            if (result === null) {
                console.log("go setup subscription- but kill it straight away, we only want the snapshot");

                var currentTime = new Date().toISOString();
                var subscriptionArgs = {
                    RefreshRate: 2000,
                    Arguments: {
                        //Mode: "UpTo",
                        //Time: currentTime,
                        //Time:"2016-01-28T00:00:08.460Z",
                        Uic: 21,
                        AssetType: "FxSpot",
                        Horizon: 1,
                        Count: 100,
                        TimeZoneId: 0,
                        FieldGroups: ["ChartInfo","Data","DisplayAndFormat"]
                    }
                };

                var chartSubScription = streaming.createSubscription('chart', 'v1/charts/subscriptions', subscriptionArgs,
                                (update, fullMsg) => {
                                    result = update;
                                    console.log("chart subscription - success", update);
                                    expect(fullMsg).toBe(1);
                                    expect(update).toEqual(jasmine.any(Object));
                                    streaming.disposeSubscription(chartSubScription);
                                    done();
                                }, function (res) {
                                    result = res;
                                    console.log("chart subscription - failure", result);
                                    fail("call failed");
                                    done();
                                });
            }
            else {
                console.log("already has data");
                done();
            }
        });

        it("returns data", function () {
            //expect(result.status).toEqual(200);
            expect(result).toEqual(jasmine.any(Object));
        }),
        it("returns both ChartInfo, DisplayAndFormat, Data objects and a DataVersion", function () {
            expect(result.ChartInfo).toEqual(jasmine.any(Object));
            expect(result.Data).toEqual(jasmine.any(Object));
            expect(result.DisplayAndFormat).toEqual(jasmine.any(Object));
            expect(result.DataVersion).toBeGreaterThan(0);
        });
        it("returns correct ChartInfo", function () {
            var chartInfo = result.ChartInfo;
            expect(chartInfo.DelayedByMinutes).toEqual(0);
            expect(chartInfo.ExchangeId).toEqual("SBFX");
            expect(typeof (chartInfo.FirstSampleTime)).toEqual('string');
            expect(chartInfo.Horizon).toEqual(1);
            expect(chartInfo.TimeZoneId).toEqual(0);
        })
        it("returns correct DisplayAndFormat", function () {
            var displayAndFormat = result.DisplayAndFormat;
            expect(displayAndFormat.Currency).toEqual("USD");
            expect(displayAndFormat.Decimals).toEqual(5);
            expect(displayAndFormat.Description).toBe("Euro/US Dollar");
            expect(displayAndFormat.Format).toBe("AllowDecimalPips");
            expect(displayAndFormat.Symbol).toBe("EURUSD");
        })
        it("returns correct Data", function () {
            var data = result.Data;
            expect(data.length).toBe(100);
            var sample = data[0];
            expect(sample.CloseAsk).toBeGreaterThan(0);
            expect(sample.CloseBid).toBeGreaterThan(0);
            expect(sample.HighAsk).toBeGreaterThan(0);
            expect(sample.HighBid).toBeGreaterThan(0);
            expect(sample.LowAsk).toBeGreaterThan(0);
            expect(sample.LowBid).toBeGreaterThan(0);
            expect(sample.OpenAsk).toBeGreaterThan(0);
            expect(sample.OpenBid).toBeGreaterThan(0);

        })
    })

    it("disposes okay", () => {
        expect(() => {
            streaming.dispose();
            transport.dispose();
        }).not.toThrow();
    });
});
