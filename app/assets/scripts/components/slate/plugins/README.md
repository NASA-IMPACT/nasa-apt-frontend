## Slate Editor plugins

> Built on top of Slate, slate-plugins enables you to use a list of configurable and extendable plugins to keep your codebase clean and easy to debug.
> -- From https://github.com/udecode/slate-plugins/tree/69cafb634d365fc5d16b209287356682bc6ecfd6

**Note**: Since both `slate` and `slate-plugins` are in a beta stage, the repo links and versions are fixed.

### Motivation

The `slate-plugins` provides several interesting plugins and the framework to build our own.
To simplify code organization, all the `slate-plugins` related code, including their configuration, is kept inside the `scripts/slate/plugins` folder.

There are some functions which are exported directly. This leads to some redundancy but simplifies having to deal with this framework.