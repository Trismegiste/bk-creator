/* 
 * THIS is a svg sheet  for vampire
 * contins business methods
 */

var VampireSheet = function (svg) {
    this.doc = svg
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

VampireSheet.prototype.setAttributes = function (val) {
    this.changeInkscapeTextById('bk-attributs', val)
}

VampireSheet.prototype.setSkills = function (val) {
    this.changeInkscapeTextById('bk-competences', val)
}

VampireSheet.prototype.setHindrances = function (val) {
    this.changeInkscapeTextById('bk-handicaps', val)
}

VampireSheet.prototype.setAtoutsCrea = function (val) {
    this.changeInkscapeTextById('bk-atouts-crea', val)
}

VampireSheet.prototype.setPouvoirs = function (val) {
    this.changeInkscapeTextById('bk-pouvoirs', val)
}

VampireSheet.prototype.setProgressions = function (val) {
    this.changeInkscapeTextById('bk-progressions', val)
}