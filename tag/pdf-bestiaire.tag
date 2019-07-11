<pdf-bestiaire>
    <form class="pure-form" if="{ready}" onsubmit="{
                onGenerate
            }">
        <button class="pure-button pure-button-primary">
            <i class="icon-file-pdf"></i> Generate
        </button>
    </form>
    <div id="log"></div>
    <script>
        var self = this
        self.ready = false

        // init assets
        for (var idx in SwCharman.model.kaList) {
            var ka = SwCharman.model.kaList[idx]
            SwCharman.assetManager.append(ka, './img/' + ka + '.png')
        }
        for (var k = 0; k < 2; k++) {
            SwCharman.assetManager.append('puce-' + k, './img/puce-' + k + '.png')
        }

        SwCharman.assetManager.load().then(function () {
            self.ready = true
        })

        this.onGenerate = function () {
            var factory = new RenderingFactory();
            var compil = {
                content: [],
                styles: {
                    verticalAlign: {
                        margin: [0, 6, 0, 0]
                    }
                }
            }

            try {
                for (var idx in SwCharman.model.cloudList) {
                    var character = SwCharman.model.cloudList[idx]
                    var docDefinition = factory.create(character)
                    try {
                        compil.content.push(docDefinition.getDocument().content)
                    } catch (e) {
                        e.character = character.name
                        throw e
                    }
                }

                pdfMake.createPdf(compil).download('bestiaire-listing.pdf')
            } catch (e) {
                document.getElementById('log').innerHTML = "Error in " + e.character + " : " + (e.stack || e)
            }
        }
    </script>
</pdf-bestiaire>