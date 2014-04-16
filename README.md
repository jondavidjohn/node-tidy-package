# node-tidy-package

A tool to help you keep your package tidy in two ways:

1. **Search out dead weight**, analyzing your project source to determine if you
   have packages listed as dependencies that are not in use.

2. **Find out of date dependencies**, comparing your list of defined dependencies
   to their latest counterparts in npm.

It does not modify your project in any way, simply provides a package listing.

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
