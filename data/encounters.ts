// data/encounters.ts - Encounter definitions using async MetaTransforms
// Ported from main.ts to use the new state-based architecture

import { Encounter, encounters,
    MetaState, MetaTransform,
    addBuffer, gainCard, gainEvent, gainPotion, gainRelic, removeRelic,
    removeCard, removeEvent,
    getRewardOptionCount,
    RelicSpec, Relic,
    GainRelicEvent,
    GameSetupParams,
    compose,
    noop,
} from '../metaLogic.js'
import { elegantQuill, emptyBottle, inkwell } from './relics.js'
import { create, State, CardSpec,
    cardRewards, eventRewards, relicRewards, potionRewards,
    leq,
    coin,
    free
 } from '../gameLogic.js'

import { Generator } from '../rng.js'
import { mirrorBrew } from './potions.js';

// ----------------------------- Utility Functions

function shuffleArray<T>(array: T[]): T[] {
    const result = [...array]
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]]
    }
    return result
}

// ----------------------------- Encounter Factory Functions

function bottledCard(spec: CardSpec): RelicSpec {
    return {
        name: `Bottled ${spec.name}`,
        triggers: [{
            kind: 'gameStart',
            text: `Start each course with a copy of ${spec.name} in hand.`,
            handles: () => true,
            transform: () => async function (state: State) {
                state = await create(spec, 'hand')(state)
                return state
            }
        }],
        relatedCards: [spec]
    }
}



export interface EncounterOption {
    name: string
    description: string
    // The effect transforms MetaState, possibly with async UI interactions
    transform: MetaTransform
    // Optional: check if this option should be disabled based on current state
    disabled?: (state: MetaState) => boolean
    displaySpec?: any
    disablesSelf?: boolean
    finishesEncounter?: boolean
}

function simpleEvent({name, description, options}: {name: string, description: string, options: EncounterOption[]}): Encounter {
    async function transform(state: MetaState): Promise<string | null> {
        const takenOptions = new Array(options.length).fill(false);
        while (true) {
            const optionsOpen = options.map((opt, index) => (opt.disabled == undefined || !opt.disabled!(state)) && !takenOptions[index]);
            if (optionsOpen.every(open => !open)) {
                return name; // No more options available
            }
            const choice = await state.ui.chooseOption(
                state,
                description,
                options.map((opt, index) => ({
                    label: opt.name,
                    description: opt.description,
                    spec: opt.displaySpec,
                    disabled: !optionsOpen[index],
                    value: index
                }))
            );
            if (choice == null) return null
            const option = options[choice];
            await option.transform(state);
            if (option.disablesSelf) {
                takenOptions[choice] = true;
            }
            if (option.finishesEncounter === undefined || option.finishesEncounter) {
                return name;
            }
        }
    }
    return {name: name, transform: transform}
}


// Find a Bottle encounter
export function findABottle(s:MetaState, g:Generator): Encounter {
    return simpleEvent({
        name: 'Find a Bottle',
        description: 'Choose how to use this magical bottle.',
        options: [
            {
                name: 'Bottle a Card',
                description: 'Lose a card from your deck costing up to $5. Gain a relic that starts each course with a copy of it (with echo).',
                transform: async function (state: MetaState) {
                    const card = await state.ui.chooseCard(
                        state,
                        'Choose a card to bottle:',
                        [...state.data.collectedCards.filter(x => leq(x.buyCost || free, coin(5)))],
                        true
                    )
                    if (!card) return
                    state.removeCard(card.name)
                    await gainRelic(bottledCard(card))(state)
                },
                disabled: (state: MetaState) => state.data.collectedCards.length === 0,
                finishesEncounter: true,
            },
            {
                name: 'Gain Empty Bottle',
                description: 'Each time you add a card to your deck, start the course with a copy (with echo).',
                transform: gainRelic(emptyBottle),
                finishesEncounter: true,
            }
        ]
    })
}
encounters.push(findABottle)

// TODO: allow someone to cancel from the choice and then go back to the previous screen.

const mirrorName = 'Silver Mirror'
const mirrorRelic: RelicSpec = {
    name: mirrorName,
    simpleText: [
        'The next time you gain a relic,',
        'gain an additional copy of that relic.'
    ],
    metaTriggers: [{
        kind: 'relic',
        handles: (e: GainRelicEvent, s: MetaState, relic: Relic) => e.relic.name != mirrorName,
        transform: (e: GainRelicEvent, s: MetaState, relic: Relic) => async function (state: MetaState) {
            await gainRelic(e.relic.spec)(state)
            state.removeRelic(relic.id)
        }, 
    }]
}

// Mirror Maker encounter
function mirrorMaker(s:MetaState, g:Generator): Encounter {
    return simpleEvent({
        name: 'Mirror Maker',
        description: 'The mirror maker offers magical duplication.',
        options: [
            {
                // TODO: you should be able to just see the potion mirror brew when you mouse over.
                name: 'Grind the mirror into a potion.',
                description: 'Gain a Mirror Brew.',
                transform: gainPotion(mirrorBrew),
                finishesEncounter: true,
            },
            {
                name: 'Use the mirror.',
                description: 'Copy one of your relics.',
                transform: async function (state: MetaState) {
                    const relicSpecs = state.data.relics.map(r => r.spec)
                    const relic = await state.ui.chooseCard(
                        state,
                        'Choose a relic to duplicate:',
                        relicSpecs,
                        true
                    )
                    if (!relic) return
                    await gainRelic(relic)(state)
                },
                disabled: (state: MetaState) => state.data.relics.length === 0,
                finishesEncounter: true,
            },
            {
                name: 'Take the mirror for the road.',
                description: 'The next time you gain a relic, gain another copy.',
                transform: gainRelic(mirrorRelic),
                finishesEncounter: true,
            }
        ]
    })
}
encounters.push(mirrorMaker)

