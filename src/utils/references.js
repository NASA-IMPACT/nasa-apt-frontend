import Cite from 'citation-js';
import * as Yup from 'yup';

export function validator() {
  return Yup.object().shape({
    title: Yup.string().required('Title is required'),
    year: Yup.number()
      .integer('Must be a valid year')
      .typeError('Must be a valid year')
  });
}

export function parseBibtexFile(inputFile) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new Error('Error reading file.'));
    };

    reader.onload = () => {
      try {
        // Read from Bibtex format
        const input = new Cite(reader.result, { style: 'bibtex' });

        // Output as Bibtext JSON (default is CSL)
        const items = input.get({
          format: 'real',
          type: 'json',
          style: 'bibtex'
        });

        // Return properties
        resolve(items);
      } catch (error) {
        reject(new Error('Error parsing Bibtex file.'));
      }
    };
    reader.readAsText(inputFile);
  });
}

export function bibtexToRef(input) {
  const {
    properties: {
      address,
      author,
      doi,
      edition,
      isbn,
      note,
      number,
      pages,
      publisher,
      report_number,
      series,
      title,
      url,
      volume,
      year
    },
    type
  } = input;
  const ref = {};

  if (typeof address !== 'undefined') ref.publication_place = address;
  if (typeof author !== 'undefined') ref.authors = author;
  if (typeof doi !== 'undefined') ref.doi = doi;
  if (typeof edition !== 'undefined') ref.edition = edition;
  if (typeof isbn !== 'undefined') ref.isbn = isbn;
  if (typeof note !== 'undefined') ref.other_reference_details = note;
  if (typeof number !== 'undefined') {
    if (type === 'techreport') {
      ref.report_number = number;
    } else {
      ref.issue = number;
    }
  }
  if (typeof pages !== 'undefined') ref.pages = pages;
  if (typeof publisher !== 'undefined') ref.publisher = publisher;
  if (typeof report_number !== 'undefined') ref.report_number = report_number;
  if (typeof series !== 'undefined') ref.series = series;
  if (typeof title !== 'undefined') ref.title = title;
  if (typeof url !== 'undefined') ref.online_resource = url;
  if (typeof volume !== 'undefined') ref.volume = volume;
  if (typeof year !== 'undefined') ref.year = year;

  return ref;
}

export async function bibtexItemsToRefs(bibtexItems) {
  const refValidator = validator();
  const results = {
    valid: [],
    total: bibtexItems.length,
    references: []
  };

  // Validate each item using Yup schema
  const validRefs = await Promise.all(
    bibtexItems.map(async (bibtexItem) => {
      const ref = bibtexToRef(bibtexItem);
      const isValid = await refValidator.isValid(ref);
      return isValid ? ref : null;
    })
  );

  // Add valid refs to the results
  results.valid = validRefs.filter(Boolean);

  return results;
}
