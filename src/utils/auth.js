function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
}

export async function hashPassword(password) {
  const normalizedPassword = password.trim();

  if (globalThis.crypto?.subtle) {
    const encodedPassword = new TextEncoder().encode(normalizedPassword);
    const digest = await globalThis.crypto.subtle.digest(
      'SHA-256',
      encodedPassword
    );

    return bufferToHex(digest);
  }

  return btoa(normalizedPassword);
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  };
}
