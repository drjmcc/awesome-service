import * as cdk from "@aws-cdk/core";
import { Table, AttributeType, BillingMode } from "@aws-cdk/aws-dynamodb";
import { AwesomeServiceDataStackProps } from "./service-data-stack-props";

export class AwesomeServiceDataStack extends cdk.Stack {
  public table: Table;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: AwesomeServiceDataStackProps
  ) {
    super(scope, id, props);

    const tableName = "AwesomeService";
    this.table = new Table(this, tableName, {
      partitionKey: {
        name: "PK",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "SK",
        type: AttributeType.STRING
      },
      tableName: tableName,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecovery: false
    });
  }
}
