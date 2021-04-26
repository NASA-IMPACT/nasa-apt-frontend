import { useEffect, useRef, useState } from 'react';
import T from 'prop-types';
import Clipboard from 'clipboard';

export function CopyField(props) {
  const { value, children } = props;

  const [showCopiedMsg, setShowCopiedMsg] = useState(false);
  const triggerElement = useRef(null);

  useEffect(() => {
    let copiedMsgTimeout = null;
    const clipboard = new Clipboard(triggerElement.current, {
      text: () => value
    });

    clipboard.on('success', () => {
      setShowCopiedMsg(true);
      copiedMsgTimeout = setTimeout(() => {
        setShowCopiedMsg(false);
      }, 2000);
    });

    return () => {
      clipboard.destroy();
      if (copiedMsgTimeout) clearTimeout(copiedMsgTimeout);
    };
  }, [value]);

  const val = showCopiedMsg ? 'Copied!' : value;

  return children({ value: val, ref: triggerElement });
}

CopyField.propTypes = {
  children: T.func,
  value: T.string
};
