import * as cdk from "@aws-cdk/core";
import deepmerge from "deepmerge";

import { Architecture } from "@aws-cdk/aws-lambda";
import { AwesomeServiceComputeStackProps } from "./service-compute-stack-props";
import { ServerlessRestEndpointConstruct } from "../constructs/serverless-rest-endpoint-construct";
import { HttpMethod } from "@aws-cdk/aws-apigatewayv2/lib/http/route";
import { NodejsFunctionProps } from "@aws-cdk/aws-lambda-nodejs";

export class AwesomeServiceComputeStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: AwesomeServiceComputeStackProps
  ) {
    super(scope, id, props);
    const baseEnvironmentVariables = deepmerge(
      props.config.environmentVariables,
      {}
    );

    const functionConfig: NodejsFunctionProps = {
      entry: "lambdas/entrypoints/hello-world.ts",
      handler: "helloWorld",
      environment: deepmerge(baseEnvironmentVariables, {}),
      timeout: cdk.Duration.seconds(30),
      bundling: {
        nodeModules: ["winston"],
        externalModules: ["aws-sdk"]
      },
      architectures: [Architecture.ARM_64]
    };

    const helloWorldConfig = {
      id: "AwesomeServiceHelloWorld",
      functionConfig: functionConfig,
      routeConfig: {
        path: "/test",
        methods: [HttpMethod.GET],
        scope: ["awesome/read", "awesome/rw"]
      },
      isAuthorized: true
    };

    new ServerlessRestEndpointConstruct(this, "AwesomeServiceRestEndpoint", {
      gatewayId: "AwesomeServiceApiGateway",
      domainName: props.config.domainName,
      endpoints: [helloWorldConfig],
      issuer: props.config.issuer
    });
  }
}
