// Citation related helpers.
import { format } from 'date-fns';

// Symbol to define that the description should come from the strings file.
export const formStringSymbol = Symbol.for('form string');

export const citationFields = [
  {
    name: 'creators',
    label: 'Creators',
    description: formStringSymbol
  },
  {
    name: 'editors',
    label: 'Editors',
    description: formStringSymbol
  },
  {
    name: 'title',
    label: 'Title',
    description: formStringSymbol
  },
  {
    name: 'series_name',
    label: 'Series name',
    description: formStringSymbol
  },
  {
    name: 'release_date',
    label: 'Release date',
    description: formStringSymbol
  },
  {
    name: 'release_place',
    label: 'Release place',
    description: formStringSymbol
  },
  {
    name: 'publisher',
    label: 'Publisher',
    description: formStringSymbol
  },
  {
    name: 'version',
    label: 'Version',
    description: formStringSymbol
  },
  {
    name: 'issue',
    label: 'Issue',
    description: formStringSymbol
  },
  {
    name: 'additional_details',
    label: 'Additional details',
    description: formStringSymbol
  },
  {
    name: 'online_resource',
    label: 'Online resource',
    description: formStringSymbol
  }
];

/**
 * Creates a Bibtex reference from the given atbd citation.
 *
 * @param {string|number} id The id or alias of an atbd.
 * @param {string} version The atbd version
 * @param {object} citation The citation object
 * @returns string
 */
export function createBibtexCitation(id, version, citation) {
  const date = new Date(citation.release_date);
  const isValidDate = !isNaN(date.getTime());

  const year = isValidDate ? format(date, 'yyyy') : 'n/a';
  const month = isValidDate ? format(date, 'MMM') : 'n/a';

  const url = citation.online_resource?.startsWith?.('http')
    ? `\\url{${citation.online_resource}}`
    : 'n/a';

  const bibtexCitation = `@MANUAL {atbd--${id}--${version},
  title = "${citation.title || 'n/a'}",
  type = "Algorithm Theoretical Basis Document",
  author = "${citation.creators || 'n/a'}",
  editor = "${citation.editors || 'n/a'}",
  month = "${month}",
  year = "${year}",
  number = "${citation.issue || 'n/a'}",
  series = "${citation.series_name || 'n/a'}",
  volume = "${citation.version || 'n/a'}",    
  address = "${citation.release_place || 'n/a'}",
  publisher = "${citation.publisher || 'n/a'}",
  howpublished = "${url}",
  note = "${citation.additional_details || 'n/a'}"
}`;

  return bibtexCitation;
}
