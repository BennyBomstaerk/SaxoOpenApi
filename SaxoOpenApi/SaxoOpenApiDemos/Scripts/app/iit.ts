module iit.openapi {
    export interface Subscription {
        UPDATE_TYPE_DELTA: number;
        UPDATE_TYPE_SNAPSHOT: number;
    }

    
    export interface TransportAuthConstructor {
        new (baseUrl: string, stuff: any): any;
    }
    export declare var TransportAuth: TransportAuthConstructor;

    export interface TransportBatchConstructor {
        new (transportAuth: any, baseUrl: string, auth: any);
    }
    export declare var TransportBatch: TransportBatchConstructor;

    export interface TransportQueueConstructor {
        new (transportBatch:any, transportAuth:any);
    }
    export declare var TransportQueue: TransportQueueConstructor;


    export interface StreamingConstructor {
        new (transport: any, baseUrl:string, transportAuth: any);
    }

    export declare var Streaming: StreamingConstructor;

}