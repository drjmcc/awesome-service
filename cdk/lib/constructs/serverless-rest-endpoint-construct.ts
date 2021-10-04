import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigatewayv2";
// import * as apigatewayAuthorizers from "@aws-cdk/aws-apigatewayv2-authorizers";
import * as apigatewayIntegrations from "@aws-cdk/aws-apigatewayv2-integrations";
// import * as certificatemanager from "@aws-cdk/aws-certificatemanager";
import * as lambdaNodeJs from "@aws-cdk/aws-lambda-nodejs";

import { ServerlessRestEndpointConstructProps } from "./serverless-rest-endpoint-construct-props";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { CorsHttpMethod } from "@aws-cdk/aws-apigatewayv2";

export class ServerlessRestEndpointConstruct extends cdk.Construct {
  // public domainName: apigateway.IDomainName;
  public gateway: apigateway.HttpApi;
  public lambdaFunctions: NodejsFunction[];
  constructor(
    scope: cdk.Construct,
    id: string,
    props: ServerlessRestEndpointConstructProps
  ) {
    super(scope, id);

    // const apiCert = new certificatemanager.DnsValidatedCertificate(
    //   this,
    //   `${props.gatewayId}DomainCert`,
    //   {
    //     domainName: props.domainName,
    //     // ? Doc's say default is email, but I think that is mistake.
    //     validationMethod: certificatemanager.ValidationMethod.DNS,
    //     hostedZone: props.hostedZone
    //   }
    // );

    // this.domainName = new apigateway.DomainName(
    //   this,
    //   `${props.gatewayId}DomainName`,
    //   {
    //     domainName: props.domainName,
    //     certificate: apiCert
    //   }
    // );

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
    // const authorizer = new apigatewayAuthorizers.HttpUserPoolAuthorizer({
    //   userPool,
    //   userPoolClient,
    //   identitySource: ["$request.header.Authorization"]
    // });

    for (const endpoint of props.endpoints) {
      const platformHandlerFn = new lambdaNodeJs.NodejsFunction(
        this,
        endpoint.id,
        endpoint.functionConfig
      );

      this.lambdaFunctions.push(platformHandlerFn);

      const integration = new apigatewayIntegrations.LambdaProxyIntegration({
        handler: platformHandlerFn
      });

      if (endpoint.isAuthorized) {
        // this.gateway.addRoutes({
        //   path: endpoint.routeConfig.path,
        //   methods: endpoint.routeConfig.methods,
        //   integration: integration,
        //   authorizer: authorizer
        // });
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
