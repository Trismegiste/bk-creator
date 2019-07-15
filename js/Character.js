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
    this.toShoot = 0;
    // detail
    this.type = 'virtual';
    this.attribute = {}
    this.competence = []
    this.handicap = []
    this.atout = []
    this.detailedNote = ''
    this.wildCard = false
    this.vampiricPower = []
    this.freeformPower = []
    this.deltaPC = 0
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
            var skill = this.competence[k]
            var attrRef = this.attribute[skill['Dépend']]
            sum += (skill.value - 2) / 2 + ((skill.value > attrRef) ? (skill.value - attrRef) / 2 : 0)
        }

        return sum;
    },
    getXP: function () {
        return this.getXpForAdvance(this.getProgression().length)
    },
    getXpForAdvance: function (nb) {
        return 5 * (nb + (nb > 16 ? nb - 16 : 0))
    },
    getHindrancePoint: function () {
        var sum = this.deltaPC
        var tab = this.handicap
        for (var h in tab) {
            sum += (tab[h].value == 'Mineur') ? 1 : 2
        }

        return sum;
    },
    getAtoutCreation: function () {
        var tab = []
        var hp = this.getHindrancePoint()

        var sum = 0
        for (var k in this.atout) {
            sum += this.atout[k].advanceCost
            if (sum <= hp) {
                tab.push(this.atout[k])
            }
        }

        return tab
    },
    getCreationPoint: function () {
        var sum = 0
        var lst = this.getAtoutCreation()

        for (var k in lst) {
            sum += lst[k].advanceCost
        }

        return sum
    },
    getProgression: function () {
        var tab = []
        var hp = this.getHindrancePoint()

        var sum = 0
        for (var k in this.atout) {
            sum += this.atout[k].advanceCost
            if (sum > hp) {
                tab.push(this.atout[k])
            }
        }

        return tab
    },
    getPowerPoint: function () {
        var sum = 0
        var tab = this.vampiricPower
        for (var h in tab) {
            sum += parseInt(tab[h].value)
        }

        return sum
    },
    getXpForEdge: function (atout) {
        var lst = this.getProgression()

        var idx = lst.indexOf(atout)
        if (-1 !== idx) {
            return this.getXpForAdvance(idx + 1)
        } else {
            throw new Error('Edge not found')
        }
    },
    isValidated: function (atout, creation) {
        var cumul = true
        for (var k in atout.constraint) {
            var constraint = atout.constraint[k]
            var clause = false
            switch (constraint.type) {
                case 'rank':
                    if (creation) {
                        clause = constraint.rank === 'N'
                    } else {
                        clause = this.getXpOfRank(constraint.rank) <= this.getXpForEdge(atout)
                    }
                    break
                case 'attribute':
                    clause = this.attribute[constraint.attr.toLocaleUpperCase()] >= constraint.dice
                    break
                case 'skill':
                    clause = false
                    for (var j in constraint.skill) {
                        clause = (this.getSkillDice(constraint.skill[j]) >= constraint.dice) || clause
                    }
                    break
                case 'edge':
                    clause = false
                    for (var j in this.atout) {
                        if (this.atout[j]['Atout'] === constraint.edge) {
                            clause = true
                            break
                        }
                    }
                    break
                default:
                    clause = true
            }
            cumul = clause && cumul
        }
        return cumul
    },
    getXpOfRank: function (rk) {
        return {'N': 0, 'A': 20, 'V': 40, 'H': 60, 'L': 80}[rk]
    },
    getSkillDice: function (name) {
        for (var k in this.competence) {
            if (this.competence[k]['Compétences'] === name) {
                return this.competence[k].value
            }
        }

        return -2
    },
    getFreeformPowerCost: function () {
        var sum = 0
        var tab = this.freeformPower
        for (var h in tab) {
            sum += parseInt(tab[h].cost)
        }

        return sum
    }


};

