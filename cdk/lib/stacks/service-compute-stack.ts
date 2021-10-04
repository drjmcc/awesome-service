import * as cdk from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";
import cxschema = require("@aws-cdk/cloud-assembly-schema");
import deepmerge from "deepmerge";

import * as apigateway from "@aws-cdk/aws-apigatewayv2";
import { AwesomeServiceComputeStackProps } from "./service-compute-stack-props";
import { ServerlessRestEndpointConstruct } from "../constructs/serverless-rest-endpoint-construct";
import { HttpMethod } from "@aws-cdk/aws-apigatewayv2/lib/http/route";
// import { HttpLambdaResponseType } from "@aws-cdk/aws-apigatewayv2-authorizers";

class ApiGatewayDomain implements route53.IAliasRecordTarget {
  constructor(private readonly domainName: apigateway.IDomainName) {}

  public bind(): route53.AliasRecordTargetConfig {
    return {
      dnsName: this.domainName.regionalDomainName,
      hostedZoneId: this.domainName.regionalHostedZoneId
    };
  }
}

export class AwesomeServiceComputeStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: AwesomeServiceComputeStackProps
  ) {
    super(scope, id, props);
    // const apiHostedZone = route53.HostedZone.fromHostedZoneAttributes(
    //   this,
    //   "ApiHostedZone",
    //   {
    //     hostedZoneId: apiHostedZoneId,
    //     zoneName: apiHostedZoneName
    //   }
    // );

    const baseEnvironmentVariables = deepmerge(
      props.config.environmentVariables,
      {}
    );

    const helloWorldConfig = {
      id: "AwesomeServiceHelloWorld",
      functionConfig: {
        entry: "lambdas/entrypoints/hello-world.ts",
        handler: "helloWorld",
        environment: deepmerge(baseEnvironmentVariables, {}),
        timeout: cdk.Duration.seconds(30),
        bundling: {
          nodeModules: ["winston"],
          externalModules: ["aws-sdk"]
        }
      },
      routeConfig: {
        path: "/test",
        methods: [HttpMethod.GET]
      },
      isAuthorized: false
    };

    // const lambdaAuthorizerConfig = {
    //   id: "AwesomeServiceLamdaAuthorizer",
    //   functionConfig: {
    //     entry: "lambdas/entrypoints/checkApiKey.ts",
    //     handler: "checkApiKey",
    //     HttpLambdaResponseType: [HttpLambdaResponseType.SIMPLE],

    //     environment: deepmerge(
    //       baseEnvironmentVariables,
    //       {}
    //     ),
    //     timeout: cdk.Duration.seconds(30,
    //     bundling: {
    //       nodeModules: ["winston"],
    //       externalModules: ["aws-sdk"]
    //     }
    //   }
    // };

    new ServerlessRestEndpointConstruct(this, "AwesomeServiceRestEndpoint", {
      gatewayId: "AwesomeServiceApiGateway",
      domainName: props.config.domainName,
      endpoints: [helloWorldConfig]
    });

    // api.lambdaFunctions.forEach((fn) => {
    //   if (fn.role) {
    //     this.secret.grantRead(fn.role);
    //     this.awesomeTopic.grantPublish(fn.role);
    //   }
    // });

    // new route53.ARecord(this, "ServiceAliasRecord", {
    //   zone: apiHostedZone,
    //   recordName: props.config.domainName,
    //   target: route53.RecordTarget.fromAlias(
    //     new ApiGatewayDomain(api.domainName)
    //   )
    // });
  }
}

export function ssmStringParameterLookupWithDummyValue(
  scope: cdk.Construct,
  parameterName: string,
  dummyValue: string
): string {
  return cdk.ContextProvider.getValue(scope, {
    provider: cxschema.ContextProvider.SSM_PARAMETER_PROVIDER,
    props: {
      parameterName
    },
    dummyValue: dummyValue
  }).value;
}
