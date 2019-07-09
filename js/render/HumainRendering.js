var HumainRendering = function (charac) {
    if (charac.type !== 'humain') {
        throw 'Bad type of ' + charac.name
    }
    AbstractRendering.call(this, charac)
}

HumainRendering.prototype = Object.create(AbstractRendering.prototype)
HumainRendering.prototype.constructor = HumainRendering

HumainRendering.prototype.getDocument = function () {
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
                            [this.getHandicap(0), this.getAtoutCreation(0)],
                            this.getCompetences(0)
                        ],
                        [
                            this.getAtout(0),
                            {text: ''},
                            {text: ''}
                        ]
                    ]
                },
                layout: 'noBorders'
            },
            {text: 'Notes'},
            this.getHandicapDescription(0),
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

HumainRendering.prototype.getIdentite = function () {
    var title = 'Humain '
            + this.character.name.charAt(0).toUpperCase() + this.character.name.slice(1)
    if (this.character.wildCard) {
        title += ' [J]'
    }
    return {text: title, margin: [0, 0, 0, 6], fontSize: 16, colSpan: 2}
}