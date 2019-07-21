<content-detail class="pure-g">
    <header class="{ blockStyle }">
        <form class="pure-form pure-g">
            <legend class="pure-u-1">Template</legend>
            <div class="pure-u-1-2">
                <select name="type" value="{ model.current.type }" class="pure-input-1" onchange="{
                            onChange
                        }">
                    <option value="virtual"></option>
                    <option each="{key, type in builder.getTemplate()}" value="{key}">{type.title}</option>
                </select>
            </div>
            <div class="pure-u-1-2 centered">
                <label>
                    <input type="checkbox" name="wildcard" checked="{ model.current.wildCard }"  onclick="{
                                onWildCard
                            }"/>
                    Wild Card
                </label>
            </div>
            <div class="pure-u-1">
                <textarea class="pure-input-1" rows="3" name="info" onchange="{
                            onUpdateInfo
                        }">{ model.current.detailedNote }</textarea>
            </div>
        </form>
    </header>
    <!-- attributes -->
    <attribut class="{ blockStyle }"></attribut>
    <!-- handicaps / chutes -->
    <handicap class="{ blockStyle }" if="{ model.current.type != 'monstre' }"></handicap>
    <!-- comp -->
    <competence class="{ blockStyle }"></competence>
    <!-- atouts -->
    <atout class="{ blockStyle }"></atout>
    <vampiric-power  class="{ blockStyle }" if="{ model.current.type == 'vampire' }"></vampiric-power>
    <monster-power  class="{ blockStyle }" if="{ model.current.type == 'monstre' }"></monster-power>
    <div class="pure-u-1 button-spacing" if="{ SwCharman.cloudFolder.id }">
        <a class="pure-button button-success" onclick="{
                    storeToRepository
                }"><i class="icon-upload-cloud"></i> Store to DB</a>
        <a class="pure-button button-error" onclick="{
                    deleteFromRepository
                }"><i class="icon-trash-empty"></i> Delete from DB</a>
    </div>
    <div class="pure-u-1 button-spacing">
        <print-svg></print-svg>
    </div>
    <script>
        this.blockStyle = "webcomponent pure-u-1 pure-u-md-1-2 pure-u-xl-1-3"
        this.model = SwCharman.model
        this.builder = SwCharman.builder
        var self = this;

        this.onChange = function () {
            self.builder.build(self.type.value, self.model.current)
        }

        this.onWildCard = function () {
            self.model.current.wildCard = self.wildcard.checked
        }

        this.onUpdateInfo = function () {
            self.model.current.detailedNote = self.info.value
        }

        // store the current char into the Repository
        this.storeToRepository = function () {
            if (self.model.current.name != '') {
                var temp = self.model.clone(self.model.current);
                temp.restart();
                self.model.trigger('store-db', temp)
            }
        }

        // delete the current char from the Repository
        this.deleteFromRepository = function () {
            if (self.model.current.name != '') {
                var temp = self.model.clone(self.model.current);
                temp.restart();
                self.model.trigger('delete-db', temp)
            }
        }
    </script>
</content-detail>
