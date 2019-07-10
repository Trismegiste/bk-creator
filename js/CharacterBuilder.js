/*
 * Template for Character
 */
var CharacterBuilder = function (attributes, superpowers) {
    this.superpowers = superpowers
    var self = this
    this.typeList = {
        vampire: {title: 'Vampire', build: function (c) {
                c.type = 'vampire'
                c.wildCard = true
                for (var k in attributes) {
                    c.attribute[attributes[k]['Abbrev']] = 4
                }
                c.vampiricPower = [
                    self.findPowerByName('Nyctalope'),
                    self.findPowerByName('Crocs'),
                    self.findPowerByName('Régénération')
                ]
                c.deltaPC = 0
            }
        },
        humain: {title: 'Humain', build: function (c) {
                c.type = 'humain'
                c.wildCard = false
                for (var k in attributes) {
                    c.attribute[attributes[k]['Abbrev']] = 6
                }
                c.vampiricPower = []
                c.deltaPC = 2
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

CharacterBuilder.prototype.findPowerByName = function (name) {
    for (var idx in this.superpowers) {
        var row = this.superpowers[idx]
        if (row['Pouvoir vampirique'] === name) {
            var temp = SwCharman.model.clone(row)
            temp.value = temp.costConstraint[0]

            return temp
        }
    }

    throw new Error('Cannot find Power ' + name)
}
