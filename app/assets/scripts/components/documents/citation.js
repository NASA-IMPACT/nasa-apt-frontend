// Citation related helpers.

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
