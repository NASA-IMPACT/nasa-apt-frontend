/* eslint-disable import/prefer-default-export */
import React from 'react';

export function isDescendant(child, parent) {
  let el = child;
  do {
    if (el && el === parent) {
      return true;
    }
    el = el.parentNode;
  } while (el && el.tagName !== 'BODY' && el.tagName !== 'HTML');

  return false;
}

export function getCurrentSelectionRange() {
  const selection = window.getSelection();
  return selection && selection.rangeCount
    ? selection.getRangeAt(0).cloneRange()
    : null;
}

export function renderMark(props, editor, next) {
  const {
    mark: { type },
    children
  } = props;
  switch (type) {
    case 'bold': {
      return <strong {...props}>{children}</strong>;
    }
    case 'italic': {
      return <em {...props}>{children}</em>;
    }
    case 'underline': {
      return <u {...props}>{children}</u>;
    }
    case 'superscript': {
      return <sup {...props}>{children}</sup>;
    }
    case 'subscript': {
      return <sub {...props}>{children}</sub>;
    }
    default: {
      return next();
    }
  }
}
