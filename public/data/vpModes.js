// data/vpModes.ts - VP mode definitions
// VP modes define victory point cards/events and target scores for stages
import { province, duchy, estate } from '../gameLogic.js';
import { flowerMarket, vibrantCity, frontier, gardens, territory, farmland, palace, duke, philanthropy, thoroughfare, monument, capitalization, } from '../cards/base.js';
// All VP modes
export var allVPModes = [
    { name: 'Province', target: 30, cards: [province], events: [] },
    { name: 'Duchy', target: 30, cards: [duchy], events: [] },
    { name: 'Estate', target: 20, cards: [estate], events: [] },
    { name: 'Thoroughfare', target: 80, cards: [], events: [thoroughfare] },
    { name: 'Monument', target: 20, cards: [], events: [monument] },
    { name: 'Capitalization', target: 60, cards: [], events: [capitalization] },
    { name: 'Philanthropy', target: 40, cards: [], events: [philanthropy] },
    { name: 'Duke', target: 50, cards: [duchy, duke], events: [] },
    { name: 'Flower Market', target: 40, cards: [flowerMarket], events: [] },
    { name: 'Farmland', target: 40, cards: [farmland], events: [] },
    { name: 'Vibrant City', target: 40, cards: [vibrantCity], events: [] },
    { name: 'Palace', target: 40, cards: [palace], events: [] },
    { name: 'Territory', target: 40, cards: [territory], events: [] },
    { name: 'Frontier', target: 70, cards: [frontier], events: [] },
    { name: 'Gardens', target: 40, cards: [gardens], events: [] },
];
//# sourceMappingURL=vpModes.js.map