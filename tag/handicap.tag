<handicap>
    <form class="pure-form pure-g" onchange="{
                onChange
            }">
        <legend class="pure-u-1">Handicaps</legend>
        <div class="pure-u-1">
            <select name="handicap" class="pure-input-1" onchange="{
                        onAppendHandicap
                    }">
                <option value="0">Cliquez pour ajouter...</option>
                <option each="{ handicapList }" value="{Handicap}">{Handicap}</option>
            </select>
        </div>
        <virtual each="{ model.current.handicap }">
            <div class="pure-u-3-4">
                <label>{Handicap}</label>
            </div>
            <div class="pure-u-1-4">
                <select name="niveauValue" class="pure-input-1" value="{ value }"
                        onchange="{
                                    parent.onUpdateValue
                                }">
                    <option></option>
                    <option value="Mineur" if="{ Type != 'Majeur' }">Mineur</option>
                    <option value="Majeur" if="{ Type != 'Mineur' }">Majeur</option>
                </select>
            </div>
        </virtual>
    </form>
    <script>
        this.model = SwCharman.model
        this.handicapList = SwCharman.table.get('Handicaps')
                console.log(this.handicapList)

        var self = this;

        this.onAppendHandicap = function (e) {
            for (var k = 0; k < self.handicapList.length; k++) {
                if (self.handicapList[k].Handicap === e.target.value) {
                    var found = self.handicapList[k]
                    var temp = self.model.clone(found)
                    temp.value = (temp.Type == 'Majeur') ? 'Majeur' : 'Mineur';
                    self.model.current.handicap.push(temp)
                    e.target.value = 0;
                }
            }
        }

        this.onUpdateValue = function (e) {
            var tab = self.model.current.handicap
            // delete if empty value
            if (e.target.value == 0) {
                var idx = tab.indexOf(e.item)
                if (idx !== -1) {
                    tab.splice(idx, 1)
                }
            } else {
                var idx = tab.indexOf(e.item)
                if (-1 !== idx) {
                    tab[idx].value = e.target.value
                }
            }
        }

        this.onChange = function () {
            self.model.trigger('update-hindrance')
        }

    </script>
</handicap>