import { Given, When, Then, BeforeAll } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { JiraService } from '../../../services/jira/jiraService';
import { JIRA_BASE_URL, JIRA_AUTH_TOKEN, JIRA_PROJECT_KEY } from '../../../config/env';

const jiraService = new JiraService(JIRA_BASE_URL, JIRA_AUTH_TOKEN);

let createdIssueKey: string;
let lastErrorResponse: any;

BeforeAll(() => {
  if (!JIRA_AUTH_TOKEN) {
    throw new Error('Missing JIRA_AUTH_TOKEN in environment variables.');
  }
});

Given('Jira service is available', async () => {
});

When('I create a Jira issue with:', async (dataTable) => {
  const data = dataTable.rowsHash();
  try {
    const response = await jiraService.createIssue(
      JIRA_PROJECT_KEY,
      data.summary,
      data.issueType,
      data.description,
    );
    createdIssueKey = response.key;
    lastErrorResponse = undefined;
  } catch (error: any) {
    lastErrorResponse = error.response;
  }
});

Then('the issue should be created successfully with summary {string}', async (expectedSummary: string) => {
  expect(createdIssueKey).toBeTruthy();
  const issue = await jiraService.getIssue(createdIssueKey);
  expect(issue.fields.summary).toBe(expectedSummary);
});

When('I update the Jira issue summary to {string}', async (newSummary: string) => {
  const updated = await jiraService.updateIssue(createdIssueKey, { summary: newSummary });
  expect(updated).toBe(true);
});

Then('the issue should have updated summary {string}', async (expectedSummary: string) => {
  const issue = await jiraService.getIssue(createdIssueKey);
  expect(issue.fields.summary).toBe(expectedSummary);
});

When('I delete the created Jira issue', async () => {
  const deleted = await jiraService.deleteIssue(createdIssueKey);
  expect(deleted).toBe(true);
});

Then('the deleted issue should not be retrievable anymore', async () => {
  let errorCaught = false;
  try {
    await jiraService.getIssue(createdIssueKey);
  } catch (error: any) {
    errorCaught = true;
    expect(error.response?.status).toBe(404);
  }
  expect(errorCaught).toBe(true);
});


When('I try to create a Jira issue with:', async (dataTable) => {
  const data = dataTable.rowsHash();
  try {
    await jiraService.createIssue(
      JIRA_PROJECT_KEY,
      data.summary,
      data.issueType,
      data.description,
    );
  } catch (error: any) {
    lastErrorResponse = error.response;
  }
});

When('I try to fetch Jira issue with key {string}', async (issueKey: string) => {
  try {
    await jiraService.getIssue(issueKey);
  } catch (error: any) {
    lastErrorResponse = error.response;
  }
});

When('I try to delete Jira issue with key {string}', async (issueKey: string) => {
  try {
    await jiraService.deleteIssue(issueKey);
  } catch (error: any) {
    lastErrorResponse = error.response;
  }
});

Then('the API should respond with status {int} and error message {string}', async (expectedStatusCode: number, expectedMessage: string) => {
  expect(lastErrorResponse?.status).toBe(expectedStatusCode);
  expect(JSON.stringify(lastErrorResponse?.data)).toContain(expectedMessage);
});
