# Gamdom Test Task

## Overview
This project is built to demonstrate **UI** and **API** test automation using:

- **TypeScript**
- **Cucumber (BDD)**
- **Playwright** (for UI)
- **Axios** (for API)
- **Allure reports** (for test reports)
- **Docker** (for isolated execution)

It covers a real-world structure where both **UI** and **API** tests are maintained separately but work under the same automation framework.

---

# Project Structure

```
|-- src
|   |-- tests
|       |-- api
|           |-- features
|           |-- steps
|           |-- hooks
|       |-- ui
|           |-- features
|           |-- steps
|           |-- hooks
|-- docker-compose.yml
|-- Dockerfile
|-- run-tests.sh
|-- run-docker.sh
|-- package.json
|-- cucumber.config.ts
|-- README.md
```

- `api/features/` - All feature files for API tests (Gherkin syntax)
- `api/steps/` - Step Definitions for API tests
- `ui/features/` - All feature files for UI tests
- `ui/steps/` - Step Definitions for UI tests
- `hooks/` - Setup hooks like browser launch for UI tests
- `run-tests.sh` - Script to run tests easily
- `run-docker.sh` - Script to run tests inside Docker
- `allure-results/` - Folder for raw Allure results
- `allure-report/` - Generated Allure HTML report

---

# How to Install Locally

```bash
npm install
npx playwright install
```

This installs:
- Node.js packages
- Playwright browsers (Chromium, Firefox, WebKit)

> Note: Java is **NOT** needed locally because Playwright official image includes it if you use Docker.


---

# How to Run Tests

## Run all tests (API + UI)

```bash
./run-tests.sh
```

Or manually:

```bash
npm run test:all
```


## Run only API tests

```bash
./run-tests.sh api
```

or manually:

```bash
npm run test:api
```


## Run only UI tests

Example (Chromium):

```bash
./run-tests.sh ui chromium
```

Example (Firefox):

```bash
./run-tests.sh ui firefox
```

Example (Webkit):

```bash
./run-tests.sh ui webkit
```
Run Tests in Parallel:

add `--parallel` option to command line arguments and specify the number of parallel instances to run.

```bash
-- parallel (count)
````

## Run tests with tag (smoke, regression, etc.)

```bash
npm run test:smoke
```

You can configure more tags inside feature files using `@smoke`, `@regression`, etc.


---

# How to Use Allure Reports

After any test run:

```bash
npm run allure:generate
npm run allure:open
```
Anyways, report will be generated automatically after each run if you use `./run-tests.sh` or `./run-docker.sh`.

This will:
- Generate a fancy HTML report
- Open it locally on your browser

**History:**
- We preserve previous history (`history/` folder) for trend tracking across multiple runs.

---

# How to Run in Docker (recommended)

Docker gives you isolated, predictable environment. **No local installation problems.**


Then run tests inside the container:

Important: **DO NOT FORGET TO **  set IS_DOCKER=true in your environment variables before running the tests in docker.

```bash
./run-docker.sh all
```

Options for Docker:
- `./run-docker.sh all` - Run all tests (UI + API)
- `./run-docker.sh api` - Run API tests only
- `./run-docker.sh ui chromium` - Run UI tests in Chromium
- `./run-docker.sh ui firefox` - Run UI tests in Firefox
- `./run-docker.sh ui webkit` - Run UI tests in WebKit

If you want to remove old container errors:

```bash
docker container prune
```

---

# OS Compatibility

| OS          | Notes |
|-------------|-------|
| Windows     | Use Git Bash or WSL2 for bash scripts. Otherwise run commands manually. |
| MacOS       | Native bash/zsh supported. |
| Linux (Ubuntu, Debian, etc.) | Native bash/zsh supported. |


---

# Why to Use Cucumber (BDD)?
- Easy to write tests in **plain English**.
- Business people can understand feature files.
- Better collaboration between Testers, Developers, Managers.
- Organized test steps and reusability.


# Why to Use Docker?
- Everyone has the same environment. **No "works on my machine" issues**.
- Clean browser and dependency installation every time.
- Fast setup for CI/CD pipelines.
- Reliable Allure reports inside container.

---

# Final Notes
- API Tests and UI Tests are **independent**, can be run separately.
- Project follows clean folder structure for easier maintenance.
- Allure report shows detailed logs, request/response, screenshots (for UI).
- We can easily add more tags, environments, browsers, etc.

---

# Examples Summary

| Action | Command |
|--------|---------|
| Run all locally | `./run-tests.sh` |
| Run API only | `./run-tests.sh api` |
| Run UI Chromium | `./run-tests.sh ui chromium` |
| Run Docker | `./run-docker.sh all` |
| Open report | `npm run allure:open` |


---

