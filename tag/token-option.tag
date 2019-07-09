<token-option>
    <option each="{val, idx in tokenChoices}" value="{idx}">{val}</option>

    <script>
        this.tokenChoices = [];
        var self = this;

        this.on('update', function() {
            for(var k=0; k<=self.opts.max; k++) {
                self.tokenChoices[k] = k;
            }
        });
    </script>
</token-option>