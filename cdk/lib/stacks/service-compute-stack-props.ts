import * as cdk from "@aws-cdk/core";
import { Config } from "../config/config";
import { Table } from "@aws-cdk/aws-dynamodb";

export interface AwesomeServiceComputeStackProps extends cdk.StackProps {
  config: Config;
  table: Table;
}
