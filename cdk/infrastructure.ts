#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { AwesomeServicePipelineStack } from "./lib/pipeline/service-pipeline";
import * as config from "./lib/config";
import { AwesomeServiceComputeStack } from "./lib/stacks";
import { Config } from "./lib/config/config";

const app = new cdk.App();
const createNonPipelineStacks = (config: Config) => {
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
      config: config
    }
  );
};

createNonPipelineStacks(config.dev);

new AwesomeServicePipelineStack(app, "AwesomeServicePipelineStack", {
  env: {
    account: config.dev.awsAccountNumber,
    region: config.dev.awsRegion
  }
});

app.synth();
