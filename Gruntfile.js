module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      dist: {
        options: {
          yuicompress: true
        },
        files: {
          "_dist/production.css": ["src/less/*.less"]
        }
      }
    },
    coffee: {
      dist: {
        options: {
          join: true
        },
        files: {
          '_dist/production.js': ['src/coffee/*.coffee'],
        }
      }
    },
    copy: {
      files: [
        {expand: true, src: ['_dist/**'], dest: '_site/_dist/'},
        {expand: true, src: ['img/**'], dest: '_site/img/'},
      ]
    },
    watch: {
      coffee: {
        files: ['src/coffee/*.coffee'],
        tasks: ['coffee']
      },
      less: {
        files: ['src/less/*.less'],
        tasks: ['less']
      },
      jekyll: {
        files: ['img/**'],
        tasks: ['copy']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jekyll');

  grunt.registerTask('default', ['coffee', 'less', 'jekyll:server']);

};