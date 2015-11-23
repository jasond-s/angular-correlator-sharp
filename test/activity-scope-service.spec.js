
describe("Test the ActivityScope angular service", function () {

	var activityScopeService = null;
	var SOME_TOTAL_RUBBISH = { some: 'totalRubbish' };

	beforeEach(function () {

		module('correlator-sharp');

		inject(function (_ActivityScope_) {
			activityScopeService = _ActivityScope_;
		});
	});

	it('should provide a blank activity id', function () {
		expect(activityScopeService.current).toBeFalsy();
	});

	it('should allow the creation of a scope from seed', function () {

		activityScopeService.create('TEST_SCOPE', Uuid.EMPTY);

		expect(activityScopeService.current).toBeTruthy();
	});

	it('should not allow the creation of a scope from invalid uuid', function () {

		expect(function(){  activityScopeService.create('TEST_SCOPE', SOME_TOTAL_RUBBISH) }).toThrow();
	});

	it('should allow the creation of a sub activity scope with parent', function () {

		var parent = activityScopeService.create('TEST_SCOPE_PARENT', Uuid.EMPTY);

		expect(activityScopeService.createChild('TEST_SCOPE_CHILD', Uuid.EMPTY).parent).toBe(parent);
	});

	it('should not allow the creation of a sub activity scope with invalid parent', function () {

		expect(function () { new ActivityScope(name, SOME_TOTAL_RUBBISH, uuid.generate(seed)); }).toThrow();
	});
});