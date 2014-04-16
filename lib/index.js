var fs        = require('fs'),
    colors    = require('colors'),
    join      = require('path').join,
    glob      = require('glob'),
    async     = require('async'),
    detective = require('detective');

function merge(a, b) {
  var i, x = [];
  for (i in a) x[i] = a[i];
  for (i in b) x[i] = b[i];
  return x;
}

module.exports = {

  getUniqueRequires: function(root, excludes, callback) {
    excludes = excludes || [];
    excludes.push('node_modules');

    async.parallel([
      function globJsFiles(next) {
        glob(join(root, '/**/*.js'), next);
      },
      function globBinFiles(next) {
        glob(join(root, '/**/bin/*'), next);
      }
    ],
    function(err, results) {
      var requires = [],
          files    = [].concat.apply([], results);

      async.each(
        files,
        function(file, done) {
          for (var i = 0; i < excludes.length; i++) {
            if (excludes[i] && file.indexOf(excludes[i]) !== -1) return done();
          }

          if (!fs.lstatSync(file).isFile()) return done();

          fs.readFile(file, function(err, src) {
            if (err) return done(err);
            try {
              requires = requires.concat(detective(src, {
                parse: { tolerant: true }
              }));
              process.stdout.write(".");
            }
            catch (e) {
              console.log();
              console.log("Esprima Error ".red + "in processing " + file.replace(root + '/', '').blue);
              console.log(e.message);
              process.exit(2);
            }
            done();
          });
        },
        function(err) {
          if (err) return callback(err);
          requires = requires.filter(function(value, index) {
            return requires.indexOf(value) === index;
          });
          callback(null, requires);
        }
      );
    });
  },

  getDependencies: function(root, callback) {
    fs.readFile(join(root, 'package.json'), 'utf8', function (err, pkg) {
      if (err) return callback(err);
      pkg = JSON.parse(pkg);
      callback(null, merge(pkg.dependencies, pkg.devDependencies));
    });
  },
};
