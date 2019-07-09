/*
 * Character object
 */

var Character = function () {
    this.name = '';
    this.currentWounds = 0;
    this.spentToken = 0;
    this.currentFatigue = 0;
    this.attack = ['', ''];
    this.damage = ['', ''];
    this.toughness = 4;
    this.target = '';
    this.shaken = false;
    this.toHit = 2;
    this.toShoot = 4;
    // detail
    this.type = 'virtual';
    this.attribute = {}
    this.competence = []
    this.handicap = []
    this.atout = []
    this.detailedNote = ''
    this.wildCard = false
};

Character.prototype = {
    getMaxToken: function () {
        return 3
    },
    restart: function () {
        this.currentWounds = 0;
        this.spentToken = 0;
        this.currentFatigue = 0;
        this.target = '';
        this.shaken = false;
    },
    // this method is just an hint about how this character is lethal
    getLethality: function () {
        return Math.floor(0.2 * (this.attack / 2 * ((this.toughness - 3) / 2 + (this.toHit - 2))))
    },
    getAttributePoint: function () {
        var sum = 0
        var self = this
        Object.keys(this.attribute).forEach(function (key) {
            sum += (self.attribute[key] - 4) / 2
        })

        return sum;
    },
    getCompetencePoint: function () {
        var sum = 0
        for (var k = 0; k < this.competence.length; k++) {
            sum += (this.competence[k].value - 2) / 2
        }

        return sum;
    },
    getXP: function () {
        var nb = this.atout.length - this.getHindrancePoint() / 2 - 1

        return 5 * (nb + (nb > 16 ? nb - 16 : 0))
    },
    getHindrancePoint: function () {
        var sum = 0
        var tab = this.handicap
        for (var h in tab) {
            sum += (tab[h].value == 'Mineur') ? 1 : 2
        }

        return sum;
    },
    getAtoutCreation: function () {
        var tab = []
        var nbHandi = Math.ceil(this.getHindrancePoint() / 2)
        for (var k = 0; k < (nbHandi + 1); k++) {
            tab.push(this.atout[k])
        }

        return tab
    }
};

