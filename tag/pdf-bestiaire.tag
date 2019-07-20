<pdf-bestiaire>
    <form class="pure-form" onsubmit="{
                onGenerate
            }">
        <button class="pure-button pure-button-primary">
            <i class="icon-file-pdf"></i> Generate
        </button>
    </form>
    <div id="log"></div>
    <script>
        var self = this
     
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