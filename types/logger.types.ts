export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "NONE";

export interface LoggerConfig {
  level: LogLevel;
  showTimestamp: boolean;
  showCaller: boolean;
}

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  force: (...args: unknown[]) => void;
  group: (label: string, fn: () => void) => void;
  setLevel: (level: LogLevel) => void;
}
