	module.exports = function(grunt){
		"use strict";

		require('load-grunt-tasks')(grunt);

		grunt.initConfig({
			pkg : grunt.file.readJSON('package.json'),
			cfg: createConfig(),
			uglify: {
				dist: {
					options:{
						banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
						mangle: true, // rename vars
						sourceMap: true
					},
					files: {
						'<%= cfg.js.build %>min.js': ['<%= cfg.js.src %>vendor/jquery*.js', '<%= cfg.js.src %>main.js', '<%= cfg.js.src %>lib.js', '<%= cfg.js.src %>plugins.js']
					}
				}
			},
			jshint: {
				dist: {
					options: {
						'-W004': true,
						'validthis': true,
						'strict': true
					},
					src: ['Gruntfile.js', '<%= cfg.js.src %>**/*.js', '!<%= cfg.js.src %>vendor/*.js'],
				}
			},
			less: {
				dist: {
					options: {
						compress: true,
						sourceMap: true,
						sourceMapFilename: '<%= cfg.css.build %>main.map',
						sourceMapRootpath: '/'
					},
					files: {
						"<%= cfg.css.build %>main.css": "<%= cfg.less.src %>main.less"
					}
				}
			},
			watch: {
				js: {
					files: ['<%= cfg.js.src %>*.js'],
					tasks: ['js'],
					options: {
						spawn: false,
						livereload: true
					}
				},
				css: {
					files: ['<%= cfg.less.src %>*.less'],
					tasks: ['css'],
					options: {
						spawn: false,
						livereload: true
					}
				},
				img: {
					files: ['<%= cfg.img.src %>/*.{png,jpg,gif}'],
					tasks: ['img'],
					options: {
						spawn: false,
						livereload: true
					}
				},
				html: {
					files: ['<%= cfg.html.src %>/*.html'],
					tasks: ['html'],
					options: {
						spawn: false,
						livereload: true
					}
				}
			},
			imagemin: {
				dist: {
					files: [{
						expand: true, // Enable dynamic expansion
						cwd: '<%= cfg.img.src %>', // Src matches are relative to this path
						src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
						dest: '<%= cfg.img.build %>' // Destination path prefix
					}]
				}
			},
			validation: {
				options: {
					reset: grunt.option('reset') || false,
					stoponerror: true,
					relaxerror: ["Bad value X-UA-Compatible for attribute http-equiv on element meta."] //ignores these errors
				},
				files: {
					src: ["<%= cfg.html.src %>index.html"]
				}
			},
			htmlmin: {
				dist: {
					options: {
						removeComments: true,
						collapseWhitespace: true
					},
					files: {
						'<%= cfg.html.build %>index.html': '<%= cfg.html.src %>index.html' 
					}
				}
			},
			clean: {
				dist: {
					src: ["<%= cfg.js.build %>", "<%= cfg.css.build %>", "<%= cfg.img.build %>", "<%= cfg.html.build %>"]
				}
			},
			jsonlint: {
				sample: {
					src: ["package.json", 'configs/*.json']
				}
			},
			bump: {
				options: {
					files: ['package.json'],
					updateConfigs: [],
					commit: true,
					commitMessage: 'Release v%VERSION%',
					commitFiles: ['-a'], // 'package.json', '-a' for all files
					createTag: true,
					tagName: 'v%VERSION%',
					tagMessage: 'Version %VERSION%',
					push: false,
					//pushTo: 'upstream',
					gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
				}
			}			
		});


		grunt.registerTask('default', ['js', 'css', 'img', 'html']);
		grunt.registerTask('start', ['clean:dist', 'default', 'watch']);

		grunt.registerTask('js', ['jshint', 'uglify']);
		grunt.registerTask('css', ['less']); //, 'replace'
		grunt.registerTask('img', ['imagemin']);
		grunt.registerTask('html', ['validation', 'htmlmin']);

		grunt.registerTask('json', ['jsonlint']);
		
		grunt.registerTask('show-cfg', ['show-config:cfg']);

		
		function createConfig() {
			var envType = grunt.file.read("configs/env.txt");
			grunt.log.writeln("Environment: " + envType);
			envType = envType || 'local'; // default
			var configFilePath;
			var configDefaultPath = "configs/default.json";
			var configOverridePath = "configs/override.json";
			var cfg;
			switch(envType)
			{
				case "local": configFilePath = "configs/local.json"; break;
				case "dev": configFilePath = "configs/dev.json"; break;
				case "staging": configFilePath = "configs/staging.json"; break;
				case "production": configFilePath = "configs/production.json"; break;
			}

			// Defaults
			if(grunt.file.exists(configDefaultPath))
			{
				cfg = grunt.file.readJSON(configDefaultPath);
			}
			else
			{
				grunt.fail.fatal('The ' + configDefaultPath + ' file does not exist');
			}

			// Main config
			if(grunt.file.exists(configFilePath))
			{
				cfg = grunt.util._.defaults(grunt.file.readJSON(configFilePath), cfg);
			}
			else
			{
				grunt.fail.fatal('The ' + configFilePath + ' file does not exist');
			}

			// Override configs
			if(grunt.file.exists(configOverridePath))
			{
				cfg = grunt.util._.defaults(grunt.file.readJSON(configOverridePath), cfg);
			}

			return cfg;
		}
	};