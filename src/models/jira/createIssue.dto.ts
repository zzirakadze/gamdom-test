export interface JiraIssueType {
  name: string;
}

export interface JiraProject {
  key: string;
}

export interface JiraTextContent {
  type: 'text';
  text: string;
}

export interface JiraParagraphContent {
  type: 'paragraph';
  content: JiraTextContent[];
}

export interface JiraDescription {
  type: 'doc';
  version: 1;
  content: JiraParagraphContent[];
}

export interface JiraCreateIssueFields {
  summary: string;
  issuetype: JiraIssueType;
  project: JiraProject;
  description?: JiraDescription;
}

export interface CreateIssueRequest {
  fields: JiraCreateIssueFields;
}
