export function getVersionKey(version?: string): string {
  if (!version) return "v0.26";
  return `v${version.split(".").slice(0, 2).join(".")}`;
}

export function isV026OrHigher(version?: string): boolean {
  const key = getVersionKey(version).replace(/^v/, "");
  const [major, minor] = key.split(".").map((part) => Number(part));
  if (!Number.isFinite(major) || !Number.isFinite(minor)) return true;
  return major > 0 || minor >= 26;
}

export function isV028OrHigher(version?: string): boolean {
  const key = getVersionKey(version).replace(/^v/, "");
  const [major, minor] = key.split(".").map((part) => Number(part));
  if (!Number.isFinite(major) || !Number.isFinite(minor)) return false;
  return major > 0 || minor >= 28;
}
