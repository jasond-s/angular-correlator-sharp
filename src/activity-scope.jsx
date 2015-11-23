


(function (uuid, globals) {

	class ActivityScope {

		constructor (name, parent, seed) {
			this.innerid = seed || new uuid();
			this.innername = name;

			if (parent && !(parent instanceof ActivityScope)) {
				throw new Error('prent must be an activity scope.');
			}

			this.innerparent = parent || null;
		}

		get id() {
			return this.innerid;
		}

		get parent() {
			return this.innerparent;
		}

		get name() {
			return this.innername;
		}
	}

	globals.ActivityScope = ActivityScope;

} (Uuid, window));