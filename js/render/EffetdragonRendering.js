var EffetdragonRendering = function (charac) {
    if (charac.type !== 'effetdragon') {
        throw 'Bad type of ' + charac.name
    }
    EtreKaRendering.call(this, charac)
}

EffetdragonRendering.prototype = Object.create(EtreKaRendering.prototype)
EffetdragonRendering.prototype.constructor = EffetdragonRendering

EffetdragonRendering.prototype.getTitle = function () {
    var ka = this.character.uniqueKa.ka
    switch (ka) {
        case 'lune-noire':
            return 'entité'
        case 'orichalque':
            return 'daïmon'
        default:
            return 'effet-dragon'
    }
}