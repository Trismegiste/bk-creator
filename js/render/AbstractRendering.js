var AbstractRendering = function (charac) {
    this.character = charac;
}

AbstractRendering.prototype.getDocument = function () {
    throw 'Abstract class'
}

AbstractRendering.prototype.getDiceText = function (val) {
    var choice = ['-']
    for (var k = 4; k <= 12; k += 2) {
        choice[k] = 'd' + k
    }
    for (var k = 1; k <= 5; k++) {
        choice[12 + k] = 'd12+' + k
    }

    return choice[val]
}

AbstractRendering.prototype.getCompetencesHeader = function () {
    return listing = {
        table: {
            headerRows: 1,
            widths: ['75%', '25%'],
            body: [[{text: 'Compétences', colSpan: 2}, {}]]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5]
    }
}

AbstractRendering.prototype.getCompetences = function () {
    var listing = this.getCompetencesHeader()

    for (var k in this.character.competence) {
        var comp = this.character.competence[k]
        listing.table.body.push([comp['Compétences'], this.getDiceText(comp.value)])
    }

    return listing
}

AbstractRendering.prototype.getAtoutCreation = function () {
    var listing = {
        table: {
            headerRows: 1,
            widths: ['100%'],
            body: [['Atouts de création']]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5]
    }
    var atoutCreation = this.character.getAtoutCreation();
    for (var k in atoutCreation) {
        var atout = atoutCreation[k]
        var titre = atout['Atout']
        if (atout.hasOwnProperty('detail')) {
            titre += ' ' + atout.detail
        }
        listing.table.body.push([titre])
    }

    return listing
}

AbstractRendering.prototype.getAtout = function () {
    var listing = {
        table: {
            headerRows: 1,
            widths: ['10%', '90%'],
            body: [[{text: 'Progressions', colSpan: 2}, {}]]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5]
    }

    var progression = this.character.getProgression();
    for (var k in progression) {
        var atout = progression[k]
        var titre = atout['Atout']
        if (atout.hasOwnProperty('detail')) {
            titre += ' ' + atout.detail
        }
        var cost = this.character.getXpForEdge(atout)
        listing.table.body.push([cost.toString(), titre])
    }

    return listing
}

AbstractRendering.prototype.getHandicap = function () {
    var listing = {
        table: {
            headerRows: 1,
            widths: ['85%', '15%'],
            body: [[{text: 'Handicaps', colSpan: 2}, {}]]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5]
    }

    for (var k in this.character.handicap) {
        var item = this.character.handicap[k]
        listing.table.body.push([item['Handicap'], item.value.substr(0, 3)])
    }

    return listing
}

AbstractRendering.prototype.getAttribut = function () {
    var listing = {
        table: {
            headerRows: 1,
            widths: ['75%', '25%'],
            body: [
                [{text: 'Attributs', colSpan: 2}, {}]
            ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5]
    }
    for (var key in this.character.attribute) {
        var attr = this.character.attribute[key]
        listing.table.body.push([key, this.getDiceText(attr)])
    }

    return listing
}

AbstractRendering.prototype.getPuce = function (nb) {
    var tab = []
    for (var k = 1; k <= 4; k++) {
        var idx = (k <= nb) ? 1 : 0
        tab.push({
            image: SwCharman.assetManager.get('puce-' + idx),
            fit: [10, 10]
        })
    }

    return {
        table: {
            body: [tab]
        },
        layout: 'noBorders'
    }
}

AbstractRendering.prototype.getAtoutDescription = function () {
    var listing = []
    // remove duplicate
    var reducedAtoutList = []
    var alreadyStacked = []
    for (var k in this.character.atout) {
        var atout = this.character.atout[k]
        if (-1 === alreadyStacked.indexOf(atout['Atout'])) {
            alreadyStacked.push(atout['Atout'])
            reducedAtoutList.push(atout)
        }
    }

    reducedAtoutList.sort(function (a, b) {
        return a.titre > b.titre
    })

    listing.push('ATOUTS ')
    for (var k in reducedAtoutList) {
        var atout = reducedAtoutList[k]
        listing.push({text: atout['Atout'] + ' ', bold: true})
        if (atout.hasOwnProperty('Prérequis')) {
            listing.push('(' + atout['Prérequis'] + ') ')
        }
        listing.push(atout['Effets'] + ' / ')
    }

    return {text: listing, fontSize: 8}
}

AbstractRendering.prototype.getHandicapDescription = function () {
    var listing = []
    // remove duplicate
    var reducedList = []
    var alreadyStacked = []
    for (var k in this.character.handicap) {
        var handi = this.character.handicap[k]
        if (-1 === alreadyStacked.indexOf(handi['Handicap'])) {
            alreadyStacked.push(handi['Handicap'])
            reducedList.push(handi)
        }
    }

    reducedList.sort(function (a, b) {
        return a.titre > b.titre
    })

    listing.push('HANDICAP ')
    for (var k in reducedList) {
        var handi = reducedList[k]
        listing.push({text: handi['Handicap'] + ' ', bold: true})
        listing.push(handi['Effets'] + ' / ')
    }

    return {text: listing, fontSize: 8}
}

AbstractRendering.prototype.getFightingStat = function () {
    return  [
        {
            table: {
                headerRows: 1,
                widths: ['25%', '25%', '25%', '25%'],
                body: [
                    [
                        'Attaque 1',
                        'Dégâts 1',
                        'Attaque 2',
                        'Dégâts 2'
                    ],
                    [
                        this.character.attack[0],
                        this.character.damage[0],
                        this.character.attack[1],
                        this.character.damage[1]
                    ]
                ]
            },
            layout: 'lightHorizontalLines',
            margin: [0, 5]
        },
        {
            table: {
                headerRows: 1,
                widths: ['33%', '34%', '33%'],
                body: [
                    [
                        'Parade',
                        'Esquive',
                        'Résistance'
                    ],
                    [
                        this.character.toHit,
                        this.character.toShoot,
                        this.character.toughness
                    ]
                ]
            },
            layout: 'lightHorizontalLines',
            margin: [0, 5]
        },
        {
            text: this.character.detailedNote,
            pageBreak: 'after'
        }
    ]
}
