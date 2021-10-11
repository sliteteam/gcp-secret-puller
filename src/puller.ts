import yaml from 'js-yaml';
import fs from 'fs';
import { adminAuth } from './utils';
import { google } from 'googleapis';

export type SecretDefinition = {
  gcloudSecretPath: {
    name: string;
    project: string;
    version: string;
  };
};

export type SecretsDefinition = {
  [key: string]: SecretDefinition | SecretsDefinition;
};

function isSecretsDefinition(
  value: SecretDefinition | SecretsDefinition
): value is SecretsDefinition {
  return Boolean(value) && !value.gcloudSecretPath;
}

async function extractSecrets(secretsDefinitions: SecretsDefinition) {
  const secrets: Record<string, unknown> = {};
  for (const [secretName, secretDefinition] of Object.entries(
    secretsDefinitions
  )) {
    if (isSecretsDefinition(secretDefinition)) {
      secrets[secretName] = await extractSecrets(secretDefinition);
    } else {
      const { gcloudSecretPath } = secretDefinition;
      const auth = adminAuth();
      const secretmanager = google.secretmanager({
        version: 'v1',
        auth,
      });

      const secret = await secretmanager.projects.secrets.versions.access({
        name: `projects/${gcloudSecretPath.project}/secrets/${gcloudSecretPath.name}/versions/${gcloudSecretPath.version}`,
      });

      if (secret.data.payload && secret.data.payload.data) {
        const secretValue = Buffer.from(
          secret.data.payload.data,
          'base64'
        ).toString('utf-8');
        secrets[secretName] = secretValue;
      }
    }
  }
  return secrets;
}

export async function getSecrets(secretYaml: string) {
  const secretsDefinitions: SecretsDefinition = yaml.safeLoad(
    fs.readFileSync(secretYaml, 'utf8')
  ) as SecretsDefinition;
  const secrets = await extractSecrets(secretsDefinitions);

  return secrets;
}
