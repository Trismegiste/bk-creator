/*
 * Template for Character
 */
var CharacterBuilder = function (data) {
    this.atoutList = data
    var self = this
    this.typeList = {
        vampire: {title: 'Vampire', build: function (c) {
                c.type = 'vampire'
            }
        },
        humain: {title: 'Humain', build: function (c) {
                c.type = 'humain'
                c.vampiricPower = []
            }
        }
    }
}

CharacterBuilder.prototype.getTemplate = function () {
    return this.typeList
}

CharacterBuilder.prototype.build = function (templateName, charac) {
    this.typeList[templateName].build(charac)
}

CharacterBuilder.prototype.findAtoutByName = function (name) {
    for (var idx in this.atoutList) {
        var atout = this.atoutList[idx]
        if (atout.titre === name) {
            return atout
        }
    }

    throw new Error('Cannot find atout ' + name)
}
