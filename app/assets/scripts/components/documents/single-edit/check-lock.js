import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import { useHistory } from 'react-router';

import { Modal, ModalFooter } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';

import { axiosAPI } from '../../../utils/axios';
import { documentView } from '../../../utils/url-creator';

const checkLock = (alias, version, userToken) => {
  const headers = userToken
    ? {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    : {};

  return axiosAPI({
    url: `/atbds/${alias}/versions/${version}/lock`,
    method: 'post',
    ...headers
  });
};

function CheckLock({ id, version, user }) {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkLock(id, version, user.accessToken).catch((error) => {
      setMessage(error.response.data.detail);
      setShowModal(true);
    });
  }, [id, version, user.accessToken]);

  const cancel = () => {
    setShowModal(false);
    history.push(documentView(id, version));
  };

  return (
    <Modal
      id='modal'
      size='small'
      revealed={showModal}
      onCloseClick={cancel}
      title='ATDB is locked'
      content={
        <>
          <p>
            {message} You can unlock this ATBD version and start editing but the
            current editing user will loose their changes.
          </p>
          <p>Do you want to unlock the ATDB version?</p>
        </>
      }
      renderFooter={() => (
        <ModalFooter>
          <Button
            type='button'
            variation='primary-raised-dark'
            useIcon='tick--small'
            onClick={() => {}}
          >
            Unlock
          </Button>
          <Button
            type='button'
            variation='base-raised-light'
            useIcon='xmark--small'
            onClick={cancel}
          >
            Cancel
          </Button>
        </ModalFooter>
      )}
    />
  );
}

CheckLock.propTypes = {
  id: T.string.isRequired,
  version: T.string.isRequired,
  user: T.shape({
    accessToken: T.string.isRequired
  })
};

export default CheckLock;
