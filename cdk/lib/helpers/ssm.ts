import * as cdk from "@aws-cdk/core";
import cxschema = require("@aws-cdk/cloud-assembly-schema");

export function ssmStringParameterLookupWithDummyValue(
  scope: cdk.Construct,
  parameterName: string,
  dummyValue: string
): string {
  return cdk.ContextProvider.getValue(scope, {
    provider: cxschema.ContextProvider.SSM_PARAMETER_PROVIDER,
    props: {
      parameterName
    },
    dummyValue: dummyValue
  }).value;
}
