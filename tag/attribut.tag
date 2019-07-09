<attribut>
    <form class="pure-form pure-g form-label-aligned" onchange="{
                onChange
            }">
        <legend class="pure-u-1">Attributs</legend>
        <virtual each="{ attr in attributList }">
            <div class="pure-u-1-4"><label>{attr}</label></div>
            <div class="pure-u-1-4">
                <select name="{attr}" class="pure-input-1" data-is="dice-option" value="{ model.current.attribute[attr] }"></select>
            </div>
        </virtual>
        <div class="pure-u-1-4"><label>Pts.</label></div>
        <div class="pure-u-1-4"><label class="centered">{ model.current.getAttributePoint() }</label></div>
    </form>
    <script>
        this.model = SwCharman.model
        this.attributList = [
            'AGI', 'FOR', 'VIG', 'INT', 'ÂME'
        ]
        var self = this;

        onChange() {
            var obj = self.model.current.attribute;
            self.attributList.forEach(function(key) {
                obj[key] = self[key].value
            })
        }

        this.model.on('init-attributs', function(val) {
            var obj = self.model.current.attribute;
            self.attributList.forEach(function(key) {
                obj[key] = val
            })
            self.update()
        })
    </script>
</attribut>