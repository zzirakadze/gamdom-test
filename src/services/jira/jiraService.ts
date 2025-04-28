import { ApiClient } from '../../utils/apiClient';
import { CreateIssueRequest, JiraDescription } from '../../models/jira/createIssue.dto';
import { UpdateIssueRequest } from '../../models/jira/updateIssue.dto';
import { CreatedIssueResponse } from '../../models/jira/issueResponse.dto';

export class JiraService {
  private apiClient: ApiClient;

  constructor(baseUrl: string, authToken: string) {
    this.apiClient = new ApiClient(baseUrl, authToken);
  }


  async createIssue(projectKey: string, summary: string, issueType: string, descriptionText?: string): Promise<CreatedIssueResponse> {
    const description: JiraDescription | undefined = descriptionText
      ? {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: descriptionText },
              ],
            },
          ],
        }
      : undefined;

    const body: CreateIssueRequest = {
      fields: {
        project: { key: projectKey },
        summary,
        issuetype: { name: issueType },
        description,
      },
    };

    const response = await this.apiClient.post<CreatedIssueResponse>('/rest/api/3/issue', body);
    return response.data;
  }

  async getIssue(issueIdOrKey: string): Promise<any> {
    const response = await this.apiClient.get(`/rest/api/3/issue/${issueIdOrKey}`);
    return response.data;
  }

  async updateIssue(issueIdOrKey: string, fields: Partial<CreateIssueRequest['fields']>): Promise<boolean> {
    const body: UpdateIssueRequest = { fields };
    const response = await this.apiClient.put(`/rest/api/3/issue/${issueIdOrKey}`, body);
    return response.status === 204;
  }

  async deleteIssue(issueIdOrKey: string): Promise<boolean> {
    const response = await this.apiClient.delete(`/rest/api/3/issue/${issueIdOrKey}`);
    return response.status === 204;
  }
}
