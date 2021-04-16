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

interface Contact {
  id: Number;
  first_name: String;
  middle_name: String;
  last_name: String;
  uuid: String;
  url: String;
  mechanisms: ("Direct line" | "Email" | "Facebook" | "Fax" | "Mobile" | "Primary" | "TDD/TTY phone" | "Telephone" | "Twitter" | "U.S." | "Other")[];
  roles: ("Data center contact" | "Technical contact" | "Science contact" | "Investigator"| "Metadata author" | "User services"| "Science software development")[];
  title: String;
}
