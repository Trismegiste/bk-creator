var EtreKaRendering = function (charac) {
    AbstractRendering.call(this, charac)
}

EtreKaRendering.prototype = Object.create(AbstractRendering.prototype)
EtreKaRendering.prototype.constructor = EtreKaRendering

EtreKaRendering.prototype.getDocument = function () {
    return {
        content: [
            {
                table: {
                    widths: ['33%', '33%', '33%'],
                    body: [
                        [
                            this.getIdentite(),
                            {},
                            this.getMonoKa()
                        ],
                        [
                            this.getAttribut(),
                            [this.getAtoutCreation(0), this.getAtout(0)],
                            this.getCompetences(0)
                        ]
                    ]
                },
                layout: 'noBorders'
            },
            {text: 'Notes'},
            this.getAtoutDescription(0),
            this.getFightingStat()
        ],
        styles: {
            verticalAlign: {
                margin: [0, 6, 0, 0]
            }
        }
    }
}

EtreKaRendering.prototype.getIdentite = function () {
    var title = this.getTitle()
    title = title.charAt(0).toUpperCase() + title.slice(1)
            + ' '
            + this.character.name.charAt(0).toUpperCase() + this.character.name.slice(1)
    if (this.character.wildCard) {
        title += ' [J]'
    }
    return {text: title, margin: [0, 0, 0, 6], fontSize: 16, colSpan: 2}
}
