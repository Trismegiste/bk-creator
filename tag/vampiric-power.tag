<vampiric-power>
    <form class="pure-form pure-g" onchange="{
                onChange
            }">
        <legend class="pure-u-1">Pouvoirs vampiriques</legend>
        <div class="pure-u-1">
            <select name="pouvoir" class="pure-input-1" onchange="{
                        onAppendPouvoir
                    }">
                <option value="0">Cliquez pour ajouter...</option>
                <option each="{ power in pouvoirList }" value="{power['Pouvoir vampirique']}">{power['Pouvoir vampirique']}</option>
            </select>
        </div>
        <virtual each="{ power in model.current.vampiricPower }">
            <div class="pure-u-3-4">
                <label>{power['Pouvoir vampirique']}</label>
            </div>
            <div class="pure-u-1-4">
                <select name="niveauValue" class="pure-input-1" value="{ power.value }"
                        onchange="{
                                    parent.onUpdateValue
                                }">
                    <option></option>
                    <option each="{ cost in power.costConstraint }" value="{cost}">{cost}</option>
                </select>
            </div>
        </virtual>
        <div class="pure-u-1-2"></div>
        <div class="pure-u-1-4"><label class="centered">Pts.</label></div>
        <div class="pure-u-1-4"><label class="centered">{ model.current.getPowerPoint() }</label></div>
    </form>
    <script>
        this.model = SwCharman.model
        this.pouvoirList = SwCharman.table.get('Pouvoirs')
        var self = this;

        this.onAppendPouvoir = function (e) {
            for (var k = 0; k < self.pouvoirList.length; k++) {
                if (self.pouvoirList[k]['Pouvoir vampirique'] === e.target.value) {
                    var found = self.pouvoirList[k]
                    var temp = self.model.clone(found)
                    temp.value = temp.costConstraint[0]
                    self.model.current.vampiricPower.push(temp)
                    e.target.value = 0;
                }
            }
        }

        this.onUpdateValue = function (e) {
            var tab = self.model.current.vampiricPower
            // delete if empty value
            if (e.target.value == 0) {
                var idx = tab.indexOf(e.item.power)
                if (idx !== -1) {
                    tab.splice(idx, 1)
                }
            } else {
                var idx = tab.indexOf(e.item.power)
                if (-1 !== idx) {
                    tab[idx].value = e.target.value
                }
            }
        }

    </script>
</vampiric-power>