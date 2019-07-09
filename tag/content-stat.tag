<content-stat class="webcomponent pure-g">
    <div class="pure-u-1 pure-u-md-1-2 pure-u-xl-1-3">
        <form class="pure-form pure-g form-label-aligned" onchange="{
                    updateCurrent
                }">
            <div class="pure-u-1-4"><label>Nom</label></div>
            <div class="pure-u-14-24"><input class="pure-input-1" type="text" name="name" value="{model.current.name}" required="true"/></div>
            <div class="pure-u-4-24 wildcard"><i class="icon-wildcard" if="{model.current.wildCard}"></i></div>
            <div class="pure-u-1-4"><label>Cible</label></div>
            <div class="pure-u-14-24">
                <select class="pure-input-1" name="target" value="{model.current.target}">
                    <option value=""></option>
                    <option each="{model.characterList}" value="{name}">{name}</option>
                </select>
            </div>
            <div class="pure-u-4-24 direct-link">
                <a href="#char/{ findIdx(model.current.target) }" if="{model.current.target}">
                    <i class="icon-address-card-o"></i>
                </a>
            </div>
            <div class="pure-u-1">
                <div class="pure-g" each="{idx, k in [1, 2]}">
                    <div class="pure-u-1-4"><label>Att #{idx}</label></div>
                    <div class="pure-u-3-8">
                        <input type="text" value="{model.current.attack[k]}" name="attack" class="pure-input-1"/>
                    </div>
                    <div class="pure-u-3-8">
                        <input type="text" value="{model.current.damage[k]}" name="damage" class="pure-input-1"/>
                    </div>
                </div>
            </div>
            <div class="pure-u-1-4"><label>Parade</label></div>
            <div class="pure-u-1-4"><input type="number" value="{model.current.toHit}" name="toHit" class="pure-input-1"/></div>
            <div class="pure-u-1-4"><label>Esquive</label></div>
            <div class="pure-u-1-4"><input type="number" value="{model.current.toShoot}" name="toShoot" class="pure-input-1"/></div>
            <div class="pure-u-1-4"><label>Jeton</label></div>
            <div class="pure-u-1-4">
                <select name="token" value="{model.current.spentToken}" max="{model.current.getMaxToken()}" data-is="token-option" class="pure-input-1">
                </select>
            </div>
            <div class="pure-u-1-2">
                <label class="pure-checkbox">
                    Secoué
                    <input type="checkbox" name="shaken" checked="{ model.current.shaken }"/>
                </label>
            </div>
            <div class="pure-u-1-4"><label>Résis.</label></div>
            <div class="pure-u-1-4"><input type="number" value="{model.current.toughness}" name="toughness" class="pure-input-1"/></div>
            <div class="pure-u-1-4"><label>Bless.</label></div>
            <div class="pure-u-1-4">
                <select name="wounds" value="{model.current.currentWounds}" class="pure-input-1">
                    <option value="0">0</option>
                    <option value="-1">-1</option>
                    <option value="-2">-2</option>
                    <option value="-3">-3</option>
                    <option value="-4">Crit.</option>
                </select>
            </div>
        </form>
        <div class="pure-g">
            <div class="pure-u-1-1 footnote" if="{model.current.detailedNote}">
                <strong>Notes</strong> : {model.current.detailedNote}
            </div>
        </div>
        <div class="pure-g button-spacing">
            <div class="pure-u-1-3"><a class="pure-button" onclick="{
                        onReset
                    }">Reset</a></div>
            <div class="pure-u-1-3"><a class="pure-button button-primary" onclick="{
                        onAppend
                    }">Append</a></div>
            <div class="pure-u-1-3"><a class="pure-button button-error" onclick="{
                        onDelete
                    }">Delete</a></div>
        </div>
    </div>
    <script>
        this.mixin('toasty')
        this.model = SwCharman.model
        var self = this

        this.onReset = function () {
            self.model.trigger('reset');
            riot.route('stat', 'New...');
        }

        this.onAppend = function () {
            // checking non-empty name
            if (self.name.value == '') {
                return;
            }
            self.model.current = self.model.clone(self.model.current)
            self.model.characterList.push(self.model.current);
            self.notice(self.model.current.name + ' créé', 'primary')
            riot.route('char/' + (self.model.characterList.length - 1));
        }

        this.onDelete = function () {
            var idx = self.model.characterList.indexOf(self.model.current);
            if (idx !== -1) {
                self.model.characterList.splice(idx, 1);
                self.notice(self.model.current.name + ' effacé', 'error')
                riot.route('list');
            }
        }

        this.updateCurrent = function () {
            var obj = self.model.current;
            obj.name = self.name.value;
            obj.toughness = self.toughness.value;
            obj.magicToughness = self.magicToughness.value;
            for (var k = 0; k < 2; k++) {
                obj.attack[k] = self.attack[k].value;
                obj.damage[k] = self.damage[k].value;
            }
            obj.toHit = self.toHit.value;
            obj.toShoot = self.toShoot.value;
            obj.currentWounds = self.wounds.value;
            obj.magicWounds = self.magicWounds.value;
            obj.shaken = self.shaken.checked;
            obj.spentToken = self.token.value;
            obj.target = self.target.value;
        }

        this.findIdx = function (search) {
            for (var idx in self.model.characterList) {
                var pc = self.model.characterList[idx]
                if (pc.name === search) {
                    return idx
                }
            }
        }

        var subRoute = riot.route.create()
        subRoute('/char/*', function (id) {
            self.model.trigger('reset');
            if (self.model.characterList[id] !== undefined) {
                self.model.current = self.model.characterList[id];
            }
            subRoute('stat', 'Stat ' + self.model.current.name, true)
        })
    </script>
</content-stat>
