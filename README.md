# Google Cloud Parse Adapters
Parse Server adapters for the Google Cloud Platform.

### Installation

```sh
$ npm i gcloud-parse-adapters
```

## Google Cloud Storage

Note: You need to [setup][storagesetup] a Google Cloud Storage account to get started.

### Parse Setup

```js
...
var StorageAdapter = require('gcloud-parse-adapters').StorageAdapter;

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '',
  ...
  filesAdapter: new StorageAdapter(
    "GCLOUD_PROJECT_ID",
    "GCLOUD_KEY_FILE",
    "BUCKET_NAME",
    {directAccess: true}
  ), 
  ...
});
```

[storagesetup]: https://cloud.google.com/storage/docs/signup
