var KabbaleRendering = function (charac) {
    if (charac.type !== 'kabbale') {
        throw 'Bad type of ' + charac.name
    }
    EtreKaRendering.call(this, charac)
}

KabbaleRendering.prototype = Object.create(EtreKaRendering.prototype)
KabbaleRendering.prototype.constructor = KabbaleRendering

KabbaleRendering.prototype.getTitle = function () {
    return 'sceau'
}