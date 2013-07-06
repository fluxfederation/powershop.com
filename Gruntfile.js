module.exports = function(grunt) {
  grunt.initConfig({
    jekyll: {
      server : {}
    },
 
    less: {
      dist: {
        options: {
          yuicompress: true
        },
        files: {
          "_assets/dist/prod.css": ["_assets/src/less/*.less"]
        }
      }
    },
    uglify: {
      vendor: {
        files: {
          '_assets/dist/vendor.js': [
            '_assets/src/vendor/*.js'
          ]
        }
      },
      dist: {
        files: {
          '_assets/dist/prod.js': [
            '_assets/src/vendor/*.js',
            '_assets/dist/site.js'
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
          '_assets/dist/site.js': [ '_assets/src/coffee/*.coffee'],
        }
      }
    },
    watch: {
      coffee: {
        files: ['_assets/src/coffee/*.coffee'],
        tasks: ['coffee', 'uglify:dist']
      },
      vendor: {
        files: ['_assets/src/vendor/*.js'],
        tasks: ['uglify:vendor']
      },
      less: {
        files: ['_assets/src/less/*.less'],
        tasks: ['less']
      },
      jekyll: {
        files: ['_assets/dist/*', 'index.html', '404.html', '_includes/*', '_layouts/*', 'about/*', 'contact/*', 'culture/*'],
        tasks: ['jekyll']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jekyll');

  grunt.registerTask('default', ['watch']);

};