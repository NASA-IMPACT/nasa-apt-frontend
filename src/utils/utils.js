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
 *
 * @param {object} atbd The atbd for which to get the URL.
 * @param {object} options Options for the url generation.
 * @param {bool} options.journal Whether the url is for a journal PDF or not.
 *
 * @returns {string}
 */
export function getDownloadPDFURL(atbd, options = {}) {
  const { atbd_id: id, alias } = atbd;
  // Urls:
  // normal: atbds/<alias/alias | id/id>.pdf
  // journal: atbds/journal/<alias/alias | id/id>.pdf
  let url = `${pdfServiceEndpoint}/atbds`;

  if (options.journal) url += '/journal';
  return url += alias
    ? `/alias/${alias}.pdf`
    : `/id/${id}.pdf`;
}
