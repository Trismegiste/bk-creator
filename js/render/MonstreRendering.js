var MonstreRendering = function (charac) {
    if (charac.type !== 'monstre') {
        throw 'Bad type of ' + charac.name
    }
    AbstractRendering.call(this, charac)
}

MonstreRendering.prototype = Object.create(AbstractRendering.prototype)
MonstreRendering.prototype.constructor = MonstreRendering

MonstreRendering.prototype.getDocument = function () {
    return {
        content: [
            {
                table: {
                    widths: ['33%', '33%', '33%'],
                    body: [
                        [
                            this.getIdentite(),
                            {},
                            {}
                        ],
                        [
                            this.getAttribut(),
                            this.getAtout(),
                            this.getCompetences()
                        ],
                        [
                            this.getPouvoir(),
                            {},
                            {}
                        ]
                    ]
                },
                layout: 'noBorders'
            },
            {text: 'Notes'},
            this.getAtoutDescription(),
            this.getFightingStat()
        ],
        styles: {
            verticalAlign: {
                margin: [0, 6, 0, 0]
            }
        }
    }
}

MonstreRendering.prototype.getIdentite = function () {
    var title = 'Monstre '
            + this.character.name.charAt(0).toUpperCase() + this.character.name.slice(1)
    if (this.character.wildCard) {
        title += ' [J]'
    }
    return {text: title, margin: [0, 0, 0, 6], fontSize: 16, colSpan: 3}
}

MonstreRendering.prototype.getPouvoir = function () {
    var listing = {
        table: {
            headerRows: 1,
            widths: ['90%', '10%'],
            body: [[{text: 'Pouvoirs', colSpan: 2}, {}]]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5]
    }

    var pouvoir = this.character.freeformPower
    for (var k in pouvoir) {
        var item = pouvoir[k]
        listing.table.body.push([item.title, item.cost])
    }

    return listing
}
