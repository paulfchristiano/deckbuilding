import { removeToken, doAll, } from '../logic.js';
import { actionsEffect, buysEffect, pointsEffect, coinsEffect, refreshEffect, energy, } from './index.js';
export var cheats = [];
var freeMoney = { name: 'Free money and buys',
    fixedCost: energy(0),
    effects: [coinsEffect(100), buysEffect(100)],
};
cheats.push(freeMoney);
var freeActions = { name: 'Free actions',
    fixedCost: energy(0),
    effects: [actionsEffect(100)],
};
cheats.push(freeActions);
var freePoints = { name: 'Free points',
    fixedCost: energy(0),
    effects: [pointsEffect(10)],
};
cheats.push(freePoints);
var doItAll = { name: 'Do it all',
    fixedCost: energy(0),
    effects: [{
            text: ["Remove all mire tokens from all cards."],
            transform: function (state) { return doAll(state.discard.concat(state.play).concat(state.hand).map(function (c) { return removeToken(c, 'mire', 'all'); })); }
        }, {
            text: ['Remove all decay tokens from cards in your discard and play.'],
            transform: function (state) { return doAll(state.discard.concat(state.play).concat(state.hand).map(function (c) { return removeToken(c, 'decay', 'all'); })); }
        }, refreshEffect(100), coinsEffect(100), buysEffect(100)]
};
cheats.push(doItAll);
//# sourceMappingURL=cheats.js.map