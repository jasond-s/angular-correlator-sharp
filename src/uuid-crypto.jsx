


(function (crypto, globals) {

	let UUID_REGEX = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89aAbB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}|[0]{8}-[0]{4}-[0]{4}-[0]{4}-[0]{12}/;

	function generateNewId() {
		
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    let r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0, 
		    	v = c == 'x' ? r : (r & 0x3 | 0x8);

		    return v.toString(16);
		});
	}

	class Uuid {

		static get EMPTY() { 
			return '00000000-0000-0000-0000-000000000000' 
		};

		constructor(seed) {
			if (seed && !seed.match(UUID_REGEX)) {
				throw new Error('seed value for uuid must be valid uuid.');
			}

			this.innervalue = seed || generateNewId();
			this.innertime = new Date();
		}

		get value() {
			return this.innervalue;
		}

		get time() {
			return this.innertime;
		}
	}

	globals.Uuid = Uuid;

} (window.crypto || window.msCrypto, window));