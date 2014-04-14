# node-tidy-package

This is a node tool to compare the packages you have required in your `package.json` in
both `devDependencies` and `dependencies` to their actual usage in your project.  It searches
for both `*.js` files and files in any `bin` directories.

Any dependencies that it finds no `require()` on will be flagged as **unused**.

It does not modify your project in any way, simply provides a list of these packages.

## Usage

    $ npm install -g tidy-package
    $ cd /path/to/project
    $ tidy-package .

At the most basic level, tidy-package takes a single parameter.  The path to a
project root containing a `package.json` file.

### Options

    --exclude <string pattern>

This is a simple alpha numeric pattern to exclude any path containing it.  This
will tell tidy-package to not search any matched directories for requires.

    --used <packages,to,flag,as,used>

This tells tidy-package to ignore these packages as being known to be used, and
will not report them as unused even if no requires are found.

## License

Apache 2.0