// Variety Pack encounter - pre-generates options at creation time
function varietyPack(s:MetaState, g:Generator): Encounter {
    const offerCard = g.sample(cardRewards)
    const offerEvent = g.sample(eventRewards)
    const offerPotion = g.sample(potionRewards)
    const offerRelic = g.sample(relicRewards)

    return simpleEvent({
        name: 'Variety Pack',
        description: 'Choose one reward from the assortment.',
        options: [
            {
                name: 'Take Card',
                description: '',
                displaySpec: offerCard,
                transform: gainCard(offerCard),
                finishesEncounter: true,
            },
            {
                name: 'Take Event',
                description: '',
                displaySpec: offerEvent,
                transform: gainEvent(offerEvent),
                finishesEncounter: true,
            },
            {
                name: 'Take Potion',
                description: '',
                displaySpec: offerPotion,
                transform: gainPotion(offerPotion),
                finishesEncounter: true,
            },
            {
                name: 'Take Relic',
                description: '',
                displaySpec: offerRelic,
                transform: gainRelic(offerRelic),
                finishesEncounter: true,
            }
        ]
    })
}
encounters.push(varietyPack)

// Trading Post encounter - pre-generates offers at creation time
export function tradingPost(state: MetaState, g: Generator): Encounter {
    const offerCard = g.sample(cardRewards)
    const offerEvent = g.sample(eventRewards)
    const offerPotion = g.sample(potionRewards)
    const offerRelic = g.sample(relicRewards)

    return simpleEvent({
        name: 'Trading Post',
        description: 'Trade items of the same type. You can make multiple trades.',
        options: [
            {
                name: `Trade Card for ${offerCard?.name || 'nothing'}`,
                description: 'Give up one of your cards to receive this one.',
                transform: async function (state: MetaState) {
                    const card = await state.ui.chooseCard(
                        state,
                        'Choose a card to trade away:',
                        [...state.data.collectedCards],
                        true
                    )
                    if (!card) return
                    state.removeCard(card.name)
                    await gainCard(offerCard)(state)
                },
                disablesSelf: true,
                disabled: (state: MetaState) => state.data.collectedCards.length === 0,
                finishesEncounter: false,
            },
            {
                name: `Trade Event for ${offerEvent?.name || 'nothing'}`,
                description: 'Give up one of your events to receive this one.',
                transform: async function (state: MetaState) {
                    const event = await state.ui.chooseCard(
                        state,
                        'Choose an event to trade away:',
                        [...state.data.collectedEvents],
                        true
                    )
                    if (!event) return
                    state.removeEvent(event.name)
                    await gainEvent(offerEvent)(state)
                },
                disabled: (state: MetaState) => state.data.collectedEvents.length === 0,
                disablesSelf: true,
                finishesEncounter: false,
            },
            {
                name: `Trade Potion for ${offerPotion?.name || 'nothing'}`,
                description: 'Give up one of your potions to receive this one.',
                transform: async function (state: MetaState) {
                    const potion = await state.ui.chooseCard(
                        state,
                        'Choose a potion to trade away:',
                        [...state.data.potions],
                        true
                    )
                    if (!potion) return
                    state.removePotion(potion.id)
                    await gainPotion(offerPotion)(state)
                },
                disabled: (state: MetaState) => state.data.potions.length === 0,
                disablesSelf: true,
                finishesEncounter: false,
            },
            {
                name: `Trade Relic for ${offerRelic?.name || 'nothing'}`,
                description: 'Give up one of your relics to receive this one.',
                transform: async function (state: MetaState) {
                    const relic = await state.ui.chooseCard(
                        state,
                        'Choose a relic to trade away:',
                        state.data.relics,
                        true
                    )
                    if (!relic) return
                    state.removeRelic(relic.id)
                    await gainRelic(offerRelic)(state)
                },
                disabled: (state: MetaState) => state.data.relics.length === 0,
                disablesSelf: true,
                finishesEncounter: false,
            },
            {
                name: 'Finish Trading',
                description: 'Done making trades.',
                transform: async function (state: MetaState) {},
                finishesEncounter: true,
            }
        ]
    })
}
encounters.push(tradingPost)

const cursedInkwell: RelicSpec = {
    name: 'Cursed Inkwell',
    simpleText: ['Par is 1@ lower on each course.'],
    metaReplacers: [{
        kind: 'gameSetup',
        replace: (p: GameSetupParams) => ({ ...p, par: p.par - 1 })
    }]
}

// The Scribe encounter
function theScribe(): Encounter {
    return simpleEvent({
        name: 'The Scribe',
        description: 'The scribe offers tools for your journey.',
        options: [
            {
                name: 'Take the Inkwell',
                description: 'Par is 1@ higher on each course.',
                transform: gainRelic(inkwell),
                finishesEncounter: true,
            },
            {
                name: 'Use the quill.',
                description: '+3@ buffer.',
                transform: addBuffer(3),
                finishesEncounter: true,
            },
            {
                name: 'Use the cursed quill.',
                description: '+5@ buffer, but par is 1@ lower on each course.',
                transform: compose(addBuffer(5), gainRelic(cursedInkwell)),
                finishesEncounter: true,
            }
        ]
    })
}
encounters.push(theScribe)