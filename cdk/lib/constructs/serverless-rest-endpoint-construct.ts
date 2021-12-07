import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigatewayv2";
import * as apigatewayAuthorizers from "@aws-cdk/aws-apigatewayv2-authorizers";
import * as apigatewayIntegrations from "@aws-cdk/aws-apigatewayv2-integrations";
import * as lambdaNodeJs from "@aws-cdk/aws-lambda-nodejs";

import { ServerlessRestEndpointConstructProps } from "./serverless-rest-endpoint-construct-props";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { CorsHttpMethod } from "@aws-cdk/aws-apigatewayv2";
import { ssmStringParameterLookupWithDummyValue } from "../helpers/ssm";

export class ServerlessRestEndpointConstruct extends cdk.Construct {
  public gateway: apigateway.HttpApi;
  public lambdaFunctions: NodejsFunction[];
  constructor(
    scope: cdk.Construct,
    id: string,
    props: ServerlessRestEndpointConstructProps
  ) {
    super(scope, id);

    const fakeArn = "arn:aws:service:region:number:type:MissingValue-secret";
    const clientCredsClientId = ssmStringParameterLookupWithDummyValue(
      this,
      `/dev/cognito/user-pool-client/clientcreds/client-id`,
      fakeArn
    );

    this.gateway = new apigateway.HttpApi(this, props.gatewayId, {
      // defaultDomainMapping: {
      //   domainName: this.domainName
      // }
      corsPreflight: {
        allowHeaders: ["*"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.HEAD,
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.POST
        ]
        // allowOrigins: []
      }
    });

    this.lambdaFunctions = [];
    const authorizer = new apigatewayAuthorizers.HttpJwtAuthorizer({
      jwtAudience: [clientCredsClientId],
      jwtIssuer: props.issuer,
      authorizerName: "awesome-jwt-authorizer",
      identitySource: ["$request.header.Authorization"]
    });

    for (const endpoint of props.endpoints) {
      const handlerFn = new lambdaNodeJs.NodejsFunction(
        this,
        endpoint.id,
        endpoint.functionConfig
      );

      this.lambdaFunctions.push(handlerFn);

      props.table.grantReadWriteData(handlerFn);

      const integration = new apigatewayIntegrations.LambdaProxyIntegration({
        handler: handlerFn
      });

      if (endpoint.isAuthorized) {
        this.gateway.addRoutes({
          path: endpoint.routeConfig.path,
          methods: endpoint.routeConfig.methods,
          integration: integration,
          authorizer: authorizer,
          authorizationScopes: endpoint.routeConfig.scope
        });
      } else {
        this.gateway.addRoutes({
          path: endpoint.routeConfig.path,
          methods: endpoint.routeConfig.methods,
          integration: integration
        });
      }
    }
  }
}
