//import * as config from './config';

//import standardTests from './standard-tests';

describe("when using everything", () => {
    var transportAuth = new iit.openapi.TransportAuth(config.baseUrl, {
        token: config.token,
        expiry: new Date(new Date().getTime() + 1000 * 60 * 60 * 10),
        language: 'en-US'
    });

    var transportBatch = new iit.openapi.TransportBatch(transportAuth, config.baseUrl, transportAuth.auth);

    // wait for the 2 isalive calls for the load balancer cookies
    var portAlive = transportAuth.get("port", "isalive");
    var tradeAlive = transportAuth.get("trade", "isalive");

    var transportQueue = new iit.openapi.TransportQueue(transportBatch, transportAuth);
    transportQueue.waitFor(portAlive);
    transportQueue.waitFor(tradeAlive);

    var streaming = new iit.openapi.Streaming(transportQueue, config.baseUrl, transportAuth.auth);

    runTests({
        streaming: streaming,
        transport: transportQueue
    });

    it("disposes okay", () => {
        expect(() => {
            streaming.dispose();
            transportQueue.dispose();
        }).not.toThrow();
    });
});
