import * as cdk from "@aws-cdk/core";
import { Config } from "../config/config";
import { Table } from "@aws-cdk/aws-dynamodb";

export interface AwesomeServicePipelineStageProps extends cdk.StageProps {
  config: Config;
  table: Table;
}
