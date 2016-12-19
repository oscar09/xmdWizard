'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

//var path = require('path');

module.exports = function (grunt) {

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		yeoman: {
			// configurable paths
			app: './',
			directiveName: 'xmdWizard'
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.app %>/source/{,**/}*.js'
			]
		},
		nginlinetemplates: {
			app: {
				src: 'source/**/*.html',
				dest: 'build/<%= yeoman.directiveName %>.directive.js'
			}
		},
		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: /source\//g,
							replacement: ''
						}
					]
				},
				files: [
					{expand: true, flatten: true, src: ['source/*.directive.js', 'source/assets/**/*'], dest: 'build/'}
				]
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				background: false,
				singleRun: true
			}
		},
		connect: {
			server: {
				options: {
					port: 9000,
					hostname: 'localhost',
					open: {
						target: 'http://localhost:9000/demo.html', // target url to open
						appName: 'open', // name of the app that opens, ie: open, start, xdg-open
						callback: function() {} // called when the app has opened
					}
				}
			}
		},
		watch: {
			options: {
				livereload: false
			},
			css: {
				files: ['source/**/*.js'],
				tasks: ['jshint:all']
			}
		}
	});

	grunt.registerTask('build',
		[
			'jshint:all',
			//'karma', @todo - add testing
			'replace',
			'nginlinetemplates'
		]
	);

	grunt.registerTask('default',
		[
			'jshint:all',
			'connect',
			'watch'
		]
	);

	grunt.registerTask('check',
		[
			'jshint:all'
		]
	);
};