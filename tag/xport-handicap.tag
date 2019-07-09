<xport-handicap class="exported">
    <div  each="{race, listing in atout}">
        <h1>{race}</h1>
        <table class="pure-table pure-table-horizontal">
            <thead>
                <tr>
                    <th width="25%">Titre</th>
                    <th width="10%">niveau</th>
                    <th>description</th>
                </tr>
            </thead>
            <tbody>
                <tr each="{listing}" if="{enabled==1}">
                    <td>{titre}</td>
                    <td>{niveau}</td>
                    <td>{descr}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <script>
        var self = this
        this.atout = Xport.table.get('handicap')
    </script>
</xport-handicap>