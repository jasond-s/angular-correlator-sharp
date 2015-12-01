(function (correlatorSharp, globals) {

    var CorrelatorSharp = correlatorSharp;


    /* Bind method for a backbone router for all route changes.
    /*****************************************************/

    function bindRouteEvent(backBoneRouter) {
    	var activityScope = CorrelatorSharp.ActivityScope;

    	if (!activityScope) 
    		throw new Error('Activity Scope is not supported.');

		backBoneRouter.bind('all', function (trigger) {
		       var routeData = trigger.split(":");
		        if (routeData[0] === "route") {
		        	activityScope.create(routeData[1]);
		        }
		    }
		});
	}

	CorrelatorSharp.bindBackboneRouteEvent = bindRouteEvent;


    /* Bind method for all the model calls to before send.
    /*****************************************************/

	function bindHeaders(xhrFromBeforeSend) {

		var currentScope = CorrelatorSharp.currentScope;
		var statics = CorrelatorSharp.Statics;

		if (!currentScope)
    		throw new Error('Activity Scope is not supported.');

        xhrFromBeforeSend.setRequestHeader(statics.CORRELATION_ID_HEADER], currentScope.id.value);
        xhrFromBeforeSend.setRequestHeader(statics.CORRELATION_ID_STARTED_HEADER], currentScope.id.time);
        xhrFromBeforeSend.setRequestHeader(statics.CORRELATION_ID_NAME_HEADER], currentScope.name); 

        if (currentScope.parent)
        	xhrFromBeforeSend.setRequestHeader(statics.CORRELATION_ID_PARENT_HEADER], currentScope.parent);
	}

	CorrelatorSharp.bindBackboneModelHeaders = bindHeaders;

}(window.CorrelatorSharp || {}, window));
