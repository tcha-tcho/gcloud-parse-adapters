'use strict';

import * as path from 'path';
import * as fs from 'streamifier';
import {FilesAdapter} from 'parser-server';

export class GoogleCloudStorageAdapter extends FilesAdapter {

  constructor(
    projectId,
    keyFilename,
    bucket,
    { bucketPrefix = '',
      directAccess = false } = {}) {

      super();

      var gcsOptions = {
        projectId: projectId,
        keyFilename: keyFilename
      };

      var gcloud = require('gcloud')(gcsOptions);

      this._gcs = gcloud.storage();
      this._bucket = this._gcs.bucket(bucket);
      this._bucketName = bucket;
      this._bucketPrefix = bucketPrefix;
      this._projectId = projectId;
      this._directAccess = directAccess;
      this._keyFilename = keyFilename;
  }

  createFile(config, filename, data) {

    var params = Object.assign(config || {}, {destination: this._bucketPrefix + filename});

    if (this._directAccess) {
        params.metadata = params.metadata || {};

        if(!params.metadata.acl) {

          params.metadata.acl = [{
            entity: 'allUsers',
            role: this._gcs.acl.READER_ROLE
          }];
        }

    }

    return new Promise((resolve, reject) => {

      var file = this._bucket.file(params.destination);

      fs.createReadStream(data)
        .pipe(file.createWriteStream(params))
        .on('error', (err) => {
          reject(err);
        })
        .on('finish', (data) => {
          resolve(data);
        });
    });
  }

  deleteFile(config, filename) {

    var file = this._bucket.file(this._bucketPrefix + filename);

    return new Promise((resolve, reject) => {
      file.delete((err, data) => {
        if(err !== null) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  getFileData(config, filename) {

    var file = this._bucket.file(this._bucketPrefix + filename);

    return new Promise((resolve, reject) => {
      file.download(config, (err, data) => {
        if (err !== null) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  getFileLocation(config, filename) {
    if (this._directAccess) {

      var filePath = path.join(
        this._bucketName,
        this._bucketPrefix,
        filename
      );

      return 'https://storage.googleapis.com/' + filePath
    }
    return (config.mount + '/files/' + config.applicationId + '/' + encodeURIComponent(filename));
  }
}

export default GoogleCloudStorageAdapter;
