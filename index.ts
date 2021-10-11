import { getSecrets } from './src/puller';
import { dotenv } from './src/formatter/dotenv';
import yaml from 'js-yaml';

(async () => {
  if (process.argv.length < 3) {
    throw new Error('Usage: gcp-secret-puller secrets.yml (dotenv|yaml|json)');
  }
  const secrets = await getSecrets(process.argv[2]);
  if (process.argv[3] === 'dotenv') {
    dotenv(secrets);
  } else if (process.argv[3] === 'yaml') {
    console.log(yaml.dump(secrets));
  } else {
    console.log(JSON.stringify(secrets, null, 2));
  }
})();
