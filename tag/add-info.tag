<add-info>
    <form class="pure-form pure-g form-label-aligned" onchange="{
                onChange
            }">
        <legend class="pure-u-1">Information</legend>
        <div class="pure-u-1">
            <textarea class="pure-input-1" rows="5" name="info">{ model.current.detailedNote }</textarea>
        </div>
    </form>
    <script>
        this.model = SwCharman.model
        var self = this;

        this.onChange = function () {
            self.model.current.detailedNote = self.info.value
        }
    </script>
</add-info>