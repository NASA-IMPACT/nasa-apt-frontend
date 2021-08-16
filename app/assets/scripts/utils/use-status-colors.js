import { useMemo } from 'react';
import { useTheme } from 'styled-components';

import {
  DRAFT,
  CLOSED_REVIEW_REQUESTED,
  CLOSED_REVIEW,
  OPEN_REVIEW,
  PUBLICATION_REQUESTED,
  PUBLICATION,
  PUBLISHED
} from '../components/documents/status';

export function useStatusColors() {
  const theme = useTheme();

  const statusMapping = useMemo(
    () => ({
      [DRAFT]: theme.color.statusDraft,
      [CLOSED_REVIEW_REQUESTED]: theme.color.statusDraft,
      [CLOSED_REVIEW]: theme.color.statusReview,
      [OPEN_REVIEW]: theme.color.statusReview,
      [PUBLICATION_REQUESTED]: theme.color.statusReview,
      [PUBLICATION]: theme.color.statusPublication,
      [PUBLISHED]: theme.color.statusPublished
    }),
    [theme]
  );

  return { statusMapping };
}
