import * as cdk from "@aws-cdk/core";

import { expect, haveResource } from "@aws-cdk/assert";
import { AwesomeServiceComputeStack } from "../lib/stacks/service-compute-stack";
import { testConfig } from "./test-config";
import { Table } from "@aws-cdk/aws-dynamodb";

describe("Stack", () => {
  describe("Full stack deployment", () => {
    let stack: AwesomeServiceComputeStack;
    let table: Table;

    beforeEach(() => {
      const app = new cdk.App();
      stack = new AwesomeServiceComputeStack(app, "TestStack", {
        env: {
          account: "123456789",
          region: "eu-west-1"
        },
        config: testConfig,
        table: table
      });
    });

    describe("AwesomeService", () => {
      it("Creates AwesomeService", () => {
        expect(stack).to(haveResource("AWS::ApiGatewayV2::Api", {}));
        expect(stack).to(haveResource("AWS::Lambda::Function", {}));
      });
    });
  });
});
