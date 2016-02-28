module Utilities {
    


    export class OpenApiCommunication {
        constructor(config: any) {
            var transportAuth = new iit.openapi.TransportAuth(config.baseUrl, {
                token: config.token,
                expiry: new Date(new Date().getTime() + 1000 * 60 * 60 * 10),
                language: 'en-US'
            });

            var transportBatch = new iit.openapi.TransportBatch(transportAuth, config.baseUrl, transportAuth.auth);

            // wait for the 2 isalive calls for the load balancer cookies
            var portAlive = transportAuth.get("port", "isalive");
            var tradeAlive = transportAuth.get("trade", "isalive");

            this.transport = new iit.openapi.TransportQueue(transportBatch, transportAuth);
            this.transport.waitFor(portAlive);
            this.transport.waitFor(tradeAlive);

            this.streaming = new iit.openapi.Streaming(this.transport, config.baseUrl, transportAuth.auth);
        }

        public transport: any;
        public streaming: any;
    }
}