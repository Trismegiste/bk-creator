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
        var doc = new VampireSheet(oReq.responseXML, self.character)
        var s = new XMLSerializer()
        var blob = new File([s.serializeToString(doc.getDocument())], self.character.name + '.svg', {type: "image/svg+xml;charset=utf-8"})
        saveAs(blob)
    })

    oReq.open("GET", "./data/fdp1.svg")
    oReq.send()

}
