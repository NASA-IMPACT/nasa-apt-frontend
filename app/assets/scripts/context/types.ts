interface ATBD {
  id: Number;
  alias: String;
  created_by: String;
  created_at: Date;
  title: String;
  versions: [ATBDVersion];
}

interface ATBDVersion {
  status: 'Draft' | 'Published';
  published_by: String;
  published_at: Date;
  created_by: String;
  created_at: Date;
  major: Number;
  minor: Number;
  version: String;
  document: ATBDDocument;
  changelog: String;
  doi: String;
}

interface ATBDDocument {
  introduction: SlateDocument;
  historical_perspective: SlateDocument;
  mathematical_theory: SlateDocument;
  mathematical_theory_assumptions: SlateDocument;
  scientific_theory: SlateDocument;
  scientific_theory_assumptions: SlateDocument;
  algorithm_input_variables: [DocVariable];
  algorithm_output_variables: [DocVariable];
  algorithm_usage_constraints: SlateDocument;
  performance_assessment_validation_methods: SlateDocument;
  performance_assessment_validation_uncertainties: SlateDocument;
  performance_assessment_validation_errors: SlateDocument;
  algorithm_implementations: [DocUrlDesc];
  data_access_input_data: [DocUrlDesc];
  data_access_output_data: [DocUrlDesc];
  data_access_related_urls: [DocUrlDesc];
  journal_discussion: SlateDocument;
  journal_acknowledgements: SlateDocument;
  publication_references: [Reference];
}

interface DocVariable {
  name: SlateDocument;
  long_name: SlateDocument;
  unit: SlateDocument;
}

interface DocUrlDesc {
  url: String;
  description: SlateDocument;
}

interface Reference {
  id: String;
  authors: String;
  title: String;
  series: String;
  edition: String;
  volume: String;
  issue: String;
  publication_place: String;
  publisher: String;
  pages: String;
  isbn: String;
  year: String;
  doi: String;
  other_reference_details: String;
  report_number: String;
  online_resource: String;
}

interface SlateText {
  text: String;
  [key: string]: any;
}

interface SlateNode {
  type: String;
  [key: string]: any;
  children: [SlateNode | SlateText];
}

interface SlateDocument {
  children: [SlateNode];
}
