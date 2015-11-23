
describe("Test the Uuid angular service", function () {

	var uuidService = null;

	beforeEach(function () {

		module('correlator-sharp');

		inject(function (_Uuid_) {
			uuidService = _Uuid_;
		});
	});

	it('should provide a generation function', function () {
		expect(angular.isFunction(uuidService.generate)).toBe(true);
	});

	it('should return a new uuid from the generate function', function () {

		var uuidValue = uuidService.generate();

		expect(uuidValue).toBeTruthy();
		expect(angular.isString(uuidValue.value)).toBe(true);
		expect(uuidValue.time instanceof Date).toBe(true);
	});

	it('should provide unique values', function () {

		// One hundred values in not much I know, but felt I needed to
		// say something about uniqueness.

		var output = []
		var input = Array.apply(null, { length: 100 }).map(function (){
			return uuidService.generate().value;
		});

		for (var i = 0; i < input.length; i++) {
			expect(output.indexOf(input[i])).toBeLessThan(0);
	    	output.push(input[i]);
		}
	});	
	
});