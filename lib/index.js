var fs        = require('fs'),
    colors    = require('colors'),
    join      = require('path').join,
    glob      = require('glob'),
    async     = require('async'),
    detective = require('detective');

module.exports = {

  getUniqueRequires: function(root, excludes, callback) {
    glob(join(root, '/**/*.js'), function(err, files) {
      glob(join(root, '/**/bin/*'), function(err, binFiles) {
        files = files.concat(binFiles);
        var requires = [];
        excludes = excludes || [];
        excludes.push('node_modules');
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
    });
  },

  getDependencies: function(root, callback) {
    fs.readFile(join(root, 'package.json'), 'utf8', function (err, pkg) {
      if (err) return callback(err);
      pkg = JSON.parse(pkg);

      var deps = [];
      for (var dep in pkg.dependencies) deps.push(dep);
      for (var devDep in pkg.devDependencies) deps.push(devDep);
      callback(null, deps);
    });
  }
};
