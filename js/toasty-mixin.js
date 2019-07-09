/*
 * Toasts mixin for tags
 */

var Toasty = {
    notice: function (msg, level) {
        var tags = riot.mount('rg-toasts', {
            toasts: {
                position: 'bottomright',
                toasts: [{
                        type: level,
                        text: msg,
                        timeout: 2000
                    }]
            }
        });
    }
}
