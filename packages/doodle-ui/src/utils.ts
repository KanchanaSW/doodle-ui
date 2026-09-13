export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

export function cn(
  ...parts: Array<string | undefined | false | null>
): string | undefined {
  const value = parts.filter(Boolean).join(" ");
  return value.length > 0 ? value : undefined;
}
