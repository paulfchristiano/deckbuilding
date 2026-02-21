// registry.ts - Type-agnostic spec registry by name.
import {
    CardSpec,
    cardRewards,
    eventRewards,
    potionRewards,
    relicRewards,
    core,
    boons,
    vpModes
} from './gameLogic.js'

const extraSpecsByName = new Map<string, CardSpec>()

export function registerSpec(spec: CardSpec): void {
    extraSpecsByName.set(spec.name, spec)
}

export function registerRelicSpec(spec: CardSpec): void {
    spec.isRelic = true
    registerSpec(spec)
}

export function addRelicReward(spec: CardSpec): void {
    spec.isRelic = true
    relicRewards.push(spec)
}

export function getSpecByName(name: string): CardSpec | null {
    if (extraSpecsByName.has(name)) return extraSpecsByName.get(name)!

    const byName = new Map<string, CardSpec>()
    for (const spec of allKnownSpecs()) {
        if (!byName.has(spec.name)) byName.set(spec.name, spec)
    }
    return byName.get(name) ?? null
}

function allKnownSpecs(): CardSpec[] {
    return [
        ...cardRewards,
        ...eventRewards,
        ...potionRewards,
        ...relicRewards,
        ...core.cards,
        ...core.events,
        ...vpModes.flatMap(vpMode => [...vpMode.cards, ...vpMode.events]),
        ...boons.flatMap(boon => [...boon.cards, ...boon.events]),
        ...extraSpecsByName.values(),
    ]
}
