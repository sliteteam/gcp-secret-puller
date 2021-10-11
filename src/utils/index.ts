import { OAuth2Client } from 'google-auth-library';

export function adminAuth() {
  if (process.env.GCLOUD_ACCESS_TOKEN === undefined) {
    throw Error(
      'Missing access token, prefix your command with GCLOUD_ACCESS_TOKEN=$(gcloud auth print-access-token)'
    );
  }

  const auth = new OAuth2Client();
  auth.credentials.access_token = process.env.GCLOUD_ACCESS_TOKEN;
  return auth;
}
