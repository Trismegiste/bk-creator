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
                            {},
                            this.getCompetences()
                        ],
                        [
                            this.getAtout(),
                            this.getPouvoir(),
                            {text: ''}
                        ]
                    ]
                },
                layout: 'noBorders'
            },
            {text: 'Notes'},
            this.getHandicapDescription(),
            this.getAtoutDescription(),
            this.getPouvoirDescription(),
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
    return {text: title, margin: [0, 0, 0, 6], fontSize: 16, colSpan: 2}
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

    var pouvoir = this.character.vampiricPower
    for (var k in pouvoir) {
        var item = pouvoir[k]
        var titre = item['Pouvoir vampirique']
        listing.table.body.push([titre, item.value])
    }

    return listing
}

MonstreRendering.prototype.getPouvoirDescription = function () {
    var listing = []
    listing.push('POUVOIRS ')
    for (var k in this.character.vampiricPower) {
        var pouvoir = this.character.vampiricPower[k]
        listing.push({text: pouvoir['Pouvoir vampirique'] + ' ', bold: true})
        listing.push(pouvoir['Effets'] + ' / ')
    }

    return {text: listing, fontSize: 8}

}