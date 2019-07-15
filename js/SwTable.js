/*
 * A repository class for all SW data
 */
var SwTable = function (filename) {
    this.filename = filename
    this.data = {}
    this.categoryLabel = {'Pou': 'Pouvoir', 'Cbt': 'Combat', 'Cmd': 'Commandement', 'Soc': 'Social', 'Leg': 'Légendaire', 'Pro': 'Professionnel', 'Bak': 'Background'}
}

SwTable.prototype.enrichEdge = function () {
    var atoutListe = this.data['Atouts']

    for (var k in atoutListe) {
        var atout = atoutListe[k]

        var constraint = []
        atout['Prérequis'].split(', ').forEach(function (val) {
            // check for rank
            var check = val.match(/^(N|A|V|H|L)$/u)
            if (check !== null) {
                constraint.push({
                    type: "rank",
                    rank: check[1]
                })
                return
            }

            // check for attribute
            var checkAttr = val.match(/^(Âme|Agi|Vig|For|Int) d(4|6|8|10|12)$/u)
            if (null !== checkAttr) {
                constraint.push({
                    type: "attribute",
                    attr: checkAttr[1],
                    dice: parseInt(checkAttr[2])
                })
                return
            }

            // check for one skill
            var checkSkill = val.match(/^([\S]+) d(4|6|8|10|12)$/u)
            if (null !== checkSkill) {
                constraint.push({
                    type: "skill",
                    skill: [checkSkill[1]],
                    dice: parseInt(checkSkill[2])
                })
                return
            }

            // check for one skill or one another skill
            var checkDoubleSkill = val.match(/^([\S]+) ou ([\S]+) d(4|6|8|10|12)$/u)
            if (null !== checkDoubleSkill) {
                constraint.push({
                    type: "skill",
                    skill: [checkDoubleSkill[1], checkDoubleSkill[2]],
                    dice: parseInt(checkDoubleSkill[3])
                })
                return
            }

            // perhaps it's an edge
            for (var idx in atoutListe) {
                if (atoutListe[idx].Atout === val) {
                    constraint.push({
                        type: "edge",
                        edge: val
                    })
                }
            }
        })
        // inserting constraints in edge
        atout.constraint = constraint

        // inserting cost
        atout.advanceCost = 2
        // human label
        atout['Type'] = this.categoryLabel[atout['Type']]
    }
}

SwTable.prototype.enrichPower = function () {
    var powerList = this.data['Pouvoirs']

    for (var k in powerList) {
        var power = powerList[k]
        power.costConstraint = function (cost) {
            // check unique cost
            var check = cost.match("^(1?[0-9])$")
            if (null !== check) {
                return [parseInt(check[1])]

            }
            // check ranged cost
            check = cost.match("^([0-9]) à (1?[0-9])$")
            if (null !== check) {
                var constraint = []
                for (var k = parseInt(check[1]); k <= check[2]; k++) {
                    constraint.push(k)
                }
                return constraint
            }
            // check stepped cost
            check = cost.match("^[0-9]/")
            if (null !== check) {
                return cost.split('/')
            }

        }(power['Coût'])
    }
}

SwTable.prototype.addingAdvance = function () {
    var progress = [
        {
            Atout: 'Attribut +1TDD',
            'Type': 'Progression',
            'Prérequis': 'N',
            advanceCost: 2,
            info: true
        },
        {
            Atout: '1 Comp < Attribut +1TDD',
            'Type': 'Progression',
            'Prérequis': 'N',
            advanceCost: 1,
            info: true
        },
        {
            Atout: '2 Comp < Attribut +1TDD',
            'Type': 'Progression',
            'Prérequis': 'N',
            advanceCost: 2,
            info: true
        },
        {
            Atout: '1 Comp ≥ Attribut +1TDD',
            'Type': 'Progression',
            'Prérequis': 'N',
            advanceCost: 2,
            info: true
        }
    ]

    for (var k in progress) {
        this.data['Atouts'].push(progress[k])
    }
}

SwTable.prototype.load = function () {
    var self = this

    return new Promise(function (fulfill, reject) {

        var oReq = new XMLHttpRequest()
        oReq.addEventListener("load", function () {
            var doc = oReq.responseXML
            var xpath = "//*[name()='office:spreadsheet']/*[name()='table:table']/*[name()='table:table-row']/*[name()='table:table-cell']/*[name()='text:p']"
            var evaluator = new XPathEvaluator()
            var expression = evaluator.createExpression(xpath)
            var result = expression.evaluate(doc, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

            var lastTable = null
            var lastRow = null
            var colName = []
            var firstRow = false
            var cellIdx = 0
            var rowObj = {}
            for (var k = 0; k < result.snapshotLength; k++) {
                var cell = result.snapshotItem(k)
                var row = cell.parentNode.parentNode
                var table = row.parentNode

                if (lastTable !== table) {
                    lastTable = table
                    lastRow = row
                    firstRow = true
                    colName = []
                    self.data[table.getAttribute('table:name')] = []
                }

                if (lastRow !== row) {
                    cellIdx = 0
                    rowObj = {}
                    firstRow = false
                }

                if (firstRow) {
                    colName.push(cell.textContent)
                } else {
                    rowObj[colName[cellIdx]] = cell.textContent.trim()
                }

                lastRow = row
                lastTable = table
                cellIdx++

                if (!firstRow && (cellIdx === colName.length)) {
                    self.data[table.getAttribute('table:name')].push(rowObj)
                }
            }

            self.enrichEdge()
            self.enrichPower()
            self.addingAdvance()

            fulfill()

        })

        oReq.open("GET", self.filename)
        oReq.send()

    })
}

SwTable.prototype.get = function (key) {
    if (!this.data.hasOwnProperty(key)) {
        throw new Error(key + ' not found')
    }
    return this.data[key]
}

SwTable.prototype.getEdgeCategory = function () {
    var liste = this.data['Atouts']
    var cat = []
    for (var k in liste) {
        var t = liste[k]['Type']
        if (-1 === cat.indexOf(t)) {
            cat.push(t)
        }
    }

    return cat
}

SwTable.prototype.getAtoutListFor = function (group) {
    var result = []
    for (var idx in this.data['Atouts']) {
        var atout = this.data['Atouts'][idx]
        if (atout.Type === group) {
            result.push(atout)
        }
    }

    return result
}