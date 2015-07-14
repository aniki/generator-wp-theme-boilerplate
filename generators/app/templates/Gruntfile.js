/*jshint node:true*/

// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: 'src',
    dist: 'assets'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint']
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },<% if (props.cssPreProcessor == 'sass') { %>
      sass: {
        files: ['<%%= config.app %>/styles/sass/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },<% } %>
      <% if (props.cssPreProcessor == 'less') { %>
      less: {
        files: ['<%= config.app %>/styles/less/**/*.less'],
            tasks: ['less','newer:copy:styles', 'autoprefixer'],
            options: {
          nospawn: true,
              livereload: true
        }
      },<% } %>
      styles: {
        files: ['<%%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      }
    },

    browserSync: {
      options: {
        notify: false,
        background: true
      },
      livereload: {
        options: {
          files: [
            '<%%= config.app %>/{,*/}*.html',
            '.tmp/styles/{,*/}*.css',
            '<%%= config.app %>/images/{,*/}*',
            '<%%= config.app %>/scripts/{,*/}*.js'
          ],
          port: 9000,
          server: {
            baseDir: ['.tmp', config.app],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      test: {
        options: {
          port: 9001,
          open: false,
          logLevel: 'silent',
          host: 'localhost',
          server: {
            baseDir: ['.tmp', './test', config.app],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      dist: {
        options: {
          background: false,
          server: '<%%= config.dist %>'
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%%= config.dist %>/*',
            '!<%%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%%= config.app %>/scripts/{,*/}*.js',
        '!<%%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },<% if (testFramework === 'mocha') { %>

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%%= browserSync.test.options.host %>:<%%= browserSync.test.options.port %>/index.html']
        }
      }
    },<% } else if (testFramework === 'jasmine') { %>

    // Jasmine testing framework configuration options
    jasmine: {
      all: {
        options: {
          specs: 'test/spec/{,*/}*.js'
        }
      }
    },<% } %>
    <% if (props.cssPreProcessor == 'sass') { %>

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourceMap: true,
        includePaths: ['bower_components'],
        loadPath: 'bower_components'
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/styles/sass',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/styles/sass',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },<% } %>
    <% if (props.cssPreProcessor == 'less') { %>

    // Compiles Less to CSS and generates necessary files if requested
    less: {
      development: {
        options: {
          compress: true,
              yuicompress: true,
              optimization: 2
        },
        files: {
          ".tmp/styles/style.css": "<%%= config.app %>/styles/less/style.less" // destination file and source file
        }
      }
    },<% } %>

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']<% if (props.cssPreProcessor != 'none') { %>,
        map: {
          prev: '.tmp/styles/'
        }
        <% } %>
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^<%= config.app %>\/|\.\.\//,
        src: ['<%%= config.app %>/index.html']
      }<% if (props.cssPreProcessor == 'sass') { %>,
      sass: {
        src: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }<% } %>
      <% if (props.cssPreProcessor == 'less') { %>,
        less: {
          src: ['<%%= config.app %>/styles/{,*/}*.{less}'],
              ignorePath: /(\.\.\/){1,2}bower_components\//
        }<% } %>
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%%= config.dist %>/scripts/{,*/}*.js',
          '<%%= config.dist %>/styles/{,*/}*.css',
          '<%%= config.dist %>/images/{,*/}*.*',
          '<%%= config.dist %>/styles/fonts/{,*/}*.*',
          '<%%= config.dist %>/*.{ico,png}'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%%= config.dist %>'
      },
      html: '<%%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%%= config.dist %>',
          '<%%= config.dist %>/images',
          '<%%= config.dist %>/styles'
        ]
      },
      html: ['<%%= config.dist %>/{,*/}*.html'],
      css: ['<%%= config.dist %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          // true would impact styles with attribute selectors
          removeRedundantAttributes: false,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%%= config.dist %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    cssmin: {
       dist: {
         files: {
           'style.css': [
             '.tmp/styles/{,*/}*.css',
             '<%%= config.app %>/styles/{,*/}*.css'
           ]
         }
       }
    },
    uglify: {
      dist: {
        files: {
          "<%%= config.dist %>/scripts/scripts.js" : grunt.file.readJSON('src/scripts/dependencies.json')
        }
      }
    },
    concat: {
       dist: {}
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= config.app %>',
          dest: '<%%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }]
       }<% if (props.cssPreProcessor == 'none') { %>,
       styles: {
           expand: true,
           dot: true,
           cwd: '<%%= config.app %>/styles',
           dest: '.tmp/styles/',
           src: '{,*/}*.css'
      }<% } %>
    },
    <% if (includeModernizr) { %>
    // Generates a custom Modernizr build that includes only the tests you
    // reference in your app
    modernizr: {
      dist: {
        devFile: 'bower_components/modernizr/modernizr.js',
        outputFile: '<%%= config.dist %>/scripts/vendor/modernizr.js',
        files: {
          src: [
            '<%%= config.dist %>/scripts/{,*/}*.js',
            '<%%= config.dist %>/styles/{,*/}*.css',
            '!<%%= config.dist %>/scripts/vendor/*'
          ]
        },
        uglify: true
      }
    },<% } %>

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [<% if (props.cssPreProcessor == 'none') { %>
        'copy:styles'<% } if (props.cssPreProcessor == 'sass') { %>
        'sass:server'<% } if (props.cssPreProcessor == 'less') {%>
        'less'<% } %>
      ],
      test: [<% if (props.cssPreProcessor == 'none') { %>
        'copy:styles'<% } %>
      ],
      dist: [<% if (props.cssPreProcessor == 'none') { %>
        'copy:styles',<% } if (props.cssPreProcessor == 'sass') { %>
        'sass',<% } if (props.cssPreProcessor == 'less') { %>
        'less',<% } %>
        'imagemin',
        'svgmin'
      ]
    }
  });


  grunt.registerTask('serve', 'start the server and preview your app', function (target) {

    if (target === 'dist') {
      return grunt.task.run(['build', 'browserSync:dist']);
    }

    grunt.task.run([
      'clean:server',
      //'wiredep',
      'concurrent:server',
      'autoprefixer',
      'browserSync:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', function (target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'autoprefixer'
      ]);
    }

    grunt.task.run([
      'browserSync:test',<% if (testFramework === 'mocha') { %>
      'mocha'<% } else if (testFramework === 'jasmine') { %>
      'jasmine'<% } %>
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    //'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',<% if (includeModernizr) { %>
    'modernizr',<% } %>
    //'filerev',
    'usemin',
    //'htmlmin'
  ]);

  grunt.registerTask('default', [
    //'newer:jshint',
    //'test',
    'build'
  ]);
};