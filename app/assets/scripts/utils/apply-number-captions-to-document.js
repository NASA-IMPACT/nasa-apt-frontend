import get from 'lodash.get';
import {
  IMAGE_BLOCK,
  TABLE_BLOCK
} from '../components/slate/plugins/constants';

/**
 * Include table numbers and move captions before the table in the document.
 */
export function applyNumberCaptionsToDocument(document) {
  // Section id list in the order they should appear in the document
  const documentSectionIds = [
    'key_points',
    'abstract',
    'plain_summary',
    'publication_references',
    'version_description',
    'introduction',
    'historical_perspective',
    'additional_information',
    'scientific_theory',
    'scientific_theory_assumptions',
    'mathematical_theory',
    'mathematical_theory_assumptions',
    'algorithm_input_variables',
    'algorithm_output_variables',
    'algorithm_usage_constraints',
    'performance_assessment_validation_errors',
    'performance_assessment_validation_methods',
    'performance_assessment_validation_uncertainties',
    'algorithm_implementations',
    'data_access_input_data',
    'data_access_output_data',
    'data_access_related_urls',
    'journal_discussion',
    'data_availability',
    'journal_acknowledgements'
  ];

  let elementCount = {
    [TABLE_BLOCK]: 0,
    [IMAGE_BLOCK]: 0
  };

  // Process sections to add table numbers to captions
  return documentSectionIds.reduce(
    (doc, sectionId) => {
      const section = doc[sectionId];

      // Ensure the section exists
      if (!section) return doc;

      // If the section has no children, return the section as is
      if (!section.children) {
        return {
          ...doc,
          [sectionId]: section
        };
      }

      const nextDoc = {
        ...doc,
        [sectionId]: {
          ...section,
          children: section.children.map((child) => {
            // Transform the table and image blocks
            if (child.type === TABLE_BLOCK || child.type === IMAGE_BLOCK) {
              elementCount[child.type] += 1;

              const captionPrefix = `${
                child.type === TABLE_BLOCK ? 'Table' : 'Figure'
              } ${elementCount[child.type]}: `;

              // Reverse the table rows to make caption appear first
              // and add the table number to the caption
              return {
                ...child,
                children: child.children.reverse().map((c) => {
                  if (c.type !== 'caption') {
                    return c;
                  }

                  const currentCaption = get(c, 'children[0].text');

                  return {
                    ...c,
                    children: [
                      {
                        ...c.children[0],
                        text: `${captionPrefix}${currentCaption}`
                      }
                    ]
                  };
                })
              };
            }

            return child;
          })
        }
      };

      return {
        ...nextDoc
      };
    },
    { ...document }
  );
}
