import * as cdk from "@aws-cdk/core";
import { Config } from "../config/config";

export interface AwesomeServiceComputeStackProps extends cdk.StackProps {
  config: Config;
}
