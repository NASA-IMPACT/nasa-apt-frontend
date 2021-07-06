import React from 'react';
import T from 'prop-types';
import get from 'lodash.get';
import { useFormikContext } from 'formik';

import { RichContextProvider } from '../../slate';

// The RichTextContex2Formik bridges the gap between the rich context provider
// needed for the slate rich editor and formik.
// Check /components/slate/plugins/README.md for a primer on the rich context.

// The references case:
// Each rich text editor has the ability to modify and create references through
// the insertion modal. This requires that we modify a different field of the
// ATBD that is not the field associated with the rich text editor. This bridge
// component will update the references field of an ATBD with any change made to
// the references by the user.

export default function RichTextContex2Formik(props) {
  const { children } = props;
  const { values, setFieldValue } = useFormikContext();

  const referencesFieldName = 'document.publication_references';
  const refs = get(values, referencesFieldName);

  const onReferenceUpsert = (val) => {
    const { isNew, ...refData } = val;
    if (isNew) {
      setFieldValue(referencesFieldName, refs.concat(refData));
    } else {
      const replacedRef = refs.map((r) => (r.id === refData.id ? refData : r));
      setFieldValue(referencesFieldName, replacedRef);
    }
  };

  const ctx = {
    onReferenceUpsert,
    references: refs || [],
    atbd: {
      id: values.id
    }
  };

  return (
    <RichContextProvider context={ctx} contextDeps={[refs]}>
      {children}
    </RichContextProvider>
  );
}

RichTextContex2Formik.propTypes = {
  children: T.node
};
