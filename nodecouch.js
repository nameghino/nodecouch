var http = require('http');

var CouchDB = function(host, db, port) {
    if (typeof(port) === 'undefined') { port = 5984; }
    this.host = host;
    this.db = db;
    this.port = port;
}

CouchDB.prototype.createRequest = function(options, callback) {
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var d = ""
        res.on('data', function(c) {
            d += c;
        });

        res.on('end', function() {
            var o = JSON.parse(d);
            callback(null, o);
        });

        res.on('error', function(e) {
            console.log('error');
            callback(e, null);
        });
    });

    req.on('error', function(e) {
        callback(e, null);
    });

    return req;
};

CouchDB.prototype.createDocumentRequest = function(key, method, callback) {
    var options = {
        host: this.host,
        port: Number(this.port),
        method: method,
        path: '/' + this.db + '/' + key,
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', }
    }

    return this.createRequest(options, callback);
};

CouchDB.prototype.createDatabase = function(callback) {
    var options = {
        host: this.host,
        port: Number(this.port),
        method: 'PUT',
        path: '/' + this.db,
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', }
    }

    var req = this.createRequest(options, function(err, res) {
        if (res.ok) { callback(true); return; }
        callback(err);
    });

    req.end();
}

CouchDB.prototype.storeDocument = function(key, obj, callback) {
    this.updateDocument(key, obj, null, callback);
}

CouchDB.prototype.updateDocument = function(key, obj, baseRevision, callback) {
    if (baseRevision != null) {
        obj['_rev'] = baseRevision;
    }

    var jsonString = JSON.stringify(obj);
    var req = this.createDocumentRequest(key, 'PUT', callback);
    req.write(jsonString);
    req.end();
};

CouchDB.prototype.loadDocument = function(key, callback) {
    var request = this.createDocumentRequest(key, 'GET', callback);
    request.end();
};


CouchDB.prototype.allDocuments = function(callback) {
    var request = this.createDocumentRequest('_all_docs', 'GET', callback);
    request.end();
}

/*
CouchDB.prototype.deleteLatest = function(key, callback) {
    this.loadDocument(key, function(err, obj) {
        if (err) { callback(err, null); return; }
        this.deleteObject(obj, callback);
    });
};
*/

CouchDB.prototype.deleteObject = function(o, callback) { 
    this.deleteDocument(o._id, o._rev, callback); 
}

CouchDB.prototype.deleteDocument = function(key, revision, callback) {
    var request = this.createDocumentRequest(key, 'DELETE', callback);
    request.setHeader('If-Match', revision);
    request.end();
};

module.exports = CouchDB