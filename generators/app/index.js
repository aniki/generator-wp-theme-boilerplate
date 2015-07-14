'use strict';
var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // setup the test-framework property, Gruntfile template will need this
    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });
    this.testFramework = this.options['test-framework'];

    this.pkg = require('../../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to ' + chalk.red('Wordpress Theme Boilerplate') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'author',
      message: 'What is your name ?',
      default: 'myName'
    },{
      type: 'input',
      name: 'themeName',
      message: 'What is the name of your theme ?',
      default: 'myTheme'
    },{
      type: 'input',
      name: 'host',
      message: 'What is the base host of your Wordpress context ?',
      default: 'http://localhost/'
    },{
      type: 'list',
      name: 'taskRunner',
      message: 'Would you like to use Grunt or Gulp?',
      default: 'grunt',
      choices: ['grunt', 'gulp']
    },{
      type: 'list',
      name: 'cssPreProcessor',
      message: 'Would you like to use SASS or LESS?',
      default: 'less',
      choices: ['less', 'sass', 'none']
    },{
    //  type: 'checkbox',
    //  name: 'buildTools',
    //  message: 'Would you add some of these building tools ?',
    //  choices: [{
    //    name: 'Server Side Includes (SSI)',
    //    value: 'includeSSI',
    //    checked: true
    //  },{
    //    name: 'Webfont generator',
    //    value: 'includeWebfont',
    //    checked: true
    //  }]
    //},{
      type: 'checkbox',
      name: 'bowerLibs',
      message: 'Would you like to add some libs to Bower ?',
      choices: [{
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      },{
        name: 'Lodash',
        value: 'includeLodash',
        checked: false
      },{
        name: 'Flexslider',
        value: 'includeFlexslider',
        checked: false
      },{
        name: 'Isotope',
        value: 'includeIsotope',
        checked: false
      }]
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      function hasFeature(promptItem, feature) {
        return promptItem && promptItem.indexOf(feature) !== -1;
      }

      // optional build tasks
      /*
      this.includeSSI = hasFeature(props.buildTools, 'includeSSI');
      this.includeWebfont = hasFeature(props.buildTools, 'includeSSI');
      */

      // bower libs
      this.includeModernizr = hasFeature(props.bowerLibs, 'includeModernizr');
      this.includeLodash = hasFeature(props.bowerLibs, 'includeLodash');
      this.includeFlexslider = hasFeature(props.bowerLibs, 'includeFlexslider');
      this.includeIsotope = hasFeature(props.bowerLibs, 'includeIsotope');

      done();
    }.bind(this));
  },

  bower: function () {
    var bower = {
      name: this.props.themeName,
      //name: this._.slugify(this.props.themeName),
      private: true,
      dependencies: {},
      overrides: {}
    };

    bower.dependencies.jquery = '~1.11.3';

    if (this.includeModernizr) {
      bower.dependencies.modernizr = '~2.8.3';
    }
    if (this.includeLodash) {
      bower.dependencies.lodash = '~3.9.3';
    }
    if (this.includeFlexslider) {
      bower.dependencies.FlexSlider = '~2.5.0';
      /*
      bower.overrides.FlexSlider = {
        "main": [
          "jquery.flexslider.js",
          "flexslider.css"
        ]
      };
      */
    }
    if (this.includeIsotope) {
      bower.dependencies.isotope = '~2.2.0';
    }
    if (this.includeColorbox) {
      bower.dependencies.colorbox = "~1.5.10";
    }

    this.copy('bowerrc', '.bowerrc');
    this.write('bower.json', JSON.stringify(bower, null, 2));
  },

  npm: function() {
    this.template('_package.json', 'package.json');
  },

  grunt: function() {
    if (this.props.taskRunner == 'grunt') {
      this.template('Gruntfile.js');
    }
  },

  gulp: function() {
    if (this.props.taskRunner == 'gulp') {
      this.template('gulpfile.js');
    }
  },

  app: function () {
     this.mkdir('assets');
     this.directory('src');
     this.mkdir('src/scripts');
     this.mkdir('src/images');
     this.mkdir('src/fonts');

    this.directory('scripts/', 'src/scripts/');
    this.directory('images/', 'src/images/');
    this.directory('fonts/', 'src/fonts/');
  },

  themeMetadata: function() {
    // vanilla css
    if (this.props.cssPreProcessor == 'none') {
      this.fs.copyTpl(
          this.templatePath('styles/css/style.css'),
          this.destinationPath('style.css'),
          this
      );
    }
    // sass
    if (this.props.cssPreProcessor == 'sass') {
      this.fs.copyTpl(
          this.templatePath('styles/sass/style.scss'),
          this.destinationPath('src/styles/sass/style.scss'),
          this
      );
    }
    // less
    if (this.props.cssPreProcessor == 'less') {
      this.fs.copyTpl(
          this.templatePath('styles/less/style.less'),
          this.destinationPath('src/styles/less/style.less'),
          this
      );
    }
  },

  stylesheets: function () {
    var extension, folder;

    switch (this.props.cssPreProcessor) {
      case "less" :
        this.directory('styles/less/', 'src/styles/less/');
        break;
      case "sass" :
        this.directory('styles/sass/', 'src/styles/sass/');
        break;
      case "nope" :
      default :
        this.copy('styles/css/style.css', 'style.css');
    }

  },

  /*
  scripts: function() {
    this.directory('scripts/', 'src/scripts/');
  },
  */

  phpTemplates: function() {
    this.directory('php/', '.');
  },

  writeIndex: function () {
    this.indexFile = this.engine(
        this.readFileAsString(join(this.sourceRoot(), 'html/index.html')),
        this
    );

    this.indexFile = this.appendFiles({
      html: this.indexFile,
      fileType: 'js',
      optimizedPath: 'scripts/main.js',
      sourceFileList: ['scripts/main.js'],
      searchPath: ['app', '.tmp']
    });
  },

  writing: {
    app: function () {
      /*
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
      */
    },

    mamp: function() {
      this.copy('osx-mamp-watch.command', 'osx-mamp-watch.command');
    },

    editorConfig: function () {
      this.copy('editorconfig', '.editorconfig');
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    //this.installDependencies();
  }
});
