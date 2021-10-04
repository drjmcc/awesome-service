# awesome-service

## Running Locally

Use `yarn run build.synth.run.local` to build and run locally, then use the postman collection and environments in the repo.

## Building

Troubleshooting with building:

- The warning "warning package.json: No license field" can be ignored

## Unit Testing

To install the testing framework:
yarn add jest-runner-vscode

To run the the existing unit tests:
yarn test

Troubleshooting with unit testing:

- Ensure that there is a folder called .jest under cdk folder.
- Ensure there is a file called setEnvVars.js (This is not part of git). Example content is:
