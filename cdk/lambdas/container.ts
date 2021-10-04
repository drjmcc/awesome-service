import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "./types";
import { ILoggerService } from "./interfaces/i-logger-service";
import { LoggerService } from "./services/logger-service";

const container = new Container();

// services
container
  .bind<ILoggerService>(TYPES.ILoggerService)
  .to(LoggerService)
  .inSingletonScope();

// variables
container
  .bind<string>(TYPES.LogLevel)
  .toConstantValue(process.env.logLevel as string);

container
  .bind<string>(TYPES.ReleaseVersion)
  .toConstantValue(process.env.releaseVersion as string);

container
  .bind<string>(TYPES.EnvironmentName)
  .toConstantValue(process.env.environmentName as string);

export { container };
