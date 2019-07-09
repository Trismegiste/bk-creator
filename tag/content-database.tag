<content-database>
    <div class="pure-g">
        <div class="pure-u-1 pure-u-md-1-2 pure-u-xl-1-3 character" each="{ model.cloudList }">
            <i class="icon-{ type }"></i>
            <a href="#" onclick="{
                        parent.onAppend
                    }">{name}</a>
            <i if="{wildCard}" class="icon-wildcard"></i>
        </div>
    </div>
    <div class="button-spacing">
        <google-drive-doc></google-drive-doc>
    </div>
    <div class="button-spacing">
        <pdf-bestiaire></pdf-bestiaire>
    </div>
    <script>
        this.mixin('toasty')
        this.model = SwCharman.model
        var self = this

        this.onAppend = function (event) {
            var pc = self.model.findByName(event.item.name)
            if (pc) {
                var tmp = self.model.clone(pc)
                self.model.characterList.push(tmp)
                self.notice(tmp.name + ' ajouté', 'primary')
            }
        }

        this.model.on('update-db', function (rows) {
            self.model.importFromJson(rows)
            self.update()
        })

        // persist
        this.model.on('store-db', function (temp) {
            var found = self.model.findIdxByName(temp.name)
            // insert/update
            if (found !== -1) {
                self.model.cloudList[found] = temp
            } else {
                self.model.cloudList.push(temp)
            }

            self.saveToCloud()

        })

        // delete
        this.model.on('delete-db', function (temp) {
            var found = self.model.findIdxByName(temp.name)
            // delete
            if (found !== -1) {
                self.model.cloudList.splice(found, 1)
                self.saveToCloud()
            }
        })

        this.saveToCloud = function () {
            cloudClient.saveFile(SwCharman.cloudFile.name, 'application/json', JSON.stringify(self.model.cloudList), SwCharman.cloudFolder.id)
                    .then(function (rsp) {
                        self.notice(self.model.cloudList.length + ' personnages sauvés', 'success')
                    })
        }

    </script>
</content-database>
