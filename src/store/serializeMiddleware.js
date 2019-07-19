import {
  fetchAtbd,
  fetchEntireAtbdVersion,
  uploadJson,
  checkPdf,
  checkHtml
} from '../actions/actions';
import types from '../constants/action_types';

const retries = process.env.REACT_APP_PDF_RETRIES;
const serializeMiddleware = store => next => async (action) => {
  const { type, payload: versionObject } = action;
  let returnAction;
  if (type === types.SERIALIZE_DOCUMENT) {
    returnAction = next(action);
    const fetchAtbdVersionResp = await store.dispatch(fetchEntireAtbdVersion(versionObject));
    const fetchAtbdResp = await store.dispatch(fetchAtbd(versionObject.atbd_id));
    if (fetchAtbdVersionResp.type === types.FETCH_ATBD_VERSION_SUCCESS
        && fetchAtbdResp.type === types.FETCH_ATBD_SUCCESS) {
      const { payload: json } = fetchAtbdVersionResp;
      const { payload: { contacts } } = fetchAtbdResp;
      json.atbd.contacts = contacts;
      const uploadJsonResp = await store.dispatch(uploadJson(json));
      if (uploadJsonResp.type === types.UPLOAD_JSON_SUCCESS) {
        const { payload: { location } } = uploadJsonResp;
        let pdfTries = 0;
        const key = location.split('/').pop().split('.')[0];
        const pdfInterval = setInterval(async () => {
          const checkPdfResp = await store.dispatch(checkPdf(key));
          pdfTries += 1;
          if (checkPdfResp.type === types.SERIALIZE_PDF_SUCCESS) {
            clearInterval(pdfInterval);
          }
          if (pdfTries > retries) {
            clearInterval(pdfInterval);
            store.dispatch({
              type: types.SERIALIZE_PDF_FAIL
            });
          }
        }, 3000);
        let htmlTries = 0;
        const htmlInterval = setInterval(async () => {
          const checkHtmlResp = await store.dispatch(checkHtml(key));
          htmlTries += 1;
          if (checkHtmlResp.type === types.SERIALIZE_HTML_SUCCESS) {
            clearInterval(htmlInterval);
          }
          if (htmlTries > retries) {
            clearInterval(htmlInterval);
            store.dispatch({
              type: types.SERIALIZE_HTML_FAIL
            });
          }
        }, 3000);
      }
    }
  } else {
    returnAction = next(action);
  }
  return returnAction;
};
export default serializeMiddleware;
