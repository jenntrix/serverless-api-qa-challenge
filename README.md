# Serverless API QA Challenge

This repository contains my **personal solution to the public [IoFinnet QA Challenge](https://github.com/IoFinnet/qa-challenge)**.

I completed this challenge independently for **study, practice, and QA/SDET portfolio purposes**. The original application and challenge requirements were provided by IoFinnet; the environment compatibility fixes, exploratory testing, automated tests, defect findings, test data organization, CI workflow, and Docker setup in this repository represent my work.

## Project Goal

The challenge is a white-box QA exercise focused on a small Serverless API with two endpoints:

- `POST /loginaction`
- `POST /sumaction`

The objective is to:

- Run the application locally.
- Understand the requirements and source code.
- Perform manual/exploratory API testing.
- Identify deviations between expected and actual behavior.
- Build automated tests for the most relevant scenarios.
- Keep the solution reproducible and easy to run.

## Tech Stack

- TypeScript
- Node.js 14
- Serverless Framework
- Serverless Offline
- Cucumber.js
- cucumber-tsflow
- Chai
- Supertest
- node-fetch
- GitHub Actions
- Docker

## API Requirements

### `POST /loginaction`

The endpoint authenticates a user using request headers:

```text
username: bob
password: P@55w0rd
```

Expected behavior:

- Valid credentials → `200 OK` and authentication token.
- Invalid credentials → `401 Unauthorized`.

The valid token returned by the current application is:

```text
G7T0K3N
```

### `POST /sumaction`

The endpoint requires the authentication token:

```text
token: G7T0K3N
```

and a JSON request body containing two numerical values:

```json
{
  "first": 2,
  "second": 2
}
```

Expected behavior:

- Valid token + valid numerical values → `200 OK` and the sum.
- Invalid or missing token → `401 Unauthorized`.
- Non-numerical values → `null`.

Example successful response:

```json
{
  "result": 4
}
```

## Testing Approach

I approached the challenge in stages:

1. Set up the legacy project locally in Ubuntu/WSL.
2. Resolve dependency compatibility issues.
3. Run the API with Serverless Offline.
4. Perform exploratory API testing using `curl`.
5. Compare actual behavior with the documented requirements.
6. Review the source code as part of white-box testing.
7. Select the highest-value scenarios for automation.
8. Implement automated API tests with Cucumber and TypeScript.
9. Add CI execution with GitHub Actions.
10. Add Docker support to simplify local execution.

## Environment Compatibility Fixes

The original challenge uses an older Node.js/Serverless stack. A fresh installation with modern dependency resolution caused compatibility issues.

The project was adjusted to keep the original application behavior while making the environment reproducible.

Important compatibility decisions include:

- Node.js `14.21.3`
- `@types/node` aligned to Node 14
- `serverless-webpack` pinned to `5.6.0`
- `package-lock.json` used to preserve tested dependency versions
- Legacy Cucumber type conflicts removed during setup

These changes were required because newer transitive dependencies were incompatible with the original TypeScript/CommonJS stack.

## Automated Test Coverage

The current Cucumber suite contains **11 automated scenarios**.

### Login API — 4 scenarios

- Login with valid credentials.
- Login with incorrect password.
- Login with incorrect username.
- Login with no password.

### Sum API — 7 scenarios

- Sum two valid numbers.
- Sum with invalid token.
- Sum with no token.
- Sum with non-numeric first value.
- Sum with non-numeric second value.
- Sum numeric values provided as strings.
- Sum with one numeric value provided as a string.

The automation intentionally focuses on critical requirements, authentication/authorization, input validation, and defects found during exploratory testing rather than automating every manual scenario.

## Defects Found

Scenarios that expose requirement deviations are tagged with:

```gherkin
@bug-found
```

### 1. Password is not validated correctly

The requirements state that authentication requires both a valid username and password.

However, the application authenticates successfully when:

- The username is correct but the password is incorrect.
- The username is correct and the password is missing.

Example:

```text
username: bob
password: wrongpassword
```

Expected:

```text
401 Unauthorized
```

Actual:

```text
200 OK
Authentication token returned
```

White-box analysis of the login implementation shows that the username is validated, while the password is not part of the successful-authentication condition.

### 2. Numeric strings are accepted as numerical inputs

The Sum API requirements specify numerical inputs and state that non-numerical values should result in `null`.

However, the current implementation converts numeric strings into numbers before summing them.

Example:

```json
{
  "first": "4",
  "second": "6"
}
```

Expected:

```json
{
  "result": null
}
```

Actual:

```json
{
  "result": 10
}
```

The same behavior is covered when only one value is provided as a numeric string.

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── qa-test.yml
├── spec/
│   └── cucumber/
│       ├── config/
│       │   └── testData.ts
│       ├── features/
│       │   ├── login.feature
│       │   └── sum.feature
│       └── steps/
│           ├── login.steps.ts
│           └── sum.steps.ts
├── src/
├── resources/
├── cucumber.js
├── Dockerfile
├── .dockerignore
├── package.json
├── package-lock.json
├── serverless.ts
└── tsconfig.json
```

## Test Design

### Gherkin Features

Tests are written in readable BDD scenarios using Cucumber/Gherkin.

Example:

```gherkin
@login
Feature: Login API

  Scenario: Login with valid credentials
    When I login with valid credentials
    Then the login response status should be 200
    And the login response should contain a valid token
```

### Step Definitions

The TypeScript step definitions:

- Send API requests.
- Store HTTP responses.
- Validate status codes.
- Validate response bodies.
- Reuse common request logic for Sum scenarios.

### Centralized Test Data

Reusable test data is stored in:

```text
spec/cucumber/config/testData.ts
```

This includes:

- Valid and invalid usernames.
- Valid and invalid passwords.
- Valid and invalid tokens.
- Numeric test values.
- Non-numeric values.
- Numeric values represented as strings.

This avoids unnecessary hardcoding across step definitions.

## Cucumber Tags

Feature-level tags organize tests by API:

```gherkin
@login
@sum
```

Defect-revealing scenarios use:

```gherkin
@bug-found
```

Examples:

Run only Login tests:

```bash
npm run test:login
```

Run only Sum tests:

```bash
npm run test:sum
```

Run the regression suite while excluding known failing defect scenarios:

```bash
npm run test:regression
```

Run only defect scenarios:

```bash
npm run test:defects
```

## Installation

### Prerequisites

For the local non-Docker setup:

- Node.js `14.21.3`
- npm
- Git

Using NVM is recommended because this is a legacy Node.js project.

### Clone the repository

```bash
git clone https://github.com/jenntrix/serverless-api-qa-challenge.git
cd serverless-api-qa-challenge
```

### Install dependencies

```bash
npm ci
```

`npm ci` is recommended to install the exact dependency versions recorded in `package-lock.json`.

## Run the API Locally

Start Serverless Offline:

```bash
npx serverless offline
```

The API is exposed at:

```text
http://localhost:3000
```

Endpoints:

```text
POST http://localhost:3000/loginaction
POST http://localhost:3000/sumaction
```

Keep this terminal running while executing the tests from another terminal.

## Run the Automated Tests

### All Cucumber tests

```bash
npx cucumber-js
```

> Note: scenarios tagged `@bug-found` intentionally expose current application defects and are expected to fail while those defects remain unfixed.

### Regression suite

Excludes scenarios currently associated with discovered defects:

```bash
npm run test:regression
```

### Login tests

```bash
npm run test:login
```

### Sum tests

```bash
npm run test:sum
```

### Defect scenarios

```bash
npm run test:defects
```

## Example Manual API Requests

### Valid Login

```bash
curl -i -X POST http://localhost:3000/loginaction -H "username: bob" -H "password: P@55w0rd"
```

### Valid Sum

```bash
curl -i -X POST http://localhost:3000/sumaction -H "Content-Type: application/json" -H "token: G7T0K3N" -d '{"first":2,"second":2}'
```

## Docker

Docker is included so the application can be started without manually installing the project's legacy Node.js and Serverless stack.

### Build the image

```bash
docker build -t serverless-api-qa-challenge .
```

### Run the container

```bash
docker run --rm -p 3000:3000 serverless-api-qa-challenge
```

The API will then be available at:

```text
http://localhost:3000
```

You can test it from another terminal using the same `curl` commands shown above.

## Continuous Integration

GitHub Actions is configured in:

```text
.github/workflows/qa-test.yml
```

The workflow runs on:

- Pushes to `main`.
- Pull requests targeting `main`.

The pipeline:

1. Checks out the repository.
2. Sets up Node.js `14.21.3`.
3. Installs dependencies with `npm ci`.
4. Starts Serverless Offline.
5. Waits for the API to become available.
6. Runs the regression suite excluding `@bug-found`.
7. Runs `@bug-found` scenarios separately with `continue-on-error`.
8. Prints Serverless logs when the job fails.

Running defect scenarios separately keeps the discovered issues visible in CI without making the main regression execution permanently red.

## npm Scripts

The most relevant scripts added/used for this QA implementation are:

```bash
npm run test:regression
npm run test:login
npm run test:sum
npm run test:defects
```

The original project also contains scripts for offline/stage integration execution and unit testing.

## What I Practiced

This project gave me hands-on practice with:

- Backend API testing.
- REST API validation.
- Positive and negative testing.
- Authentication and authorization testing.
- Input and data-type validation.
- Exploratory testing.
- White-box testing.
- Requirement analysis.
- Defect identification.
- TypeScript.
- Cucumber/Gherkin.
- BDD-style automation.
- Reusable test code.
- Centralized test data.
- Legacy dependency troubleshooting.
- Serverless applications.
- GitHub Actions / CI.
- Docker and reproducible environments.

## Project Purpose

This repository is a **QA/SDET learning and portfolio project**.

My goal was not only to make automated tests pass, but to follow a realistic testing workflow:

```text
Requirements analysis
        ↓
Environment setup
        ↓
Exploratory testing
        ↓
White-box code review
        ↓
Defect discovery
        ↓
Test case prioritization
        ↓
API automation
        ↓
CI integration
        ↓
Dockerized execution
```

## Credits

Original public challenge:

**IoFinnet QA Challenge**  
https://github.com/IoFinnet/qa-challenge

The original application code and challenge requirements belong to IoFinnet.

This repository contains my independent QA implementation, automated coverage, findings, compatibility fixes, CI configuration, and Docker setup created for study, practice, and portfolio purposes.

## Author

**Jennifer Herrera**  
QA Engineer / SDET