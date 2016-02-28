
interface openApiCommunication {
    transport: any,
    streaming: any
}
declare function openApiSetup(config: any): openApiCommunication;




module OpenApiChartDemo {
    "use strict";

    interface chartParameters {
        assetType: string,
        uic: number,
        horizon: number,
        timeZoneId: number
    }

    export class ChartStreaming {

        constructor() {
            this.attachButtons();
            this.openApi = new Utilities.OpenApiCommunication(config);
        }
        private chart = new HighChart();
        private openApi: openApiCommunication;
        private chartSubScription: iit.openapi.Subscription = null;
        private dataVersion = 0;
        private displayAndFormat: InstrumentDisplayAndFormat = null;
        private earliestSampleTime: string = null;
        private chartParameters: chartParameters = null;

        private attachButtons = () => {
            $("#getCurrentChartBtn").click(this.getCurrentChart);
            $("#getOlderSamplesBtn").click(this.getOlderSamples);
            $("#testBtn").click(this.test);
        }

        //button handlers:
        private getCurrentChart = () => {
            this.initializeChart();
            this.startSubscription();
        }

        private getOlderSamples = () => {
            this.getPreviousSamples();
        }

        private test = () => {
            this.restart();
        }


        private initializeChart = () => {
            this.chart = new HighChart();
            this.earliestSampleTime = null;
        }

        private startSubscription = () => {
            if (this.chartSubScription) {
                this.openApi.streaming.disposeSubscription(this.chartSubScription);
            }
            this.chartParameters = this.getChartParameters();
            var subScriptionArgs = this.getSubscriptionArgs();

            this.chartSubScription = this.openApi.streaming.createSubscription('chart', 'v1/charts/subscriptions', subScriptionArgs,
                (update, updateType) => {
                    console.log("chart subscription - success", update, updateType);
                    switch (updateType) {
                        case this.chartSubScription.UPDATE_TYPE_SNAPSHOT:
                            this.processSnapshot(update);
                            break;
                        case this.chartSubScription.UPDATE_TYPE_DELTA:
                            this.processUpdate(update);
                            break;
                        default:
                            console.log("should not go here");
                    }
                }, (res) => {
                    alert("Error Subscribing to chart data" + res);
                });
        }

        private getChartParameters = (): chartParameters => {
            return {
                assetType: $("#assetType").val(),
                uic: $("#uic").val(),
                horizon: $("#horizon").val(),
                timeZoneId: $("#timeZoneId").val()
            }
        }

        private getSubscriptionArgs(): any {
            var currentTime = new Date().toISOString();
            var subscriptionArgs = {
                RefreshRate: 2000,
                Arguments: {
                    Uic: this.chartParameters.uic,
                    AssetType: this.chartParameters.assetType,
                    Horizon: this.chartParameters.horizon,
                    Count: 100,
                    TimeZoneId: this.chartParameters.timeZoneId,
                    FieldGroups: ["ChartInfo", "Data", "DisplayAndFormat"]
                }
            };
            return subscriptionArgs;
        }



        private processSnapshot = (response: OpenApiSubscriptionSnapshot) => {
            console.log("Snapshot received- populate chart!");
            this.chart.showLoading();
            this.dataVersion = response.DataVersion;
            this.displayAndFormat = jQuery.extend({}, response.DisplayAndFormat);
            this.chart.setTitle({ text: "Simple OpenAPI Chart Data Demo" }, { text: "Chart data for " + this.displayAndFormat.Symbol + "-" + this.displayAndFormat.Description });
            this.addChartData(response.Data);
            this.storeEarliestSampleTime(response.Data);
            this.chart.redraw();
            this.chart.hideLoading();
            $("#getOlderSamplesBtn").show();
        }

        private addChartData = (chartSamples: ChartSample[]) => {
            for (var i = 0; i < chartSamples.length; i++) {
                var point = this.mapChartDataSample(chartSamples[i]);
                this.chart.series[0].addPoint(point, false);
            }
        }

        private mapChartDataSample = (d: ChartSample) => {
            var p: any;
            switch (this.chartParameters.assetType) {
                case 'FxSpot':
                case 'CfdOnStock':
                case 'CfdOnIndex':
                case 'cfdOnFutures':
                    p = {
                        close: d.CloseBid,
                        color: (d.CloseBid >= d.OpenBid) ? 'green' : 'red',
                        high: d.HighBid,
                        id: d.Time,
                        low: d.LowBid,
                        open: d.OpenBid,
                        x: Date.parse(d.Time)
                    };
                    break;
                case 'Stock':
                case 'FuturesStrategy':
                case 'ManagedFund':
                case 'StockIndex':
                    p = {
                        close: d.Close,
                        color: (d.Close >= d.Open) ? 'green' : 'red',
                        high: d.High,
                        id: d.Time,
                        low: d.Low,
                        open: d.Open,
                        x: Date.parse(d.Time)
                    };
                    break;
            }
            return p;
        }

        private processUpdate = (message: OpenApiChartStreamingResponse) => {
            this.mergeChartData(message.Data);
        }



        private mergeChartData = (chartSamples: ChartSample[]) => {
            for (var i = 0; i < chartSamples.length; i++) {
                var d = chartSamples[i];
                var point = this.mapChartDataSample(d);

                //Determine if we should update existing point or add a new point
                var currentPoint = <HighchartsPointObject>this.chart.get(d.Time);
                if ((null != currentPoint) && (typeof currentPoint != 'undefined')) {
                    currentPoint.update(point);
                    console.log("Updating latest point");
                }
                else {
                    this.chart.series[0].addPoint(point);
                    console.log("Adding new point");
                }
                //Update horizontal line
                if (i == chartSamples.length - 1) {
                    this.chart.yAxis[0].update({
                        plotLines: [{
                            value: point.close,
                            width: 1,
                            color: 'blue',
                            dashStyle: 'dash',
                            zIndex: 10
                        }]
                    });
                }
            }
        }


        private storeEarliestSampleTime = (chartSamples: ChartSample[]) => {
            if (chartSamples.length > 0) {
                this.earliestSampleTime = chartSamples[0].Time;
            }
        }



        private getPreviousSamples = () => {
            console.log("get older samples");
            this.openApi.transport.get("chart", "v1/charts?Mode={Mode}&Time={Time}&Uic={Uic}&AssetType={AssetType}&Horizon={Horizon}&TimeZoneId={TimeZoneId}&Count={Count}&FieldGroups={FieldGroups}",
                {
                    Mode: "UpTo",
                    Time: this.earliestSampleTime,
                    Uic: this.chartParameters.uic,
                    AssetType: this.chartParameters.assetType,
                    Horizon: this.chartParameters.horizon,
                    Count: 100,  //should probably be 1200....
                    TimeZoneId: this.chartParameters.timeZoneId,
                    FieldGroups: "ChartInfo,Data,DisplayAndFormat"
                })
                .then((res) => {
                    console.log("get old samples - returned");
                    var response = res.response;
                    if ((null == response.DataVersion) || (typeof response.DataVersion == 'undefined') || (response.DataVersion === this.dataVersion)) {
                        this.addChartData(response.Data);
                        this.storeEarliestSampleTime(response.Data);
                        this.chart.redraw();
                    }
                    else {
                        this.restart();
                    }
                },
                function (res) {
                    console.log("getPreviusSamples failed:", res);
                    alert("Call to get previous samples failed!");
                });
        }


        private restart = () => {
            $("#getOlderSamplesBtn").hide();
            this.initializeChart();
            this.startSubscription();
        }

    }
}
