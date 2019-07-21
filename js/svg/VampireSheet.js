/* 
 * THIS is a svg sheet  for vampire
 * contins business methods
 */

var VampireSheet = function (svg, char) {
    this.doc = svg
    this.character = char
    this.nsResolver = svg.createNSResolver(svg.ownerDocument == null ? svg.documentElement : svg.ownerDocument.documentElement)

    this.changeOneValue('//*[namespace-uri()="http://www.w3.org/2000/svg" and name()="g" and @inkscape:label="remplissage" and @inkscape:groupmode="layer"]/@style', "display:inline")
}


VampireSheet.prototype.changeOneValue = function (query, val) {
    var xpathResult = this.doc.evaluate(query, this.doc, this.nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE)
    if (1 !== xpathResult.snapshotLength) {
        throw new Error("No result found for " + query)
    }
    var node = xpathResult.snapshotItem(0)
    node.value = val
}

VampireSheet.prototype.changeOneTextContent = function (query, val) {
    this.changeMultipleTextContent(query, [val])
}

VampireSheet.prototype.changeMultipleTextContent = function (query, val) {
    var xpathResult = this.doc.evaluate(query, this.doc, this.nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE)
    if (val.length !== xpathResult.snapshotLength) {
        throw new Error("Mismatch length result found for " + query)
    }
    for (var k = 0; k < xpathResult.snapshotLength; k++) {
        var node = xpathResult.snapshotItem(k)
        node.textContent = val[k]
    }
}

VampireSheet.prototype.changeInkscapeTextById = function (id, val) {
    if (!Array.isArray(val)) {
        val = [val]
    }
    this.changeMultipleTextContent('//*[namespace-uri()="http://www.w3.org/2000/svg" and name()="text" and @id="'
            + id
            + '"]/*[name()="tspan"]', val)
}

// business
VampireSheet.prototype.setName = function (val) {
    this.changeInkscapeTextById('bk-nom', val)
}

VampireSheet.prototype.fillAttributes = function () {
    var attr = this.character.attribute

    var val = [
        attr['AGI'],
        attr['ÂME'],
        attr['VIG'],
        attr['INT'],
        attr['FOR']
    ]

    this.changeInkscapeTextById('bk-attributs', val)
}

VampireSheet.prototype.fillSkills = function () {
    var skill = []
    var listingComp = SwCharman.table.get('Compétences')
    for (var idx in listingComp) {
        var comp = listingComp[idx]['Compétences']
        if (comp === 'Connaissance') {
            var counter = 0
            for (var k in this.character.competence) {
                var tmp = this.character.competence[k]
                if ((tmp['Compétences'] === 'Connaissance') && (counter < 3)) {
                    skill.push(tmp.value)
                    counter++
                }
            }
            for (var k = 0; k < 3 - counter; k++) {
                skill.push('')
            }
        } else {
            var dice = this.character.getSkillDice(comp)
            skill.push(dice != -2 ? dice : '')
        }
    }

    this.changeInkscapeTextById('bk-competences', skill)
}

VampireSheet.prototype.fillHindrances = function () {
    var h = this.character.handicap
    h.sort(function (a, b) {
        return ((a.value === 'Majeur') && (b.value === 'Mineur')) ? -1 : 1
    })

    var res = ['', '', ''] /// Majeur first
    for (var k in h) {
        res[k] = h[k]['Handicap']
    }

    this.changeInkscapeTextById('bk-handicaps', res)
}

VampireSheet.prototype.fillAtoutsCrea = function () {
    var at = this.character.getAtoutCreation()
    var res = ['', '']
    for (var k in at) {
        res[k] = at[k]['Atout']
    }

    this.changeInkscapeTextById('bk-atouts-crea', res)
}

VampireSheet.prototype.fillPouvoirs = function () {
    var pou = this.character.vampiricPower
    var res = []
    for (var k in pou) {
        var label = pou[k]['Pouvoir vampirique']
        switch (label) {
            case 'Crocs':
                break
            case 'Nyctalope':
                break
            case 'Régénération':
                this.changeInkscapeTextById('bk-regeneration', pou[k].value)
                break
            default:
                res.push(label + " (" + pou[k].value + ")")
        }

    }

    var missing = 9 - res.length
    for (var k = 0; k < missing; k++) {
        res.push('')
    }

    this.changeInkscapeTextById('bk-pouvoirs', res)
}

VampireSheet.prototype.fillProgressions = function () {
    var prog = this.character.getProgression()
    var res = []
    for (var idx in prog) {
        var lbl = prog[idx]['Atout']
        res.push(lbl)
    }

    var missing = 19 - res.length
    for (var k = 0; k < missing; k++) {
        res.push('')
    }

    this.changeInkscapeTextById('bk-progressions', res)
}

VampireSheet.prototype.getDocument = function () {
    // changing name
    this.setName(this.character.name)
    // attributes
    this.fillAttributes()
    // skills
    this.fillSkills()
    this.fillHindrances()
    this.fillAtoutsCrea()
    this.fillPouvoirs()
    this.fillProgressions()

    return this.doc
}
