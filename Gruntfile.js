
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
        globals: {
          window: true,
          seajs: true,
          document: true,
          location: true,
          alert: true,
          define: true,
          describe: true,
          before: true,
          it: true,
          after: true
        },
        quotmark: 'single',
        undef: true,
        asi: false,
        maxlen: 120,
        mocha: true,
        node: true
      }
    },

    watch: {
      files: '<%= jshint.files %>',
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'watch']);
};
