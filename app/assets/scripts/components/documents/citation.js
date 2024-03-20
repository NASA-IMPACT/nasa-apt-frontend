// Citation related helpers.
import React from 'react';
import { format } from 'date-fns';
import { FormHelperMessage } from '@devseed-ui/form';

import getDocumentIdKey from './get-document-id-key';
import { documentView } from '../../utils/url-creator';
import { formatAuthors } from '../../utils/references';

// Symbol to define that the description should come from the strings file.
export const formStringSymbol = Symbol.for('form string');

export const citationFields = [
  {
    name: 'creators',
    label: 'Authors',
    description: formStringSymbol,
    helper: (
      <FormHelperMessage>
        Separate values with <em>and</em> (e.g., John Doe <em>and</em> Jane
        Doe).
      </FormHelperMessage>
    )
  },
  {
    name: 'editors',
    label: 'Editors',
    description: formStringSymbol,
    helper: (
      <FormHelperMessage>
        Separate values with <em>and</em> (e.g., John Doe <em>and</em> Jane
        Doe).
      </FormHelperMessage>
    )
  },
  {
    name: 'publisher',
    label: 'Publisher',
    description: formStringSymbol
  },
  {
    name: 'release_date',
    label: 'Release date',
    description: formStringSymbol,
    helper: (
      <FormHelperMessage>
        Use YYYY-MM-DD format. If left empty, APT will use the date when the
        document is published.
      </FormHelperMessage>
    )
  },
  {
    name: 'version',
    label: 'Version',
    description: formStringSymbol,
    helper: function CitationVersionHelper(atbd) {
      return (
        <FormHelperMessage>
          If left empty, APT will use the internal version (currently{' '}
          {atbd.version}
          ).
        </FormHelperMessage>
      );
    }
  },
  {
    name: 'online_resource',
    label: 'Online resource',
    description: formStringSymbol,
    helper: (
      <FormHelperMessage>
        If left empty, APT will use the document landing page URL.
      </FormHelperMessage>
    )
  }
];

export function getCitationPublicationDate(atbd) {
  const { published_at, citation } = atbd;

  // Publication date.
  // Use provided if valid, otherwise use internal published_at.
  const date = new Date(citation.release_date);
  if (!isNaN(date.getTime())) {
    return {
      date,
      dateStr: format(date, 'yyyy-MM-dd'),
      year: format(date, 'yyyy'),
      month: format(date, 'MMM')
    };
  }

  if (published_at) {
    const pubDate = new Date(published_at);
    return {
      date: pubDate,
      dateStr: format(pubDate, 'yyyy-MM-dd'),
      year: format(pubDate, 'yyyy'),
      month: format(pubDate, 'MMM')
    };
  }

  return {
    date: null,
    dateStr: null,
    year: null,
    month: null
  };
}

function getCitationDocUrl(atbd) {
  const { citation } = atbd;

  if (citation.online_resource?.startsWith?.('http')) {
    return citation.online_resource;
  }

  return `${window.location.origin}${documentView(atbd)}`;
}

function getCitationDocVersion(atbd) {
  const { citation, version } = atbd;
  return citation.version || version;
}

/**
 * Creates a Bibtex reference from the given atbd citation.
 *
 * @param {object} atbd The document for which to create a citation
 * @returns string
 */
export function createBibtexCitation(atbd) {
  const { title, citation } = atbd;
  const { id, version } = getDocumentIdKey(atbd);
  const { month, year } = getCitationPublicationDate(atbd);
  const citationVersion = getCitationDocVersion(atbd);
  const url = getCitationDocUrl(atbd);

  const bibtexCitation = `@MANUAL {atbd--${id}--${version},
  title = "${title || 'n/a'}",
  type = "Algorithm Theoretical Basis Document",
  author = "${citation.creators || 'n/a'}",
  editor = "${citation.editors || 'n/a'}",
  month = "${month || 'n/a'}",
  year = "${year || 'n/a'}",
  volume = "${citationVersion}",    
  publisher = "${citation.publisher || 'n/a'}",
  howpublished = "\\url{${url}}"
}`;

  return bibtexCitation;
}

/**
 * Creates a citation from the given atbd.
 * Format is:
 * Authors. (Publication Date). Title, version. Publisher. (DOC URL or DOI).
 *
 * @param {object} atbd The document for which to create a citation
 * @returns string
 */
export function createStringCitation(atbd) {
  const { year } = getCitationPublicationDate(atbd);
  const authors = formatAuthors(atbd.citation.creators, 'citation');
  const title = atbd.title;
  const url = getCitationDocUrl(atbd);
  const publisher = atbd.citation.publisher;
  const returnStr = `${authors}. (${year}). ${title}, ${getCitationDocVersion(
    atbd
  )}. ${publisher}. (${url})`;
  return returnStr;
}
