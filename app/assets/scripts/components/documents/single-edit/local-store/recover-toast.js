import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';

import { glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';

const ToastWrapper = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${glsp()};
`;
const ToastControls = styled.div`
  display: flex;
  flex-flow: row;
  gap: ${glsp()};
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
    <ToastWrapper>
      <p>
        We have recovered data that you had inserted. Do you want to restore the
        data?
      </p>
      {dataIsOutdated && (
        <strong>
          Restoring the data will overwrite a more recent update to the ATBD.
        </strong>
      )}
      <ToastControls>
        <Button
          variation='primary-raised-light'
          useIcon='tick--small'
          type='button'
          onClick={handleRecover}
        >
          Recover
        </Button>
        <Button
          variation='achromic-glass'
          useIcon='trash-bin'
          type='button'
          onClick={handleClear}
        >
          Discard
        </Button>
      </ToastControls>
    </ToastWrapper>
  );
}

RecoverToast.propTypes = {
  recoverData: T.func.isRequired,
  clearData: T.func.isRequired,
  closeToast: T.func.isRequired,
  dataIsOutdated: T.bool
};
