<print-svg>
    <a class="pure-button pure-button-primary" onclick="{
                getSvg
            }"> <i class="icon-file-pdf"></i> SVG</a>
    <script>
        this.getSvg = function () {
            // do something
            var svg = new VampireSvg(SwCharman.model.current)

            svg.getDocument()
        }
    </script>
</print-svg>