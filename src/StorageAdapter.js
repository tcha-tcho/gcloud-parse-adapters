'use strict';

import * as path from 'path';
import * as fs from 'streamifier';
import {FilesAdapter} from 'parse-server/lib/Adapters/Files/FilesAdapter';

export class StorageAdapter extends FilesAdapter {

  constructor(
    projectId,
    bucket,
    {
      configurations = {},
      bucketPrefix = '',
      directAccess = false } = {}) {

      super();

      var gcsOptions = Object.assign(configurations, {projectId: projectId});
      var gcloud = require('google-cloud').storage(gcsOptions)

      this._gcs = gcloud;
      this._bucket = this._gcs.bucket(bucket);
      this._bucketName = bucket;
      this._bucketPrefix = bucketPrefix;
      this._projectId = projectId;
      this._directAccess = directAccess;
      this._configurations = configurations;
  }

  createFile(filename, data, contentType) {

    let params = {
      destination: this._bucketPrefix + filename
      ,metadata: {
        contentType: contentType || 'application/octet-stream'
      }    
    };


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

  deleteFile(filename) {

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

  getFileData(filename) {

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

export default StorageAdapter;
