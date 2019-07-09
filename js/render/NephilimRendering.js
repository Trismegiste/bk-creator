var NephilimRendering = function (charac) {
    if (charac.type !== 'nephilim') {
        throw 'Bad type of ' + charac.name
    }
    AbstractRendering.call(this, charac)

    this.prefix = {
        'feu': 'pyr',
        'eau': 'hydr',
        'terre': 'faër',
        'lune': 'onir',
        'air': 'éol'
    }
}

NephilimRendering.prototype = Object.create(AbstractRendering.prototype)
NephilimRendering.prototype.constructor = NephilimRendering

NephilimRendering.prototype.getDocument = function () {
    return {
        content: [
            {
                table: {
                    widths: ['33%', '33%', '33%'],
                    body: [
                        [
                            {colSpan: 2, stack: [
                                    this.getIdentite(),
                                    {ul: this.getHistoire(), fontSize: 10}
                                ]
                            },
                            {},
                            this.getPentacle()
                        ],
                        [
                            this.getCompetences(0),
                            [
                                this.getAtoutCreation(0),
                                this.getHandicap(0),
                                this.getAspect()
                            ],
                            this.getAtout(0)
                        ]
                    ]
                },
                layout: 'noBorders'
            },
            {
                table: {
                    widths: ['33%', '33%', '33%'],
                    body: [
                        [
                            {colSpan: 2, text: 'Simulacre', margin: [0, 6, 0, 6], fontSize: 16},
                            {},
                            this.getMonoKa()
                        ],
                        [
                            this.getAttribut(),
                            [this.getHandicap(1), this.getAtoutCreation(1)],
                            this.getCompetences(1)
                        ],
                        [
                            this.getAtout(1),
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
            this.getHandicapDescription(1),
            this.getAtoutDescription(1),
            this.getFightingStat()
        ],
        styles: {
            verticalAlign: {
                margin: [0, 6, 0, 0]
            }
        }
    }
}

NephilimRendering.prototype.getIdentite = function () {
    var title = this.getTitle()
    title = title.charAt(0).toUpperCase() + title.slice(1)
            + ' '
            + this.character.name.charAt(0).toUpperCase() + this.character.name.slice(1)
    if (this.character.wildCard) {
        title += ' [J]'
    }
    return {text: title, margin: [0, 6, 0, 6], fontSize: 16}
}

NephilimRendering.prototype.getHistoire = function () {
    var view = [];
    for (var key in this.character.incarnation) {
        var periode = this.character.incarnation[key];
        view.push(periode['Période'] + ': ' + periode.Titre)
    }
    return view
}

NephilimRendering.prototype.getAspect = function () {
    var meta = this.character.metamorphe;
    if (!meta.nom) {
        throw new Error('Métamorphe indéfini pour ' + this.character.name)
    }
    var rm = Math.floor(this.character.pentacle.initiation / 2) + 2
    var asp = 12 - rm

    var listing = {
        table: {
            headerRows: 1,
            widths: ['70%', '30%'],
            body: [
                [{text: 'Métamorphe', colSpan: 2}, {}],
                [meta.nom, meta.humeur],
                ['Aspect', asp.toString()],
                ['Résist. magique', rm.toString()]
            ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 5]
    }

    return listing
}

NephilimRendering.prototype.getTitle = function () {
    return this.prefix[this.character.pentacle.dominant] + 'im'
}

NephilimRendering.prototype.getPentacle = function () {
    var pentacle = this.character.pentacle
    var equi = SwCharman.model.getEquilibreFor(pentacle.dominant)
    // on cherche le neutre defav à partir du neutre fav
    var idx = equi.neutre.indexOf(pentacle.neutreFav) // 0 ou 1
    // si 0 => 1, si 1 => 0
    pentacle.neutreDefav = equi.neutre[1 - idx]
    // on cherche l'opposé mineur
    idx = equi.oppose.indexOf(pentacle.opposeMaj) // 0 ou 1
    pentacle.opposeMin = equi.oppose[1 - idx]

    // for the table :
    var kadom = [
        pentacle.dominant,
        pentacle.neutreFav,
        pentacle.neutreDefav,
        pentacle.opposeMin,
        pentacle.opposeMaj
    ]

    var tablePuce = this.getPuce(pentacle.puce)
    tablePuce.colSpan = 2
    tablePuce.margin = [2, 0, 0, 0]

    return {
        table: {
            body: [
                [
                    '',
                    {
                        image: SwCharman.assetManager.get(kadom[0]),
                        fit: [30, 30]
                    },
                    {text: this.getDiceText(pentacle.initiation), alignment: 'left', style: 'verticalAlign'},
                    ''
                ],
                [
                    {text: "+1", alignment: 'right', style: 'verticalAlign'},
                    {
                        image: SwCharman.assetManager.get(kadom[1]),
                        fit: [30, 30]
                    },
                    {
                        image: SwCharman.assetManager.get(kadom[2]),
                        fit: [30, 30]
                    },
                    {text: "+2", alignment: 'left', style: 'verticalAlign'}
                ],
                [
                    {text: "+3", alignment: 'right', style: 'verticalAlign'},
                    {
                        image: SwCharman.assetManager.get(kadom[3]),
                        fit: [30, 30]
                    },
                    {
                        image: SwCharman.assetManager.get(kadom[4]),
                        fit: [30, 30]
                    },
                    {text: "+4", alignment: 'left', style: 'verticalAlign'}
                ],
                ['', tablePuce, {}, '']
            ]
        },
        layout: 'noBorders'
    }
}

NephilimRendering.prototype.getCompetences = function (group) {
    var listing = this.getCompetencesHeader()

    for (var k in this.character.competence[group]) {
        var comp = this.character.competence[group][k]
        var libelle = comp.title
        if (comp.meta === this.character.pentacle.dominant) {
            libelle = {text: libelle, bold: true}
        }
        listing.table.body.push([libelle, this.getDiceText(comp.value)])
    }

    return listing
}