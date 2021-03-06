<competence>
    <form class="pure-form pure-g">
        <legend class="pure-u-1">Compétences</legend>
        <div class="pure-u-1">
            <select name="competence" class="pure-input-1" onchange="{
                        onAppendCompetence
                    }">
                <option value="0">Cliquez pour ajouter...</option>
                <option each="{ comp in competenceList }" value="{comp['Compétences']}">{comp['Compétences']}</option>
            </select>
        </div>
        <virtual each="{ comp in model.current.competence }">
            <div class="pure-u-1-2">
                <label if="{ !editable }">{comp['Compétences']}</label>
                <input if="{ editable }" name="competenceName" value="{comp['Compétences']}"
                       class="pure-input-1" onchange="{
                                   parent.onUpdateTitle
                               }"/>
            </div>
            <div class="pure-u-1-4">
                <label class="centered">{comp['Dépend']}</label>
            </div>
            <div class="pure-u-1-4">
                <select name="competenceValue" class="pure-input-1"
                        data-is="dice-option" value="{ comp.value }"
                        onchange="{
                                    parent.onUpdateValue
                                }"></select>
            </div>
        </virtual>
    </form>
    <sum-footer value="{ model.current.getCompetencePoint() }"></sum-footer>
    <script>
        this.model = SwCharman.model
        this.competenceList = SwCharman.table.get('Compétences')
        var self = this;


        this.onAppendCompetence = function (e) {
            for (var k = 0; k < self.competenceList.length; k++) {
                if (self.competenceList[k]['Compétences'] === e.target.value) {
                    var found = self.competenceList[k]
                    var temp = self.model.clone(found)
                    temp.value = 4;
                    self.model.current.competence.push(temp)
                    e.target.value = 0;
                }
            }
            self.model.trigger('update-skill')
        }

        this.onUpdateValue = function (e) {
            var tab = self.model.current.competence;
            // delete if empty value
            if (e.target.value == 0) {
                var idx = tab.indexOf(e.item.comp);
                if (idx !== -1) {
                    tab.splice(idx, 1)
                }
            } else {
                var idx = tab.indexOf(e.item.comp)
                if (-1 !== idx) {
                    tab[idx].value = parseInt(e.target.value)
                }
            }
            self.model.trigger('update-skill')
        }

        this.onUpdateTitle = function (e) {
            var tab = self.model.current.competence
            var idx = tab.indexOf(e.item.comp)
            if (-1 !== idx) {
                tab[idx]['Compétences'] = e.target.value
            }
        }

        this.model.on('update-attribute', function () {
            self.update()
        })

    </script>
</competence>