(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
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

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (crypto, globals) {

    /* Regex for checking is string is UUID or empty GUID
    /*****************************************************/

    var UUID_REGEX = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89aAbB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}|[0]{8}-[0]{4}-[0]{4}-[0]{4}-[0]{12}/;

    globals.isUuid = function isUuid(suspectString) {
        return suspectString.match(UUID_REGEX);
    };

    /* Generate a new uuid string using browser crypto or time.
    /*****************************************************/

    function rngCrypto() {
        return crypto.getRandomValues(new Uint8Array(1))[0];
    }

    function rngTime(i) {
        return Math.random() * 0x100000000 >>> ((i & 0x03) << 3) & 0xff;
    }

    var rng = crypto && crypto.getRandomValues && Uint8Array ? rngCrypto : rngTime;

    function generateNewId() {
        var i = 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = rng(i++) % 16 | 0,
                v = c == 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    }

    /* Uuid object wrapper for validation and 'security'.
    /*****************************************************/

    var Uuid = (function () {
        _createClass(Uuid, null, [{
            key: 'EMPTY',
            get: function get() {
                return new Uuid('00000000-0000-0000-0000-000000000000');
            }
        }]);

        function Uuid(seed) {
            _classCallCheck(this, Uuid);

            if (seed && !isUuid(seed.toString())) {
                throw new Error('seed value for uuid must be valid uuid.');
            }

            this.innervalue = (seed || generateNewId()).toString();
            this.innertime = new Date();
        }

        _createClass(Uuid, [{
            key: 'toString',

            // Override to return just the uuid.
            value: function toString() {
                return this.value;
            }
        }, {
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

(function (correlatorSharp, uuid, globals) {

    var CorrelatorSharp = correlatorSharp;

    /* Static module memebers.
    /*********************************************************/

    var statics = {
        CORRELATION_ID_HEADER: 'X-Correlation-Id',
        CORRELATION_ID_STARTED_HEADER: 'X-Correlation-Started',
        CORRELATION_ID_NAME_HEADER: 'X-Correlation-Name',
        CORRELATION_ID_PARENT_HEADER: 'X-Correlation-Parent'
    };

    CorrelatorSharp.Statics = statics;

    /* ActivityScope - Core of the library.
    /*********************************************************/

    var activityScope = null;

    function activityScopeFactory(name, parent, seed) {
        return activityScope = new ActivityScope(name, parent, new uuid(seed));
    }

    var ActivityScope = (function () {

        /* Instance class memebers.
        /*********************************************************/

        function ActivityScope(name, parent, seed) {
            _classCallCheck(this, ActivityScope);

            if (parent && !(parent instanceof ActivityScope)) {
                throw new Error('parent must be an activity scope.');
            }

            if (seed && !(seed instanceof uuid)) {
                throw new Error('seed must be a valid UUID.');
            }

            this.innerid = seed || new uuid();
            this.innername = name;
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

            /* Static class memebers.
            /*********************************************************/

            // Access memebers

        }], [{
            key: 'create',

            // Creation members.

            value: function create(name, seed) {
                return activityScopeFactory(name, null, seed);
            }
        }, {
            key: 'child',
            value: function child(name, seed) {
                return activityScopeFactory(name, activityScope, seed);
            }
        }, {
            key: 'new',
            value: function _new(name, seed) {
                return activityScopeFactory(name, activityScope.parent, seed);
            }
        }, {
            key: 'current',
            get: function get() {
                return activityScope;
            },
            set: function set(value) {
                if (value && !(value instanceof ActivityScope)) throw new Error("Can't set value of activity scope to be anything but activity scope type.");

                activityScope = value;
            }
        }]);

        return ActivityScope;
    })();

    CorrelatorSharp.ActivityScope = ActivityScope;

    /* Global module.
    /*********************************************************/

    globals.CorrelatorSharp = CorrelatorSharp;
})(window.CorrelatorSharp || {}, Uuid, window);

'use strict';

(function (ng, uuid, cs) {

    ng.module('correlator-sharp', [])

    /* Add the interceptor to the app provider
    /*****************************************************/

    .config(['$httpProvider', function ($httpProvider) {

        $httpProvider.interceptors.push('csHttpInterceptor');
    }])

    /* Interceptor used for setting headers from the current activity.
    /*****************************************************/

    .factory('csHttpInterceptor', ['csStatic', 'csActivityScope', function (statics, activityScope) {

        return {

            request: function request(config) {

                // Add the name for the scope.
                var name = config.method + ' ' + config.url;

                // Add the current activity scope's id.
                var reqScope = new cs.ActivityScope(name, activityScope.current);

                config.headers[statics.CORRELATION_ID_HEADER] = reqScope.id.value;
                config.headers[statics.CORRELATION_ID_STARTED_HEADER] = reqScope.id.time.toISOString();
                config.headers[statics.CORRELATION_ID_NAME_HEADER] = reqScope.name;

                if (reqScope.parent) config.headers[statics.CORRELATION_ID_PARENT_HEADER] = reqScope.parent.id.value;

                return config;
            },

            response: function response(_response) {

                var correlationId = _response.headers[statics.CORRELATION_ID_HEADER];
                if (correlationId) {

                    // Setup the scope with server generated id.
                    var _name = _response.config.method + ' ' + _response.config.url;

                    activityScope.create(_name, correlationId);
                }

                return _response;
            }
        };
    }])

    /* Globals useful for the other apps to use.
    /*****************************************************/

    .service('csStatic', function () {
        return ng.extend({}, cs.Statics);
    })

    /* Angular wrapper around the UUID module.
    /*****************************************************/

    .service('csUuid', function () {
        return {
            generate: function generate(seed) {
                return new uuid(seed);
            }
        };
    })

    /* Angular wrapper around the ActivityScope module.
    /*****************************************************/

    .service('csActivityScope', ['$rootScope', 'csUuid', function ($rootscope, uuid) {

        return Object.defineProperties({

            // Creation members.

            create: function create(name, seed) {
                return cs.ActivityScope.create(name, seed);
            },

            child: function child(name, seed) {
                return cs.ActivityScope.child(name, seed);
            },

            'new': function _new(name, seed) {
                return cs.ActivityScope['new'](name, seed);
            }
        }, {
            current: {

                // Access memebers

                get: function get() {
                    return cs.ActivityScope.current;
                },
                set: function set(value) {
                    cs.ActivityScope.current = value;
                },
                configurable: true,
                enumerable: true
            }
        });
    }]);
})(angular, Uuid, CorrelatorSharp);

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

