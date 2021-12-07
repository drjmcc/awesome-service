import * as cdk from "@aws-cdk/core";
import { Config } from "../config/config";

export interface AwesomeServiceDataStackProps extends cdk.StackProps {
  config: Config;
}
