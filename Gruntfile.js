	module.exports = function(grunt){
		"use strict";

		require('load-grunt-tasks')(grunt);

		grunt.initConfig({
			pkg : grunt.file.readJSON('package.json'),
			uglify: {
				dist: {
					options:{
						banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
						mangle: true, // rename vars
						sourceMap: true
					},
					files: {
						'js/min.js': ['src/js/vendor/jquery*.js', 'src/js/main.js', 'src/js/lib.js', 'src/js/plugins.js']
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
					src: ['Gruntfile.js', 'src/js/**/*.js', '!src/js/vendor/*.js'],
				}
			},
			less: {
				dist: {
					options: {
						//paths: ["assets/css"],
						//report: 'gzip',
						compress: true,
						sourceMap: true,
						sourceMapFilename: 'css/main.map',
						sourceMapRootpath: '/'
					},
					files: {
						"css/main.css": "src/less/main.less"
					}
				}
			},
			watch: {
				js: {
					files: ['src/js/*.js'],
					tasks: ['js'],
					options: {
						spawn: false,
						livereload: true
					}
				},
				css: {
					files: ['src/less/*.less'],
					tasks: ['css'],
					options: {
						spawn: false,
						livereload: true
					}
				},
				img: {
					files: ['**/*.{png,jpg,gif}'],
					tasks: ['img'],
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
						cwd: 'src/img/', // Src matches are relative to this path
						src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
						dest: 'img/' // Destination path prefix
					}]
				}
			},
			clean: {
				dist: {
					src: ["js", "css", "img", "build"]
				}
			}
		});


		grunt.registerTask('default', ['js', 'css', 'img', 'html']);
		grunt.registerTask('js', ['jshint', 'uglify']);
		grunt.registerTask('css', ['less']); //, 'replace'
		grunt.registerTask('img', ['imagemin']);
		grunt.registerTask('start', ['clean:dist', 'default', 'watch']);
		

		/*grunt.registerTask('encapsulate', 'desc', function() {
			var clean = {dist: {src: ["favicon.ico"]}};
			grunt.config("clean", clean);
			grunt.task.run('clean:dist');
		});

		grunt.registerTask('encapsulate2', 'desc', function() {
			grunt.task.run('encapsulate');
		});*/

		grunt.registerTask('cfgLocal', ['cfg:local', 'show-config:cfg']);
		grunt.registerTask('cfgProd', ['cfg:production', 'show-config:cfg']);

	
		grunt.registerTask('cfg', 'Set the env.', function(envType) {
			envType = envType || 'local'; // default
			var configFilePath;
			var configDefaultPath = "configs/default.json";
			var configOverridePath = "configs/override.json";
			switch(envType)
			{
				case "local": configFilePath = "configs/local.json"; break;
				case "dev": configFilePath = "configs/dev.json"; break;
				case "staging": configFilePath = "configs/staging.json"; break;
				case "production": configFilePath = "configs/production.json"; break;
			}

			if(grunt.file.exists(configDefaultPath))
			{
				grunt.config.set("cfg", grunt.file.readJSON(configDefaultPath));
			}
			else
			{
				grunt.fail.fatal('The ' + configDefaultPath + ' file does not exist');
			}

			if(grunt.file.exists(configFilePath))
			{
				var main = grunt.file.readJSON(configFilePath)
				grunt.config.set("cfg",(grunt.util._.defaults(main, grunt.config("cfg"))));
				
				if(grunt.file.exists(configOverridePath))
				{
					var overrides = grunt.file.readJSON(configOverridePath)
					grunt.config.set("cfg",(grunt.util._.defaults(overrides, grunt.config("cfg"))));
				}
			}
			else
			{
				grunt.fail.fatal('The ' + configFilePath + ' file does not exist');
			}
		});


		//var target = grunt.option('target') || 'dev';
		grunt.registerTask('custom', 'My "default" task description.', function() {
			var target = grunt.option('target') || 'dev';
			var livereload = grunt.option('livereload') || false;
			//var clean = grunt.option('clean') || false;
			//if(clean) grunt.task.run('clean:dist');
		});
		
		grunt.registerTask('html', 'My "default" task description.', function() {
			var validation = {
				options: {
					reset: grunt.option('reset') || false,
					stoponerror: true,
					relaxerror: ["Bad value X-UA-Compatible for attribute http-equiv on element meta."] //ignores these errors
				},
				files: {
					src: ["src/index.html"]
				}
			};
			grunt.config.set("validation", validation);
			grunt.task.run('validation');

			var htmlmin = {
				dist: {
					options: {
						removeComments: true,
						collapseWhitespace: true
					},
					files: {
						'build/index.html': 'src/index.html' 
					}
				}
			};
			grunt.config.set("htmlmin", htmlmin);
			grunt.task.run('htmlmin:dist');
		});
		

		//grunt.loadTasks // Loading Externally-Defined Tasks

				//grunt.file.copy(srcpath, destpath [, options])
			//grunt.file.delete(filepath [, options])
			//grunt.file.recurse(rootdir, callback)
			//grunt.file.mkdir("bin-deploy", "0777");
			//grunt.file.isMatch
			//grunt.file.exists
			//grunt.file.isLink
			//grunt.file.isDir
			//grunt.file.isFile

		/*
		grunt.event.on('watch', function(action, filepath) {
			grunt.log.writeln('-------------------------------------------');
			grunt.log.writeln('filepath:' + filepath);
			//grunt.config(['imagemin', 'dist'], filepath);
			grunt.log.writeln(grunt.config('imagemin.dist.src'));
		});
		
		var changedFiles = Object.create(null);
		var onChange = grunt.util._.debounce(function() {
			grunt.config(['imagemin', 'dist'], Object.keys(changedFiles));
			changedFiles = Object.create(null);
		}, 200);
		grunt.event.on('watch', function(action, filepath) {
			changedFiles[filepath] = action;
			onChange();
		});
		*/
	};