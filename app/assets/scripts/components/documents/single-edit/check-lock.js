import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import { useHistory } from 'react-router';

import { Modal, ModalFooter } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { toast } from 'react-toastify';

import { axiosAPI } from '../../../utils/axios';
import { documentView } from '../../../utils/url-creator';

const setLock = (alias, version, userToken, action = 'lock') => {
  const headers = userToken
    ? {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    : {};

  return axiosAPI({
    url: `/atbds/${alias}/versions/${version}/${action}`,
    method: 'post',
    ...headers
  });
};

function CheckLock({ id, version, user }) {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLock(id, version, user.accessToken).catch((error) => {
      const { status, data } = error.response;
      if (status === 409) {
        setMessage(data.detail);
        setShowModal(true);
      } else {
        history.push(documentView(id, version));
        toast.error('Unable to lock the ATBD version.');
      }
    });

    return () =>
      setLock(id, version, user.accessToken, 'clearlock').catch(() => {
        toast.error('Unable to clear lock of ATBD version. Please try again.');
      });
  }, [id, version, user.accessToken, history]);

  const cancel = () => {
    setShowModal(false);
    history.push(documentView(id, version));
  };

  const unlock = () => {
    setLock(id, version, user.accessToken, 'unlock')
      .then(() => {
        setShowModal(false);
      })
      .catch(() => {
        setShowModal(false);
        history.push(documentView(id, version));
        toast.error('Unable to unlock the ATBD version.');
      });
  };

  return (
    <Modal
      id='modal'
      size='small'
      revealed={showModal}
      onCloseClick={cancel}
      title='Overwrite Other Changes?'
      content={
        <>
          <p>
            {message} If you continue, you will overwrite any changes they have
            made.
          </p>
          <p>We suggest verifying with them before continuing.</p>
        </>
      }
      renderFooter={() => (
        <ModalFooter>
          <Button
            type='button'
            variation='primary-raised-dark'
            useIcon='tick--small'
            onClick={unlock}
          >
            Continue &amp; Overwrite
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
