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

    const createChatProps: NodejsFunctionProps = {
      entry: "lambdas/entrypoints/create-chat-item.ts",
      handler: "postChatItem",
      environment: deepmerge(baseEnvironmentVariables, {}),
      timeout: cdk.Duration.seconds(30),
      bundling: {
        nodeModules: ["winston"],
        externalModules: ["aws-sdk"]
      },
      architectures: [Architecture.ARM_64]
    };

    const getChatProps: NodejsFunctionProps = {
      entry: "lambdas/entrypoints/get-chat-item.ts",
      handler: "getChatItem",
      environment: deepmerge(baseEnvironmentVariables, {}),
      timeout: cdk.Duration.seconds(30),
      bundling: {
        nodeModules: ["winston"],
        externalModules: ["aws-sdk"]
      },
      architectures: [Architecture.ARM_64]
    };

    const createChatItemConfig = {
      id: "AwesomeServiceHelloWorld",
      functionConfig: createChatProps,
      routeConfig: {
        path: "/test",
        methods: [HttpMethod.POST],
        scope: ["awesome/read", "awesome/rw"]
      },
      isAuthorized: true
    };

    const getChatItemConfig = {
      id: "AwesomeServiceGetChatItem",
      functionConfig: getChatProps,
      routeConfig: {
        path: "/test/{id}",
        methods: [HttpMethod.GET],
        scope: ["awesome/read", "awesome/rw"]
      },
      isAuthorized: true
    };

    new ServerlessRestEndpointConstruct(this, "AwesomeServiceRestEndpoint", {
      gatewayId: "AwesomeServiceApiGateway",
      domainName: props.config.domainName,
      endpoints: [createChatItemConfig, getChatItemConfig],
      issuer: props.config.issuer,
      table: props.table
    });
  }
}
