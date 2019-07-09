<spa-xport>
    <nav class="pure-menu pure-menu-horizontal top-menu">
        <ul class="pure-menu-list">
            <li each="{tab, i in menuTab}"
                class="pure-menu-item {pure-menu-selected: parent.isActiveTab(tab.ref)}">
                <a href="#{tab.ref}" class="pure-menu-link">
                    { tab.title }
                </a>
            </li>
        </ul>
    </nav>
    <div class="pure-g">
        <div class="pure-u-1-1 {hidden: !isActiveTab('atout')}">
            <xport-atout></xport-atout>
        </div>
        <div class="pure-u-1-1 {hidden: !isActiveTab('handicap')}">
            <xport-handicap></xport-handicap>
        </div>
    </div>
    <script>
        var self = this
        this.menuTab = [
            {ref: 'atout', title: 'Atouts'},
            {ref: 'handicap', title: 'Handicaps'}
        ]
        this.activeTab = 'atout'

        isActiveTab(ref) {
            return ref === this.activeTab
        }

        var subRoute = riot.route.create()
        this.menuTab.forEach(function(tab) {
            subRoute('/' + tab.ref, function() {
                self.activeTab = tab.ref
                self.update()
            })
        })

        // this to hide waiting spinner
        this.on('mount', function() {
            document.getElementById('waiting').remove()
            document.getElementById('mainapp').className = ''
        })
    </script>
</spa-xport>