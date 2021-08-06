import { useEffect } from 'react';
import { useFormikContext } from 'formik';

// Reset the formik state when the modal is hidden.
export function FormikResetReveal({ revealed }) {
  const { resetForm } = useFormikContext();
  useEffect(() => {
    if (!revealed) {
      resetForm();
    }
  }, [resetForm, revealed]);
  return null;
}
