import { Construct, Stage } from "@aws-cdk/core";
import { AwesomeServiceComputeStack } from "../stacks/service-compute-stack";
import { AwesomeServicePipelineStageProps } from "./service-pipeline-stage-props";

export class AwesomeServicePipelineStage extends Stage {
  constructor(
    scope: Construct,
    id: string,
    props: AwesomeServicePipelineStageProps
  ) {
    super(scope, id, props);

    new AwesomeServiceComputeStack(
      this,
      `${props.config.outputPrefix}AwesomeServiceComputeStack`,
      {
        env: {
          region: props.config.awsRegion,
          account: props.config.awsAccountNumber
        },
        tags: {
          Application: "AwesomeService",
          Environment: id
        },
        config: props.config,
        table: props.table
      }
    );
  }
}
