/*
 * Managing image assets
 */
var Asset = function () {
    this.listing = {}
    this.dictionary = {}
}

Asset.prototype.append = function (key, url) {
    this.listing[key] = url;
}

Asset.prototype.loadDataUrlPromise = function (key, url) {
    return new Promise(function (fulfill, reject) {
        var xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.onload = function (e) {
            if (e.target.status === 200) {
                var reader = new FileReader()
                reader.onloadend = function (e) {
                    fulfill([key, e.target.result])
                }
                reader.readAsDataURL(xhr.response)
            } else {
                reject(e)
            }
        }
        xhr.open('GET', url)
        xhr.send()
    })
}

Asset.prototype.load = function () {
    var loading = []
    for (var key in this.listing) {
        var url = this.listing[key]
        loading.push(this.loadDataUrlPromise(key, url))
    }
    var self = this

    return new Promise(function (fulfill, reject) {
        Promise.all(loading)
                .then(function (loaded) {
                    for (var k in loaded) {
                        var result = loaded[k]
                        self.dictionary[result[0]] = result[1]
                    }
                    fulfill()
                })
                .catch(function (e) {
                    var msg = 'Code ' + e.target.status + ' for ' + e.target.responseURL
                    reject(msg)
                })
    })
}

Asset.prototype.get = function (key) {
    return this.dictionary[key]
}