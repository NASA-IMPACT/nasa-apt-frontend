import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import { FormHelperMessage } from '@devseed-ui/form';

import { formString } from '../../../../utils/strings';
import { FormikInputText } from '../../../common/forms/input-text';

const ReferenceFieldsStructure = styled.div`
  display: grid;
  grid-gap: ${glsp()};
  grid-template-columns: repeat(3, 1fr);
  align-items: flex-start;
`;

const ReferenceTitle = styled(FormikInputText)`
  grid-column: 1 / span 3;
`;

const fields = [
  {
    id: 'authors',
    label: 'Authors',
    helper: (
      <FormHelperMessage>
        Separate last name and first names with a comma, and authors with{' '}
        <em>and</em> (e.g., Doe, John <em>and</em> Doe, Jane).
      </FormHelperMessage>
    )
  },
  {
    id: 'series',
    label: 'Series'
  },
  {
    id: 'edition',
    label: 'Edition'
  },
  {
    id: 'volume',
    label: 'Volume'
  },
  {
    id: 'issue',
    label: 'Issue'
  },
  {
    id: 'report_number',
    label: 'Report Number'
  },
  {
    id: 'publication_place',
    label: 'Publication Place'
  },
  {
    id: 'year',
    label: 'Year'
  },
  {
    id: 'publisher',
    label: 'Publisher'
  },
  {
    id: 'pages',
    label: 'Pages'
  },
  {
    id: 'isbn',
    label: 'ISBN'
  },
  {
    id: 'doi',
    label: 'DOI'
  },
  {
    id: 'online_resource',
    label: 'Online Resource'
  },
  {
    id: 'other_reference_details',
    label: 'Other Reference Details'
  }
];

export default function ReferenceFormFields(props) {
  const { id: bId, name: bName } = props;

  const baseId = bId ? `${bId}-` : '';
  const baseName = bName ? `${bName}.` : '';

  return (
    <ReferenceFieldsStructure>
      <ReferenceTitle
        id={`${baseId}title`}
        name={`${baseName}title`}
        label='Title'
        description={formString('reference.title')}
      />
      {fields.map(({ id, label, helper }) => (
        <FormikInputText
          key={id}
          id={`${baseId}${id}`}
          name={`${baseName}${id}`}
          label={label}
          description={formString(`reference.${id}`)}
          helper={helper}
        />
      ))}
    </ReferenceFieldsStructure>
  );
}

ReferenceFormFields.propTypes = {
  id: T.string,
  name: T.string
};
