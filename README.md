# Google Cloud Parse Adapters
Parse Server adapters for the Google Cloud Platform.

### Installation

```sh
$ npm i gcloud-parse-adapters
```

### Google Cloud Storage

```sh
var StorageAdapter = require('gcloud-parse-adapters').StorageAdapter;

var adapter = new StorageAdapter(
  'myProjectId',
  '/key.json',
  'myBucketName',
  {directAccess: true}
);

```
