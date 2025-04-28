import dotenv from 'dotenv';
dotenv.config();

export const BASE_URL = process.env.BASE_URL || '';
export const USERNAME = process.env.USERNAME || '';
export const PASSWORD = process.env.PASSWORD || '';
export const BROWSER = process.env.BROWSER || 'chromium';

export const JIRA_BASE_URL: string = process.env.JIRA_BASE_URL || '';
export const JIRA_AUTH_TOKEN: string = process.env.JIRA_AUTH_TOKEN || '';
export const JIRA_PROJECT_KEY: string = process.env.JIRA_PROJECT_KEY || '';