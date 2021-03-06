﻿module OpenApiChartDemo {
    "use strict";

    export interface ChartInfo {
        DelayedByMinutes?: number,
        ExchangeId?: string,
        FirstTimeSample?: string, //TODO
        Horizon?: number,
        TimSoneId?: number
    }

    export interface ChartSample {
        Close?: number,
        CloseAsk?: number,
        CloseBid?: number,
        High?: number,
        HighAsk?: number,
        HighBid?: number,
        Interest?: number,
        Low?: number,
        LowAsk?: number,
        LowBid?: number,
        Open?: number,
        OpenBid?: number,
        OpenAsk?: number;
        Time?: string; //TODO
        TZ?: number,
        Volume?: number
    }

    export interface InstrumentDisplayAndFormat {
        Symbol: string,
        Currency: string,
        Decimals: number,
        Description: string,
        NumeratorDecimals: number,
        Format: string             //Todo do we have the notion of an enum?
    }

    export interface OpenApiSubscriptionSnapshot {
        ChartInfo?: ChartInfo,
        Data?: ChartSample[],
        DataVersion?: number,
        DisplayAndFormat?: InstrumentDisplayAndFormat,
    }
/*
    export interface ChartData {                //Todo - do we have inheritance?
        ChartInfo?: ChartInfo,
        Data?: ChartSample[],
        DataVersion?: number,
        DisplayAndFormat?: InstrumentDisplayAndFormat,
    }
*/
    
    export interface OpenApiChartStreamingResponse {
        ReferenceId: string,
        TimeStamp: string,  //TODO check this out also
        Data?: ChartSample[],
        TargetReferenceIds?: string[],
        __p?: number,
        __n?: number
    }
    
}