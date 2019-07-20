<pdf-bestiaire>
    <form class="pure-form" onsubmit="{
                onGenerate
            }">
        <button class="pure-button pure-button-primary">
            <i class="icon-file-pdf"></i> Generate
        </button>
    </form>
    <div>{errorlog}</div>
    <script>
        var self = this
        this.errorlog = ''

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
                var listing = []

                if (SwCharman.model.cloudList.length > 0) {
                    listing = SwCharman.model.cloudList
                } else {
                    // fallback, we generate the listing with the character list for test if the cloud list is empty
                    listing = SwCharman.model.characterList
                }

                for (var idx in listing) {
                    var character = listing[idx]
                    try {
                        var docDefinition = factory.create(character)
                        compil.content.push(docDefinition.getDocument().content)
                    } catch (e) {
                        e.character = character.name
                        throw e
                    }
                }

                pdfMake.createPdf(compil).download('bestiaire-listing.pdf')
                self.errorlog = ''
            } catch (e) {
                self.errorlog = "Error in " + e.character + " : " + (e.stack || e)
            }
        }
    </script>
</pdf-bestiaire>