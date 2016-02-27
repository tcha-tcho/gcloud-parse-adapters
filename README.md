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

### S3Adapter constructor options

``` 
new S3Adapter(projectId, secretKey, bucket, options)
```

Required:

**projectId**: The project ID from the Google Developer's Console. E.g. 'purple-grape-123'.

```options ``` is a Javascript object (map) that can contain:

**keyFilename** Full path to the a .json, .pem, or .p12 key downloaded from the Google Developers Console. NOTE: .pem and .p12 require you to specify config.email as well.

**bucketPrefix**: create all the files with the specified prefix added to the filename. Can be used to put all the files for an app in a folder with 'folder/'. Default: ''

**directAccess**: whether reads are going directly to S3 or proxied through your Parse Server. Default: false

**email**: Account email address. Required when using a .pem or .p12 keyFilename.

**credentials**: Credentials object.

**autoRetry**: Automatically retry requests if the response is related to rate limits or certain intermittent server errors. We will exponentially backoff subsequent requests by default. (default: true)

**maxRetries**: Maximum number of automatic retries attempted before returning the error. (default: 3)


Learn more about Google Cloud Storage for Node.js [here][more].

[storagesetup]: https://cloud.google.com/storage/docs/signup
[more]: https://googlecloudplatform.github.io/gcloud-node/#/docs/v0.28.0/storage
