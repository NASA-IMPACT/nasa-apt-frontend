export function countCharactersInSlateObject(value) {
  const keys = Object.keys(value);

  if (keys.includes('children')) {
    return value.children.reduce(
      (sum, child) => sum + countCharactersInSlateObject(child),
      0
    );
  }

  if (keys.includes('text')) {
    const trimmed = value.text.trim();
    return trimmed ? trimmed.length : 0;
  }

  return 0;
}

export function truncateSlateObject(value, maxChars, sumLength = 0) {
  const keys = Object.keys(value);

  if (sumLength >= maxChars) {
    return;
  }

  if (keys.includes('children')) {
    const truncatedChildren = [];

    for (let i = 0, len = value.children.length; i < len; i++) {
      const childCharacterCount = countCharactersInSlateObject({
        children: truncatedChildren.filter(Boolean)
      });

      const truncatedFragment = truncateSlateObject(
        value.children[i],
        maxChars,
        childCharacterCount + sumLength
      );

      truncatedChildren.push(truncatedFragment);
    }

    const children = truncatedChildren.filter(Boolean);

    if (children.length > 0) {
      return {
        ...value,
        children
      };
    }
  }

  if (keys.includes('text')) {
    const length = value.text.trim().length;
    if (length + sumLength > maxChars) {
      const truncateAt = maxChars - sumLength;
      const firstWord = value.text.slice(0, value.text.indexOf(' '));

      if (firstWord.length > truncateAt) {
        // We can't fit the first word of the node so we're not including it at all
        return;
      }

      const slicedText = value.text.slice(0, truncateAt);
      const truncatedText = slicedText.slice(0, slicedText.lastIndexOf(' '));

      return {
        ...value,
        text: `${truncatedText}...`
      };
    } else {
      return value;
    }
  }
}
