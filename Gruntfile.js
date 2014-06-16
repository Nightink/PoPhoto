
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
       jshintrc: '.jshintrc'
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
