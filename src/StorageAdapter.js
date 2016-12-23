'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageAdapter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _streamifier = require('streamifier');

var fs = _interopRequireWildcard(_streamifier);

var _FilesAdapter2 = require('parse-server/lib/Adapters/Files/FilesAdapter');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // 'use strict';

var StorageAdapter = exports.StorageAdapter = function (_FilesAdapter) {
  _inherits(StorageAdapter, _FilesAdapter);

  function StorageAdapter(projectId, bucket) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$configurations = _ref.configurations,
        configurations = _ref$configurations === undefined ? {} : _ref$configurations,
        _ref$bucketPrefix = _ref.bucketPrefix,
        bucketPrefix = _ref$bucketPrefix === undefined ? '' : _ref$bucketPrefix,
        _ref$directAccess = _ref.directAccess,
        directAccess = _ref$directAccess === undefined ? false : _ref$directAccess;

    _classCallCheck(this, StorageAdapter);

    var _this = _possibleConstructorReturn(this, (StorageAdapter.__proto__ || Object.getPrototypeOf(StorageAdapter)).call(this));

    var gcsOptions = Object.assign(configurations, { projectId: projectId });
    var gcloud = require('google-cloud').storage(gcsOptions);

    _this._gcs = gcloud;
    _this._bucket = _this._gcs.bucket(bucket);
    _this._bucketName = bucket;
    _this._bucketPrefix = bucketPrefix;
    _this._projectId = projectId;
    _this._directAccess = directAccess;
    _this._configurations = configurations;
    return _this;
  }

  _createClass(StorageAdapter, [{
    key: 'createFile',
    value: function createFile(filename, data, contentType) {
      var _this2 = this;

      var params = {
        destination: this._bucketPrefix + filename,
        metadata: {
          contentType: contentType || 'application/octet-stream'
        }
      };

      if (this._directAccess) {
        params.metadata = params.metadata || {};

        if (!params.metadata.acl) {

          params.metadata.acl = [{
            entity: 'allUsers',
            role: this._gcs.acl.READER_ROLE
          }];
        }
      }

      return new Promise(function (resolve, reject) {

        var file = _this2._bucket.file(params.destination);

        fs.createReadStream(data).pipe(file.createWriteStream(params)).on('error', function (err) {
          reject(err);
        }).on('finish', function (data) {
          resolve(data);
        });
      });
    }
  }, {
    key: 'deleteFile',
    value: function deleteFile(filename) {

      var file = this._bucket.file(this._bucketPrefix + filename);

      return new Promise(function (resolve, reject) {
        file.delete(function (err, data) {
          if (err !== null) {
            return reject(err);
          }
          resolve(data);
        });
      });
    }
  }, {
    key: 'getFileData',
    value: function getFileData(filename) {

      var file = this._bucket.file(this._bucketPrefix + filename);

      return new Promise(function (resolve, reject) {
        file.download(config, function (err, data) {
          if (err !== null) {
            return reject(err);
          }
          resolve(data);
        });
      });
    }
  }, {
    key: 'getFileLocation',
    value: function getFileLocation(config, filename) {
      if (this._directAccess) {

        var filePath = path.join(this._bucketName, this._bucketPrefix, filename);

        return 'https://storage.googleapis.com/' + filePath;
      }
      return config.mount + '/files/' + config.applicationId + '/' + encodeURIComponent(filename);
    }
  }]);

  return StorageAdapter;
}(_FilesAdapter2.FilesAdapter);

exports.default = StorageAdapter;