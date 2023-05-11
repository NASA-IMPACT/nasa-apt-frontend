import React, { useEffect, useState, useCallback } from 'react';
import T from 'prop-types';
import { useHistory } from 'react-router';

import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import { errorToast } from '../../common/toasts';

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
  const lockRef = React.useRef(undefined);
  const clearLockPendingRef = React.useRef({});

  const clearLock = useCallback(() => {
    // Check if lock exists and no pending request for clearing the lock
    if (
      lockRef.current &&
      clearLockPendingRef.current[lockRef.current.docId] !==
        lockRef.current.docVersion
    ) {
      const { docId, docVersion, userToken } = lockRef.current;
      // Keep track of requests for clearing the lock
      clearLockPendingRef.current[docId] = docVersion;
      setLock(docId, docVersion, userToken, { action: 'clearlock' })
        .then(() => {
          // clear the pending status of request
          delete clearLockPendingRef.current[docId];
          lockRef.current = undefined;
        })
        .catch((error) => {
          // clear the pending status of request
          delete clearLockPendingRef.current[docId];

          if (error.response.status !== 423) {
            errorToast(
              'Unable to clear lock of ATBD version. Please try again.'
            );
          } else {
            // Log any other type of error
            // eslint-disable-next-line no-console
            console.error(error);
          }
        });
    }
  }, []);

  const acquireLock = useCallback(
    (docId, docVersion, userToken) => {
      if (!docId || !docVersion || !userToken) {
        return;
      }

      setLock(docId, docVersion, userToken)
        .then(() => {
          lockRef.current = {
            docId,
            docVersion,
            userToken
          };
        })
        .catch((error) => {
          const { status, data } = error.response;
          lockRef.current = undefined;
          if (status === 423) {
            const { preferred_username } = data.detail.lock_owner;
            setMessage(
              <ConfirmationModalProse>
                <p>
                  <strong>{preferred_username}</strong> is currently editing
                  this document. If you continue, you will overwrite any changes
                  they have made.
                </p>
                <p>
                  We suggest verifying with{' '}
                  <strong>{preferred_username}</strong> before continuing.
                </p>
              </ConfirmationModalProse>
            );
            setShowModal(true);
          } else {
            history.push(documentView(docId, docVersion));
            errorToast('Unable to lock the ATBD version.');
          }
        });
    },
    [history]
  );

  useEffect(() => {
    acquireLock(id, version, user.accessToken);

    return () => {
      clearLock();
    };
  }, [id, version, user.accessToken, acquireLock, clearLock]);

  // Clear lock during unmount (In-case it was missed somehow)
  useEffect(() => {
    return clearLock;
  }, [clearLock]);

  const handleLockOverrideCancel = useCallback(() => {
    setShowModal(false);
    history.push(documentView(id, version));
  }, [version, id, history]);

  const handleLockOverride = useCallback(() => {
    setLock(id, version, user.accessToken, { action: 'lock', override: true })
      .then(() => {
        setShowModal(false);
      })
      .catch(() => {
        setShowModal(false);
        history.push(documentView(id, version));
        errorToast('Unable to unlock the ATBD version.');
      });
  }, [id, version, history, user.accessToken]);

  return (
    <Modal
      id='modal'
      size='small'
      revealed={showModal}
      onCloseClick={handleLockOverrideCancel}
      closeButton={false}
      title='Overwrite other changes?'
      content={message}
      renderFooter={() => (
        <ConfirmationModalFooter>
          <Button
            type='button'
            variation='primary-raised-dark'
            useIcon='tick--small'
            onClick={handleLockOverride}
          >
            Continue &amp; Overwrite
          </Button>
          <Button
            type='button'
            variation='base-raised-light'
            useIcon='xmark--small'
            onClick={handleLockOverrideCancel}
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
