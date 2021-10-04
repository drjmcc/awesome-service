import { inject, injectable } from "inversify";
import { createLogger, format, transports, Logger } from "winston";
import { ILoggerService } from "../interfaces/i-logger-service";
import TYPES from "../types";
import "reflect-metadata";

@injectable()
export class LoggerService implements ILoggerService {
  public logger: Logger;

  constructor(
    @inject(TYPES.LogLevel) logLevel: string,
    @inject(TYPES.LambdaName) lambdaName: string
  ) {
    this.logger = createLogger({
      level: logLevel,
      exitOnError: false,
      format: format.json(),
      transports: [new transports.Console()],
      defaultMeta: {
        loggerName: lambdaName
      }
    });
  }
}
