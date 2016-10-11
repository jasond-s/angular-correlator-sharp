describe("Test the csHttpInterceptor factory", function() {
    var csHttpInterceptor = null;

    beforeEach(module('correlator-sharp'));

    beforeEach(function() {
        inject(function(_csHttpInterceptor_){
            csHttpInterceptor = _csHttpInterceptor_;
        })
    });

    it('should be injected as expected', function() {
        expect(csHttpInterceptor).not.toBeNull();
    });

    it('should provide expected headers', function() {
        var config = {
            method: 'testMethod',
            url: 'testUrl',
            headers: {
                'X-Correlation-Id': '',
                'X-Correlation-Started' : '',
                'X-Correlation-Name' : '',
                'X-Correlation-Parent': ''
            }
        };

        csHttpInterceptor.request(config);

        expect(config).not.toBeNull();

        expect(config.headers['X-Correlation-Id']).not.toBeNull();
        expect(config.headers['X-Correlation-Started']).not.toBeNull();
        expect(config.headers['X-Correlation-Name']).not.toBeNull();
    });

});