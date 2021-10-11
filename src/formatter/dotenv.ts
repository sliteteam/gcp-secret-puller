export function dotenv(secrets: Record<string, string | unknown>, prefix = '') {
  for (const [secretName, secretValue] of Object.entries(secrets)) {
    if (typeof secretValue === 'string') {
      console.log(`${prefix}${secretName.toUpperCase()}=${secretValue}`);
    } else {
      dotenv(
        secretValue as Record<string, string | unknown>,
        `${secretName.toUpperCase()}_`
      );
    }
  }
}
