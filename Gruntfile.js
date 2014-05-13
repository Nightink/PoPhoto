
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        'app.js',
        'Gruntfile.js',
        'static/src/**/*.js',
        'controllers/**/*.js',
        'libs/**/*.js',
        'middleware/**/*.js',
        'models/**/*.js',
        'routers/**/*.js',
        'scripts/**/*.js',
        'test/**/*.js'
      ],
      options: {
        // options here to override JSHint defaults
        globals: {
          window: true,
          seajs: true,
          console: true,
          module: true,
          document: true,
          location: true,
          define: true,
          describe: true,
          before: true,
          it: true,
          after: true,
          __dirname: true,
          require: true,
          exports: true,
          global: true,
          alert: true,
          process: true,
          Buffer: true
        },
        quotmark: 'single',
        undef: true,
        asi: false,
        maxlen: 120
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'watch']);
};
