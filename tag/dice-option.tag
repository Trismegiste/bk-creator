<dice-option>
    <option each="{dice in diceList}" value="{dice.val}" if="{dice.val<=max}">{dice.label}</option>
    <script>
        this.max = this.opts.max ? this.opts.max : 12

        this.diceList = [
            {val: 0, label: ''},
            {val: 4, label: 'd4'},
            {val: 6, label: 'd6'},
            {val: 8, label: 'd8'},
            {val: 10, label: 'd10'},
            {val: 12, label: 'd12'},
            {val: 13, label: 'L+1'},
            {val: 14, label: 'L+2'},
            {val: 15, label: 'L+3'},
            {val: 16, label: 'L+4'},
            {val: 17, label: 'L+5'},
            {val: 18, label: 'L+6'},
            {val: 19, label: 'L+7'},
            {val: 20, label: 'L+8'}
        ]

        if (this.opts.nozero) {
            this.diceList.shift()
        }
    </script>
</dice-option>