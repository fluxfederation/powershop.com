module.exports = function(grunt) {
  grunt.initConfig({
    jekyll: {
      server : {

      }
    },
 
    less: {
      dist: {
        options: {
          yuicompress: true
        },
        files: {
          "_dist/prod.con.css": ["src/less/*.less"]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          '_dist/prod.con.js': [
            'src/vendor/*',
            '_dist/site.js'
          ]
        }
      }
    },
    coffee: {
      dist: {
        options: {
          join: true
        },
        files: {
          '_dist/site.js': [ 'src/coffee/*.coffee'],
        }
      }
    },
    watch: {
      coffee: {
        files: ['src/coffee/*.coffee'],
        tasks: ['coffee', 'uglify']
      },
      less: {
        files: ['src/less/*.less'],
        tasks: ['less']
      },
      jekyll: {
        files: ['_dist/*', '_layouts/*', 'about/*', 'contact/*', 'culture/*'],
        tasks: ['jekyll']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jekyll');

  grunt.registerTask('default', ['coffee', 'less', 'uglify', 'jekyll:server']);

};