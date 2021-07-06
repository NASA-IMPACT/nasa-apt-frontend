/**
 * Created a file and serves it to the user for download.
 *
 * @param {string} filename The name of the file
 * @param {string} text The file content
 */
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
