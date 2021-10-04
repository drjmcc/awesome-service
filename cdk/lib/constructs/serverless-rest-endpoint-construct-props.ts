import * as cdk from "@aws-cdk/core";
import * as lambdaNodeJs from "@aws-cdk/aws-lambda-nodejs";

import { HttpMethod } from "@aws-cdk/aws-apigatewayv2/lib/http/route";

interface EndpointConfig {
  id: string;
  functionConfig: lambdaNodeJs.NodejsFunctionProps;
  routeConfig: {
    methods: HttpMethod[];
    path: string;
  };
  isAuthorized: boolean;
}

export interface ServerlessRestEndpointConstructProps extends cdk.StackProps {
  gatewayId: string;
  domainName: string;
  endpoints: EndpointConfig[];
}
