export declare enum Environment {
  UNITTEST = 0,
  DEVELOPMENT = 1,
  STAGING = 1,
  PRODUCTION = 3
}

export interface Config {
  environment: Environment;
  awsAccountNumber: string;
  awsRegion: string;
  outputPrefix: string;
  domainName: string;
  environmentVariables: {
    [key: string]: string;
    releaseVersion: string;
    environmentName: string;
  };
}
