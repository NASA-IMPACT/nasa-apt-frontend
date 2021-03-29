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
  [key: string]: any;
}
