module.exports = config:
	modules: wrapper: false
	minify: yes
	plugins: 
		babel: pattern: /\.(es6|jsx)$/
		uglify: ignored: /angular-correlator-sharp.js/
	paths: 
		public: 'dist'
		watched: [ 'src' ]
	files:
		javascripts: 
			joinTo: 
				'angular-correlator-sharp.js': /src/
				'angular-correlator-sharp.min.js': /src/
			order:
		      before: [ 
		      	'src/uuid-crypto.jsx', 
		      	'src/activity-scope.jsx' 
		      ]
