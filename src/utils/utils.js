/* eslint-disable-next-line import/prefer-default-export */
export function downloadTextFile(filename, text) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const pdfServiceEndpoint = process.env.REACT_APP_PDF_SERVICE_ENDPOINT;

/**
 * Generate PDF url using either the atbd id or the alias.
 * @param atbd
 * @returns {string}
 */
export function getDownloadPDFURL(atbd) {
  const { atbd_id: id, alias } = atbd;
  return alias
    ? `${pdfServiceEndpoint}/atbds/alias/${alias}.pdf`
    : `${pdfServiceEndpoint}/atbds/id/${id}.pdf`;
}
