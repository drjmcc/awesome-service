import * as cdk from "@aws-cdk/core";
import { Config } from "../config/config";

export interface AwesomeServicePipelineStageProps extends cdk.StageProps {
  config: Config;
}
