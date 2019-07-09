/*
 * Google drive wrapper
 */

var GoogleDrive = function (param) {
    riot.observable(this);

    this.DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
    this.SCOPES = 'https://www.googleapis.com/auth/drive';
    this.clientId = param.clientId
    this.appId = param.appId
    this.apiKey = param.apiKey
    this.maxPerPage = 256
}

GoogleDrive.prototype.connect = function () {
    var self = this

    return new Promise(function (fulfill, reject) {
        gapi.load('client:auth2:picker', function () {
            gapi.client.init({
                discoveryDocs: self.DISCOVERY_DOCS,
                clientId: self.clientId,
                scope: self.SCOPES,
                apiKey: self.apiKey
            }).then(function () {
                if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    console.log('OAuth process with popup')
                    return gapi.auth2.getAuthInstance().signIn()
                } else {
                    return new Promise(function (f, r) {
                        console.log('already logged')
                        f()
                    })
                }
            }).then(function () {
                if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                    fulfill()
                } else {
                    reject()
                }
            })
        })
    })

}

GoogleDrive.prototype.isTokenExpired = function () {
    return (Date.now() > gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().expires_at)
}

GoogleDrive.prototype.refreshToken = function () {
    return gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse()
}

GoogleDrive.prototype.getAccessToken = function () {
    return gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token
}

GoogleDrive.prototype.isSignedIn = function () {
    return gapi.auth2 && gapi.auth2.getAuthInstance().isSignedIn.get()
}

GoogleDrive.prototype.pickOneFolder = function () {
    var self = this

    return new Promise(function (fulfill, reject) {

        var docsView = new google.picker.DocsView()
                .setIncludeFolders(true)
                .setMimeTypes('application/vnd.google-apps.folder')
                .setSelectFolderEnabled(true)

        var picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .setAppId(self.appId)
                .setOAuthToken(self.getAccessToken())
                .addView(docsView)
                .setCallback(function (res) {
                    console.log(res)
                    if (res.action === 'picked') {
                        fulfill(res.docs[0])
                    }
                    if (res.action === 'cancel') {
                        reject(res)
                    }
                })
                .build()

        picker.setVisible(true)
    })
}

GoogleDrive.prototype.pickOneFile = function (mimeFilter) {
    var argggg = this

    return new Promise(function (fulfill, reject) {

        var docsView = new google.picker.DocsView()
                .setMimeTypes(mimeFilter)

        var picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .setAppId(argggg.appId)
                .setOAuthToken(argggg.getAccessToken())
                .addView(docsView)
                .setCallback(function (res) {
                    console.log(res)
                    if (res.action === 'picked') {
                        fulfill(res.docs[0])
                    }
                    if (res.action === 'cancel') {
                        reject(res)
                    }
                })
                .build()

        picker.setVisible(true)
    })
}

GoogleDrive.prototype.listing = function (folderId, filterOnType) {
    var query = "'" + folderId + "' in parents and trashed=false"
    if (filterOnType !== undefined) {
        query += " and mimeType='" + filterOnType + "'"
    }
    return gapi.client.drive.files.list({
        pageSize: this.maxPerPage,
        fields: "nextPageToken, files(id, name, parents, modifiedTime)",
        q: query
    })
}

GoogleDrive.prototype.saveFile = function (fileName, contentType, content, rootId) {
    var self = this

    return gapi.client.drive.files.list({
        pageSize: 1,
        fields: "files(id)",
        q: "'" + rootId
                + "' in parents and trashed=false and name='"
                + fileName + "' and mimeType='"
                + contentType + "'"
    }).then(function (rsp) {
        if (rsp.result.files.length === 1) {
            console.log(fileName + ' existed, id=' + rsp.result.files[0].id)
            return new Promise(function (f, r) {
                f(rsp.result.files[0].id)
            })
        } else {
            console.log('Creating ' + fileName)
            return self.createFile(fileName, rootId)
        }
    }).then(function (id) {
        console.log('Updating ' + id)
        return self.updateContent(id, contentType, content)
    })
}

GoogleDrive.prototype.createFile = function (fileName, rootId) {
    var metadata = {
        resource: {
            name: fileName,
            parents: [rootId]
        },
        fields: 'id'
    }
    if (this.icon !== undefined) {
        metadata.resource.contentHints = {thumbnail: this.icon}
    }
    return new Promise(function (fulfill, reject) {
        gapi.client.drive.files.create(metadata).then(function (rsp) {
            fulfill(rsp.result.id)
        }, reject)
    })
}

GoogleDrive.prototype.updateContent = function (id, contentType, content) {
    return new Promise(function (fulfill, reject) {
        gapi.client.request({
            path: '/upload/drive/v3/files/' + id,
            method: 'PATCH',
            params: {
                uploadType: 'media'
            },
            headers: {'Content-Type': contentType},
            body: content
        }).then(fulfill, reject)
    })
}

GoogleDrive.prototype.setIcon = function (thumb) {
    this.icon = thumb
}
