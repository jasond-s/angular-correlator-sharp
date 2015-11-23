(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (crypto, globals) {

	var UUID_REGEX = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89aAbB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}|[0]{8}-[0]{4}-[0]{4}-[0]{4}-[0]{12}/;

	function generateNewId() {

		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0,
			    v = c == 'x' ? r : r & 0x3 | 0x8;

			return v.toString(16);
		});
	}

	var Uuid = (function () {
		_createClass(Uuid, null, [{
			key: 'EMPTY',
			get: function get() {
				return '00000000-0000-0000-0000-000000000000';
			}
		}]);

		function Uuid(seed) {
			_classCallCheck(this, Uuid);

			if (seed && !seed.match(UUID_REGEX)) {
				throw new Error('seed value for uuid must be valid uuid.');
			}

			this.innervalue = seed || generateNewId();
			this.innertime = new Date();
		}

		_createClass(Uuid, [{
			key: 'value',
			get: function get() {
				return this.innervalue;
			}
		}, {
			key: 'time',
			get: function get() {
				return this.innertime;
			}
		}]);

		return Uuid;
	})();

	globals.Uuid = Uuid;
})(window.crypto || window.msCrypto, window);

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (uuid, globals) {
	var ActivityScope = (function () {
		function ActivityScope(name, parent, seed) {
			_classCallCheck(this, ActivityScope);

			this.innerid = seed || new uuid();
			this.innername = name;

			if (parent && !(parent instanceof ActivityScope)) {
				throw new Error('prent must be an activity scope.');
			}

			this.innerparent = parent || null;
		}

		_createClass(ActivityScope, [{
			key: 'id',
			get: function get() {
				return this.innerid;
			}
		}, {
			key: 'parent',
			get: function get() {
				return this.innerparent;
			}
		}, {
			key: 'name',
			get: function get() {
				return this.innername;
			}
		}]);

		return ActivityScope;
	})();

	globals.ActivityScope = ActivityScope;
})(Uuid, window);

'use strict';

(function (ng) {

		var CORRELATION_ID_HEADER = 'X-Correlation-Id';

		ng.module('correlator-sharp', []).factory('correlatorSharpHttpInterceptor', ['ActivityScope', function (activityScope) {

				return {

						'request': function request(config) {

								// Add the current activity scope's id.

								config.headers[CORRELATION_ID_HEADER] = activityScope.current.id.value;

								return config;
						},

						'response': function response(_response) {

								var correlationId = _response.headers[CORRELATION_ID_HEADER];
								if (correlationId) {
										// Setup the scope with server generated id.

										var _name = _response.config.url + ' ' + _response.config.method;

										activityScope.current = activityScope.fromHeader(_name, correlationId);
								}

								return _response;
						}
				};
		}]).config(['$httpProvider', function ($httpProvider) {

				$httpProvider.interceptors.push('correlatorSharpHttpInterceptor');
		}]);
})(angular);

'use strict';

(function (ng, globals) {

	ng.module('correlator-sharp').service('ActivityScope', ['$rootScope', 'Uuid', function ($rootscope, uuid) {

		var activityScope = null;

		return Object.defineProperties({

			create: function create(name, seed) {
				return activityScope = new ActivityScope(name, null, uuid.generate(seed));
			},

			createChild: function createChild(name, seed) {
				return activityScope = new ActivityScope(name, activityScope, uuid.generate(seed));
			}
		}, {
			current: {
				get: function get() {
					return activityScope;
				},
				set: function set(value) {
					activityScope = value;
				},
				configurable: true,
				enumerable: true
			}
		});
	}]);
})(angular, window);

'use strict';

(function (ng, Uuid) {

	ng.module('correlator-sharp').service('Uuid', function () {

		return {
			generate: function generate(seed) {
				return new Uuid(seed);
			}
		};
	});
})(angular, Uuid);

