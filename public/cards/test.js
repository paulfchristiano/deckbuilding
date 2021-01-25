import { gainPoints } from '../logic.js';
import { register, coin, energy, } from './index.js';
var manor = {
    name: 'Manor',
    buyCost: coin(6),
    fixedCost: energy(1),
    triggers: [{
            text: 'Whenever you pay @, gain that many vp.',
            kind: 'cost',
            handles: function (e) { return e.cost.energy > 0; },
            transform: function (e) { return gainPoints(e.cost.energy); }
        }]
};
register(manor, 'test');
//# sourceMappingURL=test.js.map