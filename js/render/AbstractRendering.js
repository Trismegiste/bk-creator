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

AbstractRendering.prototype.getCompetences = function (group) {
    var listing = this.getCompetencesHeader()

    for (var k in this.character.competence[group]) {
        var comp = this.character.competence[group][k]
        listing.table.body.push([comp.title, this.getDiceText(comp.value)])
    }

    return listing
}

AbstractRendering.prototype.getAtoutCreation = function (group) {
    var listing = {
        table: {
            headerRows: 1,
            widths: ['100%'],
            body: [['Atouts de création']]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5]
    }
    var atoutCreation = this.character.getAtoutCreation(group);
    for (var k = 0; k < atoutCreation.length; k++) {
        console.log(k)
        var atout = atoutCreation[k]
        var titre = atout.titre
        if (atout.hasOwnProperty('detail')) {
            titre += ' ' + atout.detail
        }
        listing.table.body.push([titre])
    }

    return listing
}

AbstractRendering.prototype.getAtout = function (group) {
    var listing = {
        table: {
            headerRows: 1,
            widths: ['10%', '90%'],
            body: [[{text: 'Progressions', colSpan: 2}, {}]]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5]
    }

    var offset = this.character.getAtoutCreation(group).length;
    for (var k = offset; k < this.character.atout[group].length; k++) {
        var atout = this.character.atout[group][k]
        var titre = atout.titre
        if (atout.hasOwnProperty('detail')) {
            titre += ' ' + atout.detail
        }
        var nb = k - offset + 1;
        var cost = 5 * (nb + (nb > 16 ? nb - 16 : 0))
        listing.table.body.push([cost.toString(), titre])
    }

    return listing
}

AbstractRendering.prototype.getHandicap = function (group) {
    var listing = {
        table: {
            headerRows: 1,
            widths: ['85%', '15%'],
            body: [[{text: 'Handicaps', colSpan: 2}, {}]]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5]
    }

    for (var k in this.character.handicap[group]) {
        var item = this.character.handicap[group][k]
        listing.table.body.push([item.titre, item.value.substr(0, 3)])
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

AbstractRendering.prototype.getMonoKa = function () {
    var essence = this.character.uniqueKa
    var tablePuce = this.getPuce(essence.puce)
    tablePuce.margin = [6, 6, 0, 0]

    return {
        table: {
            body: [
                [
                    {
                        image: SwCharman.assetManager.get(essence.ka),
                        fit: [30, 30]
                    },
                    {text: this.getDiceText(essence.initiation), alignment: 'left', style: 'verticalAlign'},
                    tablePuce
                ]
            ]
        },
        layout: 'noBorders'
    }
}

AbstractRendering.prototype.getAtoutDescription = function (group) {
    var listing = []
    // remove duplicate
    var reducedAtoutList = []
    var alreadyStacked = []
    for (var k in this.character.atout[group]) {
        var atout = this.character.atout[group][k]
        if (-1 === alreadyStacked.indexOf(atout.titre)) {
            alreadyStacked.push(atout.titre)
            reducedAtoutList.push(atout)
        }
    }

    reducedAtoutList.sort(function (a, b) {
        return a.titre > b.titre
    })

    listing.push('ATOUTS ')
    for (var k in reducedAtoutList) {
        var atout = reducedAtoutList[k]
        listing.push({text: atout.titre + ' ', bold: true})
        if (atout.hasOwnProperty('prerequis')) {
            listing.push('(' + atout.prerequis + ') ')
        }
        listing.push(atout.descr + ' / ')
    }

    return {text: listing, fontSize: 8}
}

AbstractRendering.prototype.getHandicapDescription = function (group) {
    var listing = []
    // remove duplicate
    var reducedList = []
    var alreadyStacked = []
    for (var k in this.character.handicap[group]) {
        var handi = this.character.handicap[group][k]
        if (-1 === alreadyStacked.indexOf(handi.titre)) {
            alreadyStacked.push(handi.titre)
            reducedList.push(handi)
        }
    }

    reducedList.sort(function (a, b) {
        return a.titre > b.titre
    })

    listing.push('HANDICAP ')
    for (var k in reducedList) {
        var handi = reducedList[k]
        listing.push({text: handi.titre + ' ', bold: true})
        listing.push(handi.descr + ' / ')
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
                widths: ['25%', '25%', '25%', '25%'],
                body: [
                    [
                        'Parade',
                        'Esquive',
                        'Résistance',
                        'RM'
                    ],
                    [
                        this.character.toHit,
                        this.character.toShoot,
                        this.character.toughness,
                        this.character.magicToughness
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
