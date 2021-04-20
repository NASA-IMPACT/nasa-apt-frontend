import Cite from 'citation-js';

import { nodeFromSlateDocument } from '../components/slate';
import { REFERENCE } from '../components/slate/plugins/reference';

// interface Reference {
//   id: String;
//   authors: String;
//   title: String;
//   series: String;
//   edition: String;
//   volume: String;
//   issue: String;
//   publication_place: String;
//   publisher: String;
//   pages: String;
//   isbn: String;
//   year: String;
//   doi: String;
//   other_reference_details: String;
//   report_number: String;
//   online_resource: String;
// }

/**
 * Format a reference is AGU style.
 * Author, A.A., Author, B.B., & Author, C.C. (year). Title of article. Title of periodical, xx(x), pp-pp. https://doi.org/xx.xxxx/xxxxxxx
 * {authors}. ({year}). {title}. {series}, {volume}({issue}), {pages}, {doi}
 *
 * @param {Reference} reference The reference object
 * @return String
 */
export const formatReference = (reference) => {
  const { authors, year, title, series, volume, issue, pages, doi } = reference;

  // Output:
  // Author, A.A., Author, B.B., & Author, C.C. (year). Title of article. Title of periodical, xx(x), pp-pp. https://doi.org/xx.xxxx/xxxxxxx
  // {authors}. ({year}). {title}. {series}, {volume}({issue}), {pages}, {doi}

  // Authors
  const authorsList = authors?.split(' and ');
  let authorsStr;
  if (authorsList.length > 1) {
    const last = authorsList[authorsList.length - 1];
    authorsStr = `${authorsList.slice(0, -1).join(', ')}, & ${last}`;
  } else {
    authorsStr = authorsList[0];
  }

  // Year
  const yearStr = year ? `(${year}).` : '';

  // Title
  const titleStr = title ? `${title}.` : '';

  // Title
  const seriesStr = series ? `${series},` : '';

  // Volume(Issue)
  const issueStr = issue ? `(${issue})` : '';
  const volIssue = `${volume || ''}${issueStr}`;
  const volIssueStr = volIssue ? `${volIssue},` : '';

  // Pages
  const pagesStr = pages ? `${pages}.` : '';

  // Doi
  const doiStr = doi
    ? doi.match(/^https?:\/\//)
      ? doi
      : `https://doi.org/${doi}`
    : '';

  return [
    authorsStr,
    yearStr,
    titleStr,
    seriesStr,
    volIssueStr,
    pagesStr,
    doiStr
  ]
    .filter(Boolean)
    .join(' ');
};

/**
 * Traverse the atbd document and search for references. From those references
 * create a usage index where the use count is stored. The first reference to
 * appear will get [1] regardless of the field.
 *
 * For this to work it is paramount that the fields array's order is the same as
 * it gets printed in the document view page.
 *
 * @param {object} document Atbd document.
 * @returns {
 *  [refId]: {
 *    docIndex: Int
 *    refId: String
 *    fields: [String]
 *  }
 * }
 */
export const createDocumentReferenceIndex = (document) => {
  // Fields that can have references.
  const fields = [
    'introduction',
    'historical_perspective',
    'scientific_theory',
    'scientific_theory_assumptions',
    'mathematical_theory',
    'mathematical_theory_assumptions',
    'algorithm_usage_constraints',
    'performance_assessment_validation_methods',
    'performance_assessment_validation_uncertainties',
    'performance_assessment_validation_errors',
    'journal_discussion',
    'journal_acknowledgements'
  ];

  // Index structure:
  // {
  //   refId: {
  //     docIndex: 1,
  //     refId: 1,
  //     fields: ['fieldName'],
  //     count: X
  //   }
  // }
  const refUsageIndex = {};
  let docIndex = 0;

  const addUnique = (arr, value) => {
    if (!arr.includes(value)) {
      return arr.concat(value);
    }
    return arr;
  };

  // For loops, not pretty, but fast.
  for (const fieldName of fields) {
    const fieldData = document?.[fieldName] || {};
    const referenceNodes = nodeFromSlateDocument(fieldData, REFERENCE);

    for (const node of referenceNodes) {
      const refItem = refUsageIndex[node.refId];
      if (refItem) {
        refItem.fields = addUnique(refItem.fields, fieldName);
        refItem.count++;
      } else {
        refUsageIndex[node.refId] = {
          docIndex: ++docIndex,
          refId: node.refId,
          fields: [fieldName],
          count: 1
        };
      }
    }
  }

  return refUsageIndex;
};

/**
 * Reads the given file parsing the Bibtex.
 * Rejects the promise if the file is not valid.
 *
 * @param {File} inputFile File to read, from <input type="file">
 * @returns Promise<Object>
 */
export function parseBibtexFile(inputFile) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new Error('Error reading file.'));
    };

    reader.onload = () => {
      try {
        // Read from Bibtex format.
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

/**
 * Converts a Bibtext JSON reference to an APT reference.
 *
 * @param {Array} bibtexItems Bibtext JSON from parseBibtexFile()
 *
 * @see parseBibtexFile()
 * @returns Array<Reference>
 */
export function bibtexItemsToRefs(bibtexItems) {
  const parsedItems = bibtexItems.map((item) => {
    const { properties, type } = item;

    const propsToMap = [
      // from -> to
      ['address', 'publication_place'],
      ['author', 'authors'],
      ['doi', 'doi'],
      ['edition', 'edition'],
      ['isbn', 'isbn'],
      ['note', 'other_reference_details'],
      // Journal and series get mapped to the same APT property. If both exist
      // "series" prevails.
      ['journal', 'series'],
      ['series', 'series'],

      ['report_number', 'report_number'],
      ['pages', 'pages'],
      ['publisher', 'publisher'],
      ['title', 'title'],
      ['url', 'online_resource'],
      ['volume', 'volume'],
      ['year', 'year']
    ];

    const ref = {};

    // Map props that are straightforward.
    propsToMap.forEach(([from, to]) => {
      if (typeof properties[from] !== 'undefined') {
        ref[to] = properties[from];
      }
    });

    // Conditional prop mapping.
    if (typeof properties.number !== 'undefined') {
      if (type === 'techreport') {
        ref.report_number = properties.number;
      } else {
        ref.issue = properties.number;
      }
    }
    return ref;
  });

  return {
    valid: parsedItems,
    total: bibtexItems.length
  };
}
