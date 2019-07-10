<atout>
    <form class="pure-form pure-g">
        <legend class="pure-u-1">Atouts</legend>
        <div class="pure-u-1">
            <select name="groupe" class="pure-input-1 capitalize" value="{ selectedGroup }" onchange="{
                        onChangeGroup
                    }">
                <option value="0">Filtrez un groupe...</option>
                <option each="{ group in category }" value="{group}">{group}</option>
            </select>
            <select name="atout" class="pure-input-1" onchange="{
                        onAppendAtout
                    }">
                <option value="0">Cliquez pour ajouter...</option>
                <option each="{ filteredAtoutList }" value="{Atout}">{Atout}</option>
            </select>
        </div>
        <virtual each="{ atout in getCreation() }">
            <div class="pure-u-1-{ atout.info ? '2' : '1' }">
                <label title="Prérequis : {atout['Prérequis']} &#013;Détail : {atout['Effets']}" 
                       class="{model.current.isValidated(atout) ? '' : 'failed-constraint'}">
                    <input type='radio' name="selectedEdge"
                           checked="{checkedAtout == this}" onclick="{
                                       onCheckedEdge
                                   }"/>
                    {atout['Atout']}
                </label>
            </div>
            <div class="pure-u-1-2" if="{ atout.info }">
                <input name="atoutInfo" value="{atout.detail}"
                       class="pure-input-1" onchange="{
                                   parent.onUpdateDetail
                               }"/>
            </div>
        </virtual>
        <div class="pure-u-1-4 centered">PC</div>
        <div class="pure-u-1-4 centered">{ model.current.getCreationPoint() }</div>
        <div class="pure-u-1-4 centered">/</div>
        <div class="pure-u-1-4 centered">{ model.current.getHindrancePoint() }</div>
        <virtual each="{ atout in getProgression() }">
            <div class="pure-u-1-{ atout.info ? '2' : '1' }">
                <label title="Prérequis : {atout['Prérequis']} &#013;Détail : {atout['Effets']}" 
                       class="{model.current.isValidated(atout) ? '' : 'failed-constraint'}">
                    <input type='radio' name="selectedEdge"
                           checked="{checkedAtout == this}" onclick="{
                                       onCheckedEdge
                                   }"/>
                    {model.current.getXpForEdge(atout)} - {atout['Atout']}
                </label>
            </div>
            <div class="pure-u-1-2" if="{ atout.info }">
                <input name="atoutInfo" value="{atout.detail}"
                       class="pure-input-1" onchange="{
                                   parent.onUpdateDetail
                               }"/>
            </div>
        </virtual>
        <div class="pure-u-1-3">
            <button class="pure-button" onclick="{
                        onMoveUp
                    }"><i class="icon-up-open"></i></button>
            <button class="pure-button" onclick="{
                        onMoveDown
                    }"><i class="icon-down-open"></i></button>
        </div>
        <div class="pure-u-1-3">
            <button class="pure-button button-error" onclick="{
                        onDelete
                    }"><i class="icon-trash-empty"></i></button>
        </div>
        <div class="pure-u-1-3"><label class="centered">XP { model.current.getXP(group) }</label></div>
    </form>
    <style>
        atout button {
            margin-top: 0.6em;
        }
    </style>
    <script>
        this.model = SwCharman.model
        this.checkedAtout = undefined;
        this.selectedGroup = 0
        this.category = SwCharman.table.getEdgeCategory()
        this.filteredAtoutList = []
        var self = this

        this.getCreation = function () {
            return self.model.current.getAtoutCreation()
        }

        this.getProgression = function () {
            return self.model.current.getProgression()
        }


        this.onChangeGroup = function () {
            self.selectedGroup = self.groupe.value
            self.filteredAtoutList = SwCharman.table.getAtoutListFor(self.selectedGroup)
        }

        this.onAppendAtout = function (e) {
            for (var idx in self.filteredAtoutList) {
                var atout = self.filteredAtoutList[idx]
                if (atout.Atout === e.target.value) {
                    var temp = self.model.clone(atout)
                    self.model.current.atout.push(temp)
                    e.target.value = 0;
                }
            }
        }

        this.onUpdateDetail = function (e) {
            var tab = self.model.current.atout
            var idx = tab.indexOf(e.item.atout)
            if (-1 !== idx) {
                tab[idx].detail = e.target.value
            }
        }

        this.onCheckedEdge = function (e) {
            self.checkedAtout = e.item.atout;
        }

        this.onDelete = function (e) {
            var tab = self.model.current.atout
            var idx = tab.indexOf(self.checkedAtout)
            if (-1 !== idx) {
                tab.splice(idx, 1)
            }
        }

        this.onMoveUp = function (e) {
            var tab = self.model.current.atout
            var idx = tab.indexOf(self.checkedAtout)
            if (-1 !== idx) {
                if (idx > 0) {
                    var tmp = tab[idx - 1]
                    tab[idx - 1] = tab[idx]
                    tab[idx] = tmp;
                }
            }
        }

        this.onMoveDown = function (e) {
            var tab = self.model.current.atout
            var idx = tab.indexOf(self.checkedAtout)
            if (-1 !== idx) {
                if (idx < (tab.length - 1)) {
                    var tmp = tab[idx + 1]
                    tab[idx + 1] = tab[idx]
                    tab[idx] = tmp
                }
            }
        }

        this.model.on('update-hindrance', function () {
            self.update()
        })

        this.model.on('update-attribute', function () {
            self.update()
        })

        this.model.on('update-skill', function () {
            self.update()
        })
    </script>
</atout>