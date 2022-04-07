import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { Button as BaseButton } from '@devseed-ui/button';

const Button = styled(BaseButton)`
  margin-top: 0.5rem;
  margin-right: 0.5rem;
`;

export default function RecoverToast(props) {
  const { recoverData, clearData, closeToast, dataIsOutdated } = props;
  const handleRecover = () => {
    recoverData();
    closeToast();
  };

  const handleClear = () => {
    clearData();
    closeToast();
  };

  return (
    <>
      <p>
        We have recovered data that you had inserted. Do you want to restore the
        data?
      </p>
      {dataIsOutdated && (
        <p>
          Restoring the data will overwrite a more recent update to the ATBD.
        </p>
      )}
      <Button
        variation='primary-raised-light'
        size='small'
        type='button'
        onClick={handleRecover}
      >
        Recover
      </Button>
      <Button
        variation='primary-raised-light'
        size='small'
        type='button'
        onClick={handleClear}
      >
        Discard
      </Button>
    </>
  );
}

RecoverToast.propTypes = {
  recoverData: T.func.isRequired,
  clearData: T.func.isRequired,
  closeToast: T.func.isRequired,
  dataIsOutdated: T.bool
};
