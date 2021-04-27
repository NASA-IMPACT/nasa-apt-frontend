// Citation related helpers.
import React from 'react';
import { FormHelperMessage } from '@devseed-ui/form';

// Symbol to define that the description should come from the strings file.
export const formStringSymbol = Symbol.for('form string');

export const citationFields = [
  {
    name: 'creators',
    label: 'Creators',
    description: formStringSymbol,
    helper: (
      <FormHelperMessage>
        Separate values with <em>and</em>.
      </FormHelperMessage>
    )
  },
  {
    name: 'editors',
    label: 'Editors',
    description: formStringSymbol,
    helper: (
      <FormHelperMessage>
        Separate values with <em>and</em>.
      </FormHelperMessage>
    )
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
    description: formStringSymbol,
    helper: <FormHelperMessage>Use YYYY-MM-DD format.</FormHelperMessage>
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
