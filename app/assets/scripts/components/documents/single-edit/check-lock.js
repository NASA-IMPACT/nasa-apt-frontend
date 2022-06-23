import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import { useHistory } from 'react-router';

import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { toast } from 'react-toastify';

import { axiosAPI } from '../../../utils/axios';
import { documentView } from '../../../utils/url-creator';
import {
  ConfirmationModalProse,
  ConfirmationModalFooter
} from '../../common/confirmation-prompt';

const setLock = (alias, version, userToken, actionConfig = {}) => {
  const methods = {
    lock: 'put',
    clearlock: 'delete'
  };

  const headers = userToken
    ? {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    : {};

  const requestActionConfig = {
    ...{
      action: 'lock',
      override: false
    },
    ...actionConfig
  };

  return axiosAPI({
    url: `/atbds/${alias}/versions/${version}/lock?override=${requestActionConfig.override}`,
    method: methods[requestActionConfig.action],
    ...headers
  });
};

function CheckLock({ id, version, user }) {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState();

  useEffect(() => {
    setLock(id, version, user.accessToken).catch((error) => {
      const { status, data } = error.response;
      if (status === 423) {
        const { preferred_username } = data.detail.lock_owner;
        setMessage(
          <ConfirmationModalProse>
            <p>
              <strong>{preferred_username}</strong> is currently editing this
              document. If you continue, you will overwrite any changes they
              have made.
            </p>
            <p>
              We suggest verifying with <strong>{preferred_username}</strong>{' '}
              before continuing.
            </p>
          </ConfirmationModalProse>
        );
        setShowModal(true);
      } else {
        history.push(documentView(id, version));
        toast.error('Unable to lock the ATBD version.');
      }
    });

    return () =>
      setLock(id, version, user.accessToken, { action: 'clearlock' }).catch(
        (error) => {
          if (error.response.status !== 423) {
            toast.error(
              'Unable to clear lock of ATBD version. Please try again.'
            );
          }
        }
      );
  }, [id, version, user.accessToken, history]);

  const cancel = () => {
    setShowModal(false);
    history.push(documentView(id, version));
  };

  const unlock = () => {
    setLock(id, version, user.accessToken, { action: 'lock', override: true })
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
      closeButton={false}
      title='Overwrite other changes?'
      content={message}
      renderFooter={() => (
        <ConfirmationModalFooter>
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
        </ConfirmationModalFooter>
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
