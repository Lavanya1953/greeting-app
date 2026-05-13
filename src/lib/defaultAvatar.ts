/** Default faces when no photo is uploaded (`public/pics/`). */
const FILES = ["avatar-1.svg", "avatar-2.svg", "avatar-3.svg", "avatar-4.svg"] as const;

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function defaultAvatarFromSeed(seed: string): string {
  const i = hashString(seed || "guest") % FILES.length;
  const base = import.meta.env.BASE_URL;
  return `${base}pics/${FILES[i]}`;
}

export function defaultAvatarUrls(): readonly string[] {
  const base = import.meta.env.BASE_URL;
  return FILES.map((f) => `${base}pics/${f}`);
}
