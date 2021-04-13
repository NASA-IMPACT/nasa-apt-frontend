# 3. Scroll on Document View

- Status: accepted
- Deciders: @danielfdsilva
- Date: 2021-04-08

## Context and Problem Statement

The Document View page must have a system of anchors to navigate the ATBD contents. The links on the outline must allow the user to jump to the correct section on the document and the they must become active once a given section is reached.

## Decision Drivers

The chosen option must have the following features:

- Smooth scrolling to an anchor on the document taking header size (offset) into account
- The location hash must reflect the active section
- The links to the anchors must become active one the anchor is reached

## Considered Options

- React Scroll (https://www.npmjs.com/package/react-scroll)
- React Scrollable Anchor (https://www.npmjs.com/package/react-scrollable-anchor)
- Native js + custom code (http://iamdustan.com/smoothscroll/)

## Decision Outcome

The chosen option was to write custom code and leverage the power of the browser's own scroll API, complemented with a polyfill for browsers that don't support smooth scrolling natively.
There was some research for options and a demo implementation was done with React Scroll. This module turned out not to work for our use case and only partially fulfilling the needed requirements.
Working around the package would be too time consuming.
There was also no time to do a more extensive research and experimentation with other modules.
The quickest and cleanest was to precisely have the needed features was to write our own custom code.

Since this behavior is only needed in this specific page with a specific purpose, the code is clean and pretty minimal.

### Positive Consequences

- Specific to the use case
- Highly customizable
- Easily debuggable

### Negative Consequences

- Untested code (meaning no unit tests)
- More code to write/maintain

## Pros and Cons of the Options

### React Scroll

- 💚 General package with a lot of weekly downloads
- 💚 Useful components out of the box
- 🚩 Complicated to use with unclear documentation
- 🚩 Quite some unneeded features
- 🚩 To difficult to work around quirky features

### React Scrollable Anchor

- 🚩 Outdated and seems a bit unmaintained
- 🚩 Very simple, lacking a lot of needed features

### Native js + custom code

- 💚 Simple api and native browser support (for the most part)
- 💚 No superfluous code
- 🚩 Very specific for this situation
- 🚩 Quite some code to write/maintain.
