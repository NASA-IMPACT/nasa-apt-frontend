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
