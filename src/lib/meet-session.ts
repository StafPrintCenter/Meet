/** Identité locale du participant (nom d'affichage, email, préférences), sans backend. */
export type LocalIdentity = {
  displayName: string;
  email?: string;
  micOn: boolean;
  camOn: boolean;
  audioDeviceId?: string;
  videoDeviceId?: string;
};

const KEY = "spc-meet-identity";

export function readIdentity(): LocalIdentity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalIdentity) : null;
  } catch {
    return null;
  }
}

export function writeIdentity(identity: LocalIdentity) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(identity));
  } catch {
    /* stockage indisponible */
  }
}

export function clearIdentity() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export const isStafEmail = (email: string) => /@stafprint\.com$/i.test(email.trim());
