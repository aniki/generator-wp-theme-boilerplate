# generator-wp-theme-boilerplate [![Build Status](https://secure.travis-ci.org/aniki/generator-wp-theme-boilerplate.png?branch=master)](https://travis-ci.org/aniki/generator-wp-theme-boilerplate)

Wordpress theme boilerplate generator providing a full frontend stack for fast and reliable development including task runners, css preprocessor, package managers and more. 
The wordpress boilerplate code comes from the excellent [html5blank](http://html5blank.com/) open source project.

## Getting Started

### Install Yeoman

> [Yeoman](http://yeoman.io)

```bash
npm install -g yo
```

### Install WP Theme Boilerplate generator

```bash
npm install -g generator-wp-theme-boilerplate
```

Finally, initiate the generator in your project directory:

```bash
yo wp-theme-boilerplate
```

## Features

### Task runner

Choice between Grunt or Gulp.

### CSS preprocessor

Choice between SASS, LESS or vanilla CSS

### Client-side libs

Optional Client-side libs proposed via bower:

* modernizr
* lodash
* flexslider
* isotope

### Features list

* CSS preprocessor (LESS/SASS)
* CSS normalize
* Concatenation/minification
* fingerprinting
* Image optimization
* Webfont generation

## License

MIT


## Todo

* Gruntfile
    * LESS/SASS watcher option
    * SSI option
    * Webfont option
* Travis integration