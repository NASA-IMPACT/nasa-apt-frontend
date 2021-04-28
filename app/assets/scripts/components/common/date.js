import React from 'react';
import T from 'prop-types';
import { format } from 'date-fns';

export default function Datetime(props) {
  const { date } = props;

  if (isNaN(date?.getTime?.())) {
    return null;
  }

  return (
    <time dateTime={format(date, 'yyyy-MM-dd')}>
      {format(date, 'MMM do, yyyy')}
    </time>
  );
}

Datetime.propTypes = {
  date: T.object
};
