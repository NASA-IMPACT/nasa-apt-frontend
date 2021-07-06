# Elements clean of props

This folder contains element which were filtered for unwanted props.

This is used to circumvent a bug with styled-component where unwanted props are passed to the dom causing react to display an error:
 
```
  `Warning: React does not recognize the hideText prop on a DOM element.
  If you intentionally want it to appear in the DOM as a custom attribute,
  spell it as lowercase hideText instead. If you accidentally passed it from
  a parent component, remove it from the DOM element.`
```
 
This commonly happens when an element is impersonating another with the `as` or `forwardedAs` prop:
```
  <Button hideText forwardedAs={Link}>Home</Button>
```

Because of a bug, all the props passed to `Button` are passed to `Link` without being filtered before rendering, causing the aforementioned error.
Issue tracking the bug: https://github.com/styled-components/styled-components/issues/2131