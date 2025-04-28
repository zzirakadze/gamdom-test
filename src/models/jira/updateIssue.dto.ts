import { JiraCreateIssueFields } from './createIssue.dto';

export interface UpdateIssueRequest {
  fields: Partial<JiraCreateIssueFields>;
}
