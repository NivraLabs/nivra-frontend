export function shortenAddr(s?: string | null) {
  if (!s) return "";
  if (s.length <= 30) return s;
  return `${s.slice(0, 25)}…${s.slice(-6)}`;
}

// Formatters
export function formatNVR(value?: number) {
  if (!value) return "0 NVR";
  const converted = value / 1000000;
  return `${converted.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })} NVR`;
}

export function formatSUI(value?: number) {
  if (!value) return "0 SUI";
  const converted = value / 1_000_000_000;
  return `${converted.toLocaleString(undefined, {
    maximumFractionDigits: 7,
  })} SUI`;
}
