/* 
 * SVG render
 */
var SheetFactory = function (charac) {
    this.character = charac;
}

SheetFactory.prototype.getDocument = function () {
    var self = this
    var oReq = new XMLHttpRequest()
    oReq.addEventListener("load", function () {
        var doc = new VampireSheet(oReq.responseXML)

        // changing name
        doc.setName(self.character.name)
        // attributes
        doc.setAttributes(self.getAttribute())
        // skills
        doc.setSkills(self.getSkill())
        doc.setHindrances(self.getOrderedHind())
        doc.setAtoutsCrea(self.getAtoutsCrea())
        doc.setPouvoirs(self.getPouvoirs())
        doc.setProgressions(self.getProgressions())

        var s = new XMLSerializer()
        var blob = new File([s.serializeToString(doc.doc)], 'fdp.svg', {type: "image/svg+xml;charset=utf-8"})
        saveAs(blob)
    })

    oReq.open("GET", "./data/template.svg")
    oReq.send()

}

SheetFactory.prototype.getAttribute = function () {
    var attr = this.character.attribute

    return [
        attr['AGI'],
        attr['ÂME'],
        attr['VIG'],
        attr['INT'],
        attr['FOR']
    ]
}

SheetFactory.prototype.getSkill = function () {
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

    return skill
}

SheetFactory.prototype.getOrderedHind = function () {
    var h = this.character.handicap
    h.sort(function (a, b) {
        return ((a.value === 'Majeur') && (b.value === 'Mineur')) ? -1 : 1
    })

    var res = ['', '', ''] /// Majeur first
    for (var k in h) {
        res[k] = h[k]['Handicap']
    }

    return res
}

SheetFactory.prototype.getAtoutsCrea = function () {
    var at = this.character.getAtoutCreation()
    var res = ['', '']
    for (var k in at) {
        res[k] = at[k]['Atout']
    }

    return res
}

SheetFactory.prototype.getPouvoirs = function () {
    var pou = this.character.vampiricPower
    var res = []
    for (var k in pou) {
        var label = pou[k]['Pouvoir vampirique']
        if (-1 === ['Crocs', 'Régénération', 'Nyctalope'].indexOf(label)) {
            res.push(label)
        }
    }

    var missing = 9 - res.length
    for (var k = 0; k < missing; k++) {
        res.push('')
    }

    return res
}

SheetFactory.prototype.getProgressions = function () {
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

    return res
}
