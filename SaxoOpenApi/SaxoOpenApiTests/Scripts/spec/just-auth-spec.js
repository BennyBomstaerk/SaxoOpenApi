//import * as config from './config';

//import standardTests from './standard-tests';

describe("when using just transport auth", () => {
    var transportAuth = new iit.openapi.TransportAuth(config.baseUrl, {
        token: config.token,
        expiry: new Date(new Date().getTime() + 1000 * 60 * 60 * 10),
        language: 'en-US'
    });

    var streaming = new iit.openapi.Streaming(transportAuth, config.baseUrl, transportAuth.auth);

    runTests({
        streaming: streaming,
        transport: transportAuth
    });

    it("disposes okay", () => {
        expect(() => {
            streaming.dispose();
            transportAuth.dispose();
        }).not.toThrow();
    });
});
