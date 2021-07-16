import React from 'react';
import T from 'prop-types';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@devseed-ui/button';

import { Link } from '../../styles/clean/link';
import Tip from './tooltip';

export const DATE_FORMAT = 'MMM do, yyyy';
export const DATETIME_FORMAT = 'MMM do, yyyy HH:mm';

export default function Datetime(props) {
  const { date, format: dateFormat, useDistanceToNow } = props;

  if (isNaN(date?.getTime?.())) {
    return null;
  }

  return (
    <time dateTime={format(date, 'yyyy-MM-dd')}>
      {useDistanceToNow
        ? formatDistanceToNow(date, { addSuffix: true })
        : format(date, dateFormat || DATE_FORMAT)}
    </time>
  );
}

Datetime.propTypes = {
  date: T.object,
  format: T.string,
  useDistanceToNow: T.bool
};

export const DateButton = (props) => {
  const { date, prefix, size = 'small', ...rest } = props;

  return (
    <Tip title={format(date, DATETIME_FORMAT)}>
      <Button forwardedAs={Link} useIcon='clock' size={size} {...rest}>
        {prefix} <Datetime date={date} useDistanceToNow />
      </Button>
    </Tip>
  );
};

DateButton.propTypes = {
  date: T.object,
  prefix: T.node,
  size: T.string
};
