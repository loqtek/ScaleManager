import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform, Share } from "react-native";
import Constants from "expo-constants";
import { getServerConfig } from "./getServer";

type LogLevel = "log" | "info" | "warn" | "error";

type LogEntry = {
  time: string;
  level: LogLevel;
  message: string;
};

const MAX_ENTRIES = 800;
const entries: LogEntry[] = [];
let installed = false;

function redact(text: string): string {
  return text
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/hskey-[a-z]+-[^\s"'\\]+/gi, "hskey-[redacted]")
    .replace(/((?:api[_-]?key|token|authorization)["']?\s*[:=]\s*["']?)[^\s"',}]+/gi, "$1[redacted]");
}

function formatArg(value: unknown): string {
  if (value instanceof Error) {
    return `${value.name}: ${value.message}${value.stack ? `\n${value.stack}` : ""}`;
  }
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function push(level: LogLevel, args: unknown[]) {
  const message = redact(args.map(formatArg).join(" "));
  entries.push({ time: new Date().toISOString(), level, message });
  if (entries.length > MAX_ENTRIES) {
    entries.splice(0, entries.length - MAX_ENTRIES);
  }
}

export function installFrontendLogger() {
  if (installed) return;
  installed = true;

  (["log", "info", "warn", "error"] as const).forEach((level) => {
    const original = console[level].bind(console);
    console[level] = (...args: unknown[]) => {
      try {
        push(level, args);
      } catch {
        // Keep logging even if the buffer fails.
      }
      original(...args);
    };
  });

  const errorUtils = (globalThis as { ErrorUtils?: {
    getGlobalHandler?: () => (error: unknown, isFatal?: boolean) => void;
    setGlobalHandler?: (handler: (error: unknown, isFatal?: boolean) => void) => void;
  } }).ErrorUtils;

  if (errorUtils?.getGlobalHandler && errorUtils.setGlobalHandler) {
    const previous = errorUtils.getGlobalHandler();
    errorUtils.setGlobalHandler((error, isFatal) => {
      push("error", [`${isFatal ? "Fatal error" : "Unhandled error"}:`, error]);
      previous?.(error, isFatal);
    });
  }
}

export function getFrontendLogCount() {
  return entries.length;
}

async function buildLogFile(): Promise<string> {
  const server = await getServerConfig();
  const lines = [
    "Scale Manager frontend log",
    `Exported: ${new Date().toISOString()}`,
    `App version: ${Constants.expoConfig?.version ?? "unknown"}`,
    `Platform: ${Platform.OS} ${String(Platform.Version)}`,
    server
      ? `Selected server: ${server.name} (${server.server})`
      : "Selected server: none",
    `Entries: ${entries.length}`,
    "",
    ...entries.map((entry) => `[${entry.time}] ${entry.level.toUpperCase()} ${entry.message}`),
    "",
  ];
  return redact(lines.join("\n"));
}

function logFileName() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `scalemanager-logs-${stamp}.txt`;
}

function downloadOnWeb(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function exportFrontendLogs() {
  const contents = await buildLogFile();
  const filename = logFileName();

  if (Platform.OS === "web") {
    downloadOnWeb(filename, contents);
    return filename;
  }

  const file = new File(Paths.cache, filename);
  file.create({ overwrite: true });
  file.write(contents);

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      mimeType: "text/plain",
      dialogTitle: "Export Scale Manager logs",
      UTI: "public.plain-text",
    });
    return filename;
  }

  await Share.share({ title: filename, message: contents });
  return filename;
}
