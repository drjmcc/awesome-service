import * as cdk from "@aws-cdk/core";
import * as ssm from "@aws-cdk/aws-ssm";
import * as pipelines from "@aws-cdk/pipelines";
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";

export class AwesomeServicePipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const githubToken = "github-token";
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: "GitHub",
      output: sourceArtifact,
      oauthToken: cdk.SecretValue.secretsManager(githubToken),
      owner: "dave",
      repo: "awesome-service",
      trigger: codepipeline_actions.GitHubTrigger.NONE,
      branch: "main"
    });

    const synthAction = pipelines.SimpleSynthAction.standardYarnSynth({
      sourceArtifact,
      cloudAssemblyArtifact,
      environmentVariables: {
        NODE_PIPE_ACCESS_TOKEN: {
          type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
          value: githubToken
        },
        RELEASE_HASH: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: sourceAction.variables.commitId
        }
      },
      installCommand: `npm install`,
      buildCommand: "yarn run build",
      synthCommand: "yarn run cdk synth --verbose",
      subdirectory: "cdk"
    });

    const pipeline = new pipelines.CdkPipeline(this, "Pipeline", {
      cloudAssemblyArtifact,
      sourceAction,
      synthAction,
      crossAccountKeys: true,
      pipelineName: "AwesomeServicePipeline",
      cdkCliVersion: "1.125.0"
    });

    // pipeline.addApplicationStage(
    //   new AwesomeServicePipelineStage(
    //     this,
    //     "StagingAwesomeServiceStage",
    //     {
    //       env: {
    //         account: config.staging.awsAccountNumber,
    //         region: config.staging.awsRegion
    //       },
    //       config: config.staging
    //     }
    //   )
    // );

    // pipeline.addApplicationStage(
    //   new AwesomeServicePipelineStage(
    //     this,
    //     "Prod1AwesomeServiceStage",
    //     {
    //       env: {
    //         account: config.production1.awsAccountNumber,
    //         region: config.production1.awsRegion
    //       },
    //       config: config.production1
    //     }
    //   ),
    //   {
    //     manualApprovals: true
    //   }
    // );

    new ssm.StringParameter(this, "AwesomeServicePipelineName", {
      allowedPattern: ".*",
      description: "Name of the AwesomeService Pipeline",
      parameterName: "AwesomeServicePipelineName",
      stringValue: pipeline.codePipeline.pipelineName,
      tier: ssm.ParameterTier.STANDARD
    });
  }
}
