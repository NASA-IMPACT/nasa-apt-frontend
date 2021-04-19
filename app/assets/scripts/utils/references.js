import { nodeFromSlateDocument } from '../components/slate/nodes-from-slate';
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
  //     fields: ['fieldName']
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
      } else {
        refUsageIndex[node.refId] = {
          docIndex: ++docIndex,
          refId: node.refId,
          fields: [fieldName]
        };
      }
    }
  }

  return refUsageIndex;
};
