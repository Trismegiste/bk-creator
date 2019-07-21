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
        // skill
        doc.setSkills(self.getSkill())

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
