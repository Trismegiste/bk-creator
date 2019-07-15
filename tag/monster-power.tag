<monster-power>
    <form class="pure-form pure-g">
        <legend class="pure-u-1">Pouvoirs</legend>
        <div class="pure-u-1">
            <input name="title" class="pure-input-1"/>
        </div>
        <div class="pure-u-1-2">
            <input name="cost" class="pure-input-1" value="0"/>
        </div>
        <div class="pure-u-1-2">
            <button class="pure-button pure-input-1" onclick="{
                        onAddPower
                    }">Add</button>
        </div>
        <virtual each="{ power in model.current.freeformPower }">
            <div class="pure-u-4-5">
                <label>
                    <input type='radio' name="selectedPower"
                           checked="{checkedPower == this}" onclick="{
                                       onCheckedPower
                                   }"/>
                    {power.title}            
                </label>
            </div>
            <div class="pure-u-1-5">
                <label>{power.cost}</label>
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
        <div class="pure-u-1-3"><label class="centered">{ model.current.getFreeformPowerCost() }</label></div>
    </form>
    <style>
        atout button {
            margin-top: 0.6em;
        }
    </style>
    <script>
        this.model = SwCharman.model
        this.checkedPower = undefined;
        var self = this

        this.onAddPower = function (e) {
            self.model.current.freeformPower.push({title: self.title.value, cost: self.cost.value})
            console.log(self.tmpPower)
            self.title.value = ""
            self.cost.value = 0
        }

        this.onUpdateDetail = function (e) {
            var tab = self.model.current.atout
            var idx = tab.indexOf(e.item.atout)
            if (-1 !== idx) {
                tab[idx].detail = e.target.value
            }
        }

        this.onCheckedPower = function (e) {
            self.checkedPower = e.item.power;
        }

        this.onDelete = function (e) {
            var tab = self.model.current.freeformPower
            var idx = tab.indexOf(self.checkedPower)
            if (-1 !== idx) {
                tab.splice(idx, 1)
            }
        }

        this.onMoveUp = function (e) {
            var tab = self.model.current.freeformPower
            var idx = tab.indexOf(self.checkedPower)
            if (-1 !== idx) {
                if (idx > 0) {
                    var tmp = tab[idx - 1]
                    tab[idx - 1] = tab[idx]
                    tab[idx] = tmp;
                }
            }
        }

        this.onMoveDown = function (e) {
            var tab = self.model.current.freeformPower
            var idx = tab.indexOf(self.checkedPower)
            if (-1 !== idx) {
                if (idx < (tab.length - 1)) {
                    var tmp = tab[idx + 1]
                    tab[idx + 1] = tab[idx]
                    tab[idx] = tmp
                }
            }
        }

    </script>
</monster-power>