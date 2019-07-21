/* 
 * SVG render
 */
var VampireSvg = function (charac) {
    this.character = charac;
}

VampireSvg.prototype.getDocument = function () {
    var self = this
    var oReq = new XMLHttpRequest()
    oReq.addEventListener("load", function () {
        var doc = oReq.responseXML
        doc.nsResolver = doc.createNSResolver(doc.ownerDocument == null ? doc.documentElement : doc.ownerDocument.documentElement)

        doc.changeOneValue = function (query, val) {
            var xpathResult = this.evaluate(query, this, this.nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE)
            if (1 !== xpathResult.snapshotLength) {
                throw new Error("No result found for " + query)
            }
            var node = xpathResult.snapshotItem(0)
            node.value = val
        }

        doc.changeOneTextContent = function (query, val) {
            doc.changeMultipleTextContent(query, [val])
        }

        doc.changeMultipleTextContent = function (query, val) {
            var xpathResult = this.evaluate(query, this, this.nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE)
            if (val.length !== xpathResult.snapshotLength) {
                throw new Error("Mismatch length result found for " + query)
            }
            for (var k = 0; k < xpathResult.snapshotLength; k++) {
                var node = xpathResult.snapshotItem(k)
                node.textContent = val[k]
            }
        }

        doc.changeInkscapeTextById = function (id, val) {
            if (!Array.isArray(val)) {
                val = [val]
            }
            this.changeMultipleTextContent('//*[namespace-uri()="http://www.w3.org/2000/svg" and name()="text" and @id="'
                    + id
                    + '"]/*[name()="tspan"]', val)
        }

        // showing form filling
        doc.changeOneValue('//*[namespace-uri()="http://www.w3.org/2000/svg" and name()="g" and @inkscape:label="remplissage" and @inkscape:groupmode="layer"]/@style', "display:inline")
        // changing name
        doc.changeInkscapeTextById('bk-nom', self.character.name)
        // attributes
        doc.changeInkscapeTextById('bk-attributs', self.getAttribute())
        // skill
        doc.changeInkscapeTextById('bk-competences', self.getSkill())

        var s = new XMLSerializer()
        var blob = new File([s.serializeToString(doc)], 'fdp.svg', {type: "image/svg+xml;charset=utf-8"})
        saveAs(blob)
    })

    oReq.open("GET", "./data/template.svg")
    oReq.send()

}

VampireSvg.prototype.getAttribute = function () {
    var attr = this.character.attribute

    return [
        attr['AGI'],
        attr['ÂME'],
        attr['VIG'],
        attr['INT'],
        attr['FOR']
    ]
}

VampireSvg.prototype.getSkill = function () {
    var skill = []
    skill[0] = 666
    skill[24] = 777

    return skill
}
