import {
  fetchAtbdVersion,
  uploadJson,
  checkPdf
} from '../actions/actions';
import types from '../constants/action_types';

const serializeMiddleware = store => next => async (action) => {
  const { type, payload: versionObject } = action;
  let returnAction;
  if (type === types.SERIALIZE_DOCUMENT) {
    const fetchAtbdVersionResp = await store.dispatch(fetchAtbdVersion(versionObject));
    if (fetchAtbdVersionResp.type === types.FETCH_ATBD_VERSION_SUCCESS) {
      const { payload: json } = fetchAtbdVersionResp;
      const uploadJsonResp = await store.dispatch(uploadJson(json));
      if (uploadJsonResp.type === types.UPLOAD_JSON_SUCCESS) {
        const maxTries = 10;
        let tries = 0;
        const interval = setInterval(async () => {
          const checkPdfResp = await store.dispatch(checkPdf('somekey'));
          tries += 1;
          console.log(checkPdfResp);
          if (checkPdfResp === types.CHECK_PDF_SUCCESS) {
            clearInterval(interval);
          }
          if (tries > maxTries) {
            clearInterval(interval);
          }
        }, 2000);
      } else {
        returnAction = uploadJsonResp;
      }
    } else {
      returnAction = fetchAtbdVersionResp;
    }
  } else {
    returnAction = next(action);
  }
  return returnAction;
};
export default serializeMiddleware;
