import { Logger, LoggerConfig, LogLevel } from "./types/logger.types";

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

const config: LoggerConfig = {
  level: process.env.NODE_ENV === "production" ? "NONE" : "DEBUG",
  showTimestamp: true,
  showCaller: true,
};

function getCallerInfo(): string {
  const err = new Error();
  const line = err.stack?.split("\n")[3] ?? "";
  const match =
    line.match(/\((.+):(\d+):(\d+)\)/) || line.match(/at (.+):(\d+):(\d+)/);
  return match ? `${match[1].split("/").pop()}:${match[2]}` : "unknown";
}

function format(level: LogLevel, args: unknown[]): unknown[] {
  const parts: string[] = [];
  if (config.showTimestamp) parts.push(`[${new Date().toISOString()}]`);
  parts.push(`[${level}]`);
  if (config.showCaller) parts.push(`(${getCallerInfo()})`);
  return [...parts, ...args];
}

function isAtLeast(level: LogLevel): boolean {
  return LOG_LEVELS[config.level] <= LOG_LEVELS[level];
}

const logger: Logger = {
  debug: (...args: unknown[]) =>
    isAtLeast("DEBUG") && console.debug(...format("DEBUG", args)),
  info: (...args: unknown[]) =>
    isAtLeast("INFO") && console.info(...format("INFO", args)),
  warn: (...args: unknown[]) =>
    isAtLeast("WARN") && console.warn(...format("WARN", args)),
  error: (...args: unknown[]) =>
    isAtLeast("ERROR") && console.error(...format("ERROR", args)),

  force: (...args: unknown[]) => console.log("🔴 [FORCE]", ...args),

  group: (label: string, fn: () => void): void => {
    console.group(label);
    fn();
    console.groupEnd();
  },

  setLevel: (level: LogLevel): void => {
    config.level = level;
  },
};

export default logger;

{
  /* 
error: (...args: unknown[]) => {
  if (isAtLeast("ERROR")) {
    console.error(...format("ERROR", args));

    // Forward to Sentry, Datadog, etc.
    const [message, err] = args;
    if (err instanceof Error) {
      Sentry.captureException(err);
    } else {
      Sentry.captureMessage(String(message));
    }
  }
},  
*/
}
