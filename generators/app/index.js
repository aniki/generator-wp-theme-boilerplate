'use strict';
var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to ' + chalk.red('Wordpress Theme Boilerplate') + ' generator!'
    ));

    var prompts = [{
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
      name: 'cssPreProcessor',
      message: 'Would you like to use SASS or LESS?',
      default: 'less',
      choices: ['less', 'sass', 'nope']
    },
    {
      type: 'checkbox',
      name: 'buildTools',
      message: 'Would you add some of these building tools ?',
      choices: [{
        name: 'Server Side Includes (SSI)',
        value: 'includeSSI',
        checked: true
      },{
        name: 'Webfont generator',
        value: 'includeWebfont',
        checked: true
      }]
    },
    {
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

      this.includeSSI = hasFeature(props.buildTools, 'includeSSI');
      this.includeWebfont = hasFeature(props.buildTools, 'includeSSI');

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
      dependencies: {}
    };

    bower.dependencies.jquery = '~1.11.1';

    if (this.includeModernizr) {
      bower.dependencies.modernizr = '~2.8.2';
    }
    if (this.includeLodash) {
      bower.dependencies.lodash = '~3.9.3';
    }

    this.copy('bowerrc', '.bowerrc');
    this.write('bower.json', JSON.stringify(bower, null, 2));
  },

  stylesheets: function () {
    var extension, folder;

    switch (this.props.cssPreProcessor) {
      case "less" :
        extension = "less";
        folder = "less/"
        break;
      case "sass" :
        extension = "scss"
        folder = "sass/"
        break;
      case "nope" :
      default :
        extension = "css";
        folder = ""
    }

    this.directory('styles/' + extension, 'app/styles/' + folder);
    //this.copy('scripts/', 'app/');
    //this.template('styles/' + extension + '/main.' + extension, 'app/styles/' + folder + 'main.' + extension);
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

  app: function () {
    /*
    this.directory('app');
    this.mkdir('app/scripts');
    this.mkdir('app/styles');
    this.mkdir('app/images');
    this.write('app/index.html', this.indexFile);

    this.copy('scripts/main.js', 'app/scripts/main.js');
    */
  },

  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
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
    this.installDependencies();
  }
});
