<content-list>
    <nav class="pure-menu">
        <ul class="pure-menu-list">
            <li each="{ pc, i in model.characterList }"
                class="pure-menu-item {pure-menu-selected: pc == model.current}">
                <a href="#char/{ i }" class="pure-menu-link">
                    { pc.name } [vs {pc.target} / W:{pc.currentWounds}{pc.shaken ? '+S' : ''}]
                </a>
            </li>
        </ul>
    </nav>
    <footer class="pure-g button-spacing">
        <div class="pure-u-1-3"><a class="pure-button" onclick="{
                    nonDuplicatedNaming
                }">N.D.N</a></div>
        <div class="pure-u-1-3"><a class="pure-button button-primary" onclick="{
                    restore
                }">Load</a></div>
        <div class="pure-u-1-3"><a class="pure-button button-error" onclick="{
                    persist
                }">Save</a></div>
    </footer>

    <script>
        this.mixin('toasty')
        this.model = SwCharman.model
        var self = this

        this.persist = function () {
            SwCharman.repository.saveCurrent(self.model.characterList);
            self.notice('Etat courant enregistré', 'error')
        };

        this.restore = function () {
            self.model.characterList = [];
            SwCharman.repository.loadCurrent()
                    .then(function (arr) {
                        console.log('load ' + arr.length);
                        arr.forEach(function (item) {
                            self.model.characterList.push(item);
                        })
                        self.update();
                    })
        };

        this.nonDuplicatedNaming = function () {
            var nameCount = {}
            for (var k in  self.model.characterList) {
                var curr = self.model.characterList[k]
                if (nameCount[curr.name] === undefined) {
                    nameCount[curr.name] = []
                }
                nameCount[curr.name].push(k)
            }

            console.log(nameCount)
            for (var currName in nameCount) {
                var indices = nameCount[currName]
                if (indices.length >= 2) {
                    for (var i in indices) {
                        var changedIdx = indices[i]
                        self.model.characterList[changedIdx].name = currName + ' ' + (1 + parseInt(i))
                    }
                }
            }
        }


    </script>
</content-list>