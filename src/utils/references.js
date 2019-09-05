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
        const { data } = new Cite(reader.result, { style: 'bibtex' });
        resolve(data);
      } catch (error) {
        reject(new Error('Error parsing Bibtext file.'));
      }
    };
    reader.readAsText(inputFile);
  });
}

export function bibtexToRef(input) {
  // Property map from bibtex to ref
  const propertyMap = {
    address: {
      key: 'publication_place'
    },
    author: {
      key: 'authors',
      parse: data => data.map(author => `${author.given} ${author.family}`).join(', ')
    },
    doi: {
      id: 'doi'
    },
    edition: {
      key: 'edition'
    },
    isbn: {
      key: 'isbn'
    },
    issue: {
      key: 'issue'
    },
    pages: {
      key: 'pages'
    },
    publisher: {
      key: 'publisher'
    },
    notes: {
      key: 'other_reference_details'
    },
    online_resource: {
      key: 'online_resource'
    },
    report_number: {
      key: 'report_number'
    },
    series: {
      key: 'series'
    },
    title: {
      key: 'title'
    },
    volume: {
      key: 'volume'
    },
    year: {
      key: 'year',
      parse: parseInt
    }
  };

  // Parse input object, adding properties from the map using custom parser
  // if available.
  return Object.keys(propertyMap).reduce((acc, bibtexKey) => {
    const value = input[bibtexKey];
    if (value) {
      const { key, parse } = propertyMap[bibtexKey];
      acc[key] = parse ? parse(value) : value;
    }
    return acc;
  }, {});
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
