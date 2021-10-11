# gcp secret puller

This tool just pull google cloud secret with your current user permissions and convert them to the requested format.

The definition file should look like this: 

```
postgresql:
  api:
    password:
      gcloudSecretPath:
        project: development
        name: postgresql-api-password
        version: 1
    user:
      gcloudSecretPath:
        project: development
        name: postgresql-api-user
        version: 1
```

`GCLOUD_ACCESS_TOKEN=$(gcloud auth print-access-token) gcp-secret-puller secrets.yml dotenv`