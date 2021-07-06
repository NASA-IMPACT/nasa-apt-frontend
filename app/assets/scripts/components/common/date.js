import React from 'react';
import T from 'prop-types';
import { format, formatDistanceToNow } from 'date-fns';

export default function Datetime(props) {
  const { date, format: dateFormat, useDistanceToNow } = props;

  if (isNaN(date?.getTime?.())) {
    return null;
  }

  return (
    <time dateTime={format(date, 'yyyy-MM-dd')}>
      {useDistanceToNow
        ? formatDistanceToNow(date, { addSuffix: true })
        : format(date, dateFormat || 'MMM do, yyyy')}
    </time>
  );
}

Datetime.propTypes = {
  date: T.object,
  format: T.string,
  useDistanceToNow: T.bool
};
