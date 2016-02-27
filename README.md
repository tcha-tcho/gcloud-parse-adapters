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
    "BUCKET_NAME",
    {
      configurations: {keyFilename: 'GCLOUD_KEY_FILE'}
      directAccess: true
    }
  ), 
  ...
});
```

### StorageAdapter constructor options

``` 
new StorageAdapter(projectId, bucket, options)
```

Required:


- **projectId**: The project ID from the Google Developer's Console. E.g. 'purple-grape-123'.
- **bucket**: the name of your Google Storage bucket.



```options ``` is a Javascript object (map) that can contain:


- **configurations**: Google Cloud Configurations Object. [Learn more][config]

- **bucketPrefix**: create all the files with the specified prefix added to the filename. Can be used to put all the files for an app in a folder with 'folder/'. Default: ''

- **directAccess**: whether reads are going directly to Google Cloud Storage or proxied through your Parse Server. Default: false



Learn more about Google Cloud Storage for Node.js [here][more].

[storagesetup]: https://cloud.google.com/storage/docs/signup
[more]: https://googlecloudplatform.github.io/gcloud-node/#/docs/v0.28.0/storage
[config]: https://googlecloudplatform.github.io/gcloud-node/#/docs/v0.28.0/gcloud
