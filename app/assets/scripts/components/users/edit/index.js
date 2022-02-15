import React from 'react';
import { useParams } from 'react-router';
import { useFormikContext } from 'formik';
import { VerticalDivider } from '@devseed-ui/toolbar';

import App from '../../common/app';
import UhOh from '../../uhoh';
import { InpageHeaderSticky, InpageActions } from '../../../styles/inpage';
import Tip from '../../common/tooltip';
import UserActionsMenu from '../user-actions-menu';
import UserHeadline from '../user-headline';
import UserAccountSections from './user-account-sections';
import ButtonSecondary from '../../../styles/button-secondary';

import { useUser } from '../../../context/user';
import { getUserEditSection } from './sections';

export default function UserEdit() {
  const { user } = useUser();
  const { section } = useParams();

  const sectionDefinition = getUserEditSection(section);
  const { SectionComponent } = sectionDefinition;

  if (!SectionComponent) {
    return <UhOh />;
  }

  return (
    <App pageTitle='Profile'>
      <SectionComponent
        user={user}
        section={sectionDefinition}
        renderInpageHeader={() => (
          <InpageHeaderSticky data-element='inpage-header'>
            <UserHeadline name={user.name} mode='edit' />
            <InpageActions>
              <UserAccountSections section={section || 'general'} />
              <SaveButton />
              <VerticalDivider variation='light' />
              <UserActionsMenu variation='achromic-plain' />
            </InpageActions>
          </InpageHeaderSticky>
        )}
      />
    </App>
  );
}

// Moving the save button to a component of its own to use Formik context.
const SaveButton = () => {
  const {
    dirty,
    isSubmitting,
    submitForm,
    touched,
    isValid
  } = useFormikContext();

  // We only want to show an error message when the global validations have run.
  // Just checking if it is valid results in the message to be too obtrusive. A
  // simple way to check this is to use the id field. Formik touches all fields
  // when running global validations, an the id can't be reached in any other
  // way.
  const tipMessage =
    !isValid && touched.id
      ? 'There are errors in the form'
      : 'There are unsaved changes';

  return (
    <Tip position='top-end' title={tipMessage} open={dirty}>
      <ButtonSecondary
        title='Save current changes'
        disabled={isSubmitting || !dirty}
        onClick={submitForm}
        useIcon='tick--small'
      >
        Save
      </ButtonSecondary>
    </Tip>
  );
};
