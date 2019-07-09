/*
 * Repository for Character
 */

var Repository = function () {
    this.cnx = new Dexie("bk-creator");
    this.cnx.version(1).stores({
        character: 'name',
        current: '++'
    });

    this.cnx.open().catch(function (e) {
        alert("Open failed: " + e);
    });

    this.cnx.character.mapToClass(Character);
    this.cnx.current.mapToClass(Character);
};

Repository.prototype.findByPk = function (pk) {
    return this.cnx.character.get(pk);
};

Repository.prototype.deleteByPk = function (pk) {
    return this.cnx.character.delete(pk);
};


Repository.prototype.findAll = function () {
    return this.cnx.character.toArray();
};

Repository.prototype.persist = function (character) {
    return this.cnx.character.put(character)
};

Repository.prototype.reset = function (character) {
    return this.cnx.character.clear()
}

Repository.prototype.saveCurrent = function (arr) {
    var self = this;
    self.cnx.current.clear()
    arr.forEach(function (item) {
        self.cnx.current.add(item)
                .then(function () {
                    console.log('success');
                })
                .catch(function (error) {
                    console.log("Ooops: " + error);
                });
    });
}

Repository.prototype.loadCurrent = function () {
    return this.cnx.current.toArray()
}

Repository.prototype.createFromDump = function (str) {
    var self = this;
    try {
        var dataset = JSON.parse(str);
        this.cnx.character.clear();
        dataset.forEach(function (item, idx) {
            self.cnx.character.add(item)
                    .then(function () {
                        console.log('success');
                    })
                    .catch(function (error) {
                        console.log("Ooops: " + error);
                    });
        })
    } catch (e) {
        console.log("parse error")
    }
}

Repository.prototype.create = function () {
    return new Character()
}