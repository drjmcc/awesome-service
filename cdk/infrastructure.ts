#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
// import { AwesomeServicePipelineStack } from "./lib/pipeline/service-pipeline";
import * as config from "./lib/config";
import { AwesomeServiceComputeStack } from "./lib/stacks";
import { Config } from "./lib/config/config";
import { AwesomeServiceDataStack } from "./lib/stacks/service-data-stack";

const app = new cdk.App();
const createNonPipelineStacks = (config: Config) => {
  const dataStack = new AwesomeServiceDataStack(
    app,
    `${config.outputPrefix}AwesomeServiceDataStack`,
    {
      env: {
        region: config.awsRegion,
        account: config.awsAccountNumber
      },
      tags: {
        Application: "AwesomeService",
        Environment: config.outputPrefix
      },
      config: config
    }
  );

  new AwesomeServiceComputeStack(
    app,
    `${config.outputPrefix}AwesomeServiceComputeStack`,
    {
      env: {
        region: config.awsRegion,
        account: config.awsAccountNumber
      },
      tags: {
        Application: "AwesomeService",
        Environment: config.outputPrefix
      },
      config: config,
      table: dataStack.table
    }
  );
};

createNonPipelineStacks(config.dev);

// new AwesomeServicePipelineStack(app, "AwesomeServicePipelineStack", {
//   env: {
//     account: config.dev.awsAccountNumber,
//     region: config.dev.awsRegion
//   }
// });

app.synth();
