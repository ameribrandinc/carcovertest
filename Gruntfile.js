module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concurrent: {
			dev: ['watch', 'nodemon:dev'],
			options: {
				logConcurrentOutput: true
			}
		},
		nodemon: {
			dev: {
				options: {
					file: 'server.js',
					watchedExtensions: ['js', 'dust'],
					watchedFolders: ['app/'],
					env: {}
				}
			}
		},
		watch: {
			css: {
				files: 'sass/**/*.scss',
				tasks: ['sass:dist']
			},
			js: {
				files: ['assets/**/*.js', 'app/**/*.js', 'config/**/*.js', 'database/**/*.js'],
				tasks: ['jshint', 'jsbeautifier']
			},
			clientJs: {
				files: ['assets/**/*.js', 'app/client/**/*.js'],
				tasks: ['copy:dev', 'browserify']
			}
		},
		jsbeautifier: {
			files: ['**/*.js', '!node_modules/**/*.js', '!public/**/*.js', '!**/*.min.js', '!assets/**/*.js', '!app/client/libs/*.js'],
			options: {
				js: {
					'indent_size': 1,
					'indent_char': '	'
				}
			}
		},
		uglify: {
			dist: {
				options: {
					unused: false
				},
				files: [{
					expand: true,
					cwd: 'public/scripts',
					src: '**/*.js',
					dest: 'public/scripts'
				}, {
					expand: true,
					cwd: 'public/style',
					src: '**/*.js',
					dest: 'public/style'
				}]
			}
		},
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'public/style/tjcars.css': 'sass/tjcars.scss'
				}
			}
		},
		execute: {
			sitemap: {
				src: ['sitemap-generator/site-crawler.js']
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['tests/functional/**/*.js']
			}
		},
		// TODO: this task isn't running correctly inside 'grunt build'
		// it needs to be fixed
		shell: {
			copySitemap: {
				options: {
					stdout: true
				},
				command: 'cp ./public/sitemap.xml ../carcovers-legacy'
			}
		},

		browserify: {
			libs: {
				options: {
					transform: ['browserify-shim']
				},
				src: ['./app/client/libs/*.js'],
				dest: './public/scripts/libs.js'
			},
			dist: {
				files: {
					'public/scripts/main.js': ['app/client/main.js'],
					'public/scripts/views/pages/home.js': ['app/client/views/pages/home.js']
				}
			}
		},

		jshint: {
			src: ['.'],
			options: {
				jshintrc: true,
				force: true,
				reporter: require('jshint-stylish')
			}
		},

		copy: {
			dev: {
				files: [{
					expand: true,
					cwd: 'assets/',
					src: ['**'],
					dest: 'public/'
				}, {
					src: 'node_modules/js-cookie/src/js.cookie.js',
					dest: 'app/client/libs/js.cookie.js'
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: 'assets/',
					src: ['**'],
					dest: 'public/'
				}, {
					src: 'node_modules/js-cookie/src/js.cookie.js',
					dest: 'app/client/libs/js.cookie.js'
				}]
			}
		},

		postcss: {
			options: {
				map: true,
				processors: [
					require('autoprefixer-core')({
						browsers: ['last 2 versions', '> 5%']
					})
				]
			},
			dist: {
				src: 'public/style/*.css'
			}
		},

		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'assets/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'public/'
				}]
			}
		}

	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-execute');
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-shell');

	// default build task
	grunt.registerTask('default', ['copy:dev', 'sass', 'browserify']);
	// default dev task
	grunt.registerTask('serve', ['concurrent:dev']);

	grunt.registerTask('test', ['mochaTest']);
	// build task
	grunt.registerTask('build', ['copy:dist', 'sass:dist', 'postcss:dist', 'imagemin:dist', 'browserify', 'uglify:dist']);
};
