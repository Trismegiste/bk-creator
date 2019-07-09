<xport-atout class="exported">
    <div each="{group in groupList}">
        <h1>{group}</h1>
        <div each="{subgroup in Xport.table.getAtoutSubGroupListFor(group)}">
            <h2>{subgroup}</h2>
            <table class="pure-table pure-table-horizontal">
                <thead>
                    <tr>
                        <th width="25%">titre</th>
                        <th width="25%">prérequis</th>
                        <th>description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr each="{ Xport.table.getAtoutListFor(group,subgroup) }">
                        <td>{titre}</td>
                        <td>{prerequis}</td>
                        <td>{descr}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <script>
        var self = this
        this.groupList = Xport.table.getAtoutGroupList()
    </script>
</xport-atout>