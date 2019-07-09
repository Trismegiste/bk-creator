/*
 * Create rendering classes depending on type of Character
 */
RenderingFactory = function () {
    this.classNameEnd = 'Rendering'
}

RenderingFactory.prototype.create = function (charac) {
    var type = charac.type;
    //
    var clsName = type.charAt(0).toUpperCase() + type.slice(1) + this.classNameEnd

    return new top[clsName](charac)
}