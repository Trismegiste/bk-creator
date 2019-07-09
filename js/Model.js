/*
 * Model for this SPA
 */

var Model = function () {
    riot.observable(this);
    this.characterList = [];  // Array of Character
    this.cloudList = [];  // Array of Character from Cloud
    this.current = new Character();
    var self = this;

    // event
    this.on('reset', function () {
        self.current = new Character()
    })
}

Model.prototype = {
    clone: function (obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj)
            return obj;

        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            var copy = Object.create(obj);
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    },
    findByName: function (name) {
        var idx = this.findIdxByName(name)
        if (idx !== -1) {
            return this.cloudList[idx]
        }

        return null
    },
    findIdxByName: function (name) {
        var pc
        for (var idx in this.cloudList) {
            pc = this.cloudList[idx]
            if (pc.name === name) {
                return idx
            }
        }

        return -1
    },
    createFrom: function (json) {
        return Object.assign(new Character, json)
    },
    importFromJson: function (rows) {
        rows.sort(function (a, b) {
            var c = a.type.localeCompare(b.type)
            if (c === 0) {
                c = a.name.localeCompare(b.name)
            }

            return c
        })

        this.cloudList = []
        for (var idx in rows) {
            var pc = this.createFrom(rows[idx])
            this.cloudList.push(pc)
        }
    }
}