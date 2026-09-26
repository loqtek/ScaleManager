/**
 * Helpers for parsing device registration / auth inputs across Headscale versions.
 *
 * v0.29 prefers: headscale auth register --user <user> --auth-id <id>
 * Older:         headscale nodes register --user <user> --key <key>
 */

export type ParsedRegistrationInput =
  | { kind: "auth-register"; user?: string; authId: string }
  | { kind: "node-register"; user?: string; key: string }
  | { kind: "auth-approve"; authId: string }
  | { kind: "auth-reject"; authId: string }
  | { kind: "raw"; value: string };

export function parseRegistrationInput(input: string): ParsedRegistrationInput {
  const trimmed = input.trim();
  if (!trimmed) return { kind: "raw", value: "" };

  const authRegister = trimmed.match(
    /headscale\s+auth\s+register\s+.*?--user\s+([^\s]+).*?--auth-id\s+([^\s]+)/i,
  ) || trimmed.match(
    /headscale\s+auth\s+register\s+.*?--auth-id\s+([^\s]+).*?--user\s+([^\s]+)/i,
  );
  if (authRegister) {
    // Groups depend on which pattern matched
    if (/--user\s+[^\s]+\s+.*?--auth-id/i.test(trimmed)) {
      return { kind: "auth-register", user: authRegister[1], authId: authRegister[2] };
    }
    return { kind: "auth-register", authId: authRegister[1], user: authRegister[2] };
  }

  const authApprove = trimmed.match(
    /headscale\s+auth\s+approve\s+.*?--auth-id\s+([^\s]+)/i,
  );
  if (authApprove) {
    return { kind: "auth-approve", authId: authApprove[1] };
  }

  const authReject = trimmed.match(
    /headscale\s+auth\s+reject\s+.*?--auth-id\s+([^\s]+)/i,
  );
  if (authReject) {
    return { kind: "auth-reject", authId: authReject[1] };
  }

  const nodeRegister = trimmed.match(
    /headscale\s+nodes?\s+register\s+.*?--user\s+([^\s]+).*?--key\s+([A-Za-z0-9:_-]+)/i,
  ) || trimmed.match(
    /headscale\s+nodes?\s+register\s+.*?--key\s+([A-Za-z0-9:_-]+).*?--user\s+([^\s]+)/i,
  );
  if (nodeRegister) {
    if (/--user\s+[^\s]+\s+.*?--key/i.test(trimmed)) {
      return { kind: "node-register", user: nodeRegister[1], key: nodeRegister[2] };
    }
    return { kind: "node-register", key: nodeRegister[1], user: nodeRegister[2] };
  }

  // Bare auth-id / key paste
  return { kind: "raw", value: trimmed };
}

/** Zero-value timestamps Headscale used historically for "no expiry". */
export function isNullExpiry(expiry?: string | null): boolean {
  if (!expiry) return true;
  return (
    expiry === "0001-01-01T00:00:00Z" ||
    expiry.startsWith("0001-01-01") ||
    expiry === "null"
  );
}
