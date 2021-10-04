import { Config } from "../lib/config/config";
import deepmerge from "deepmerge";
import * as testingSpecificConfig from "./test-config.json";
import * as sharedConfig from "../lib/config/shared.json";

export const testConfig: Config = deepmerge(
  sharedConfig,
  testingSpecificConfig
);
