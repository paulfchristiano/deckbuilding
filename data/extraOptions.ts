import { CardSpec, displayName } from '../gameLogic.js'
import {
    addBuffer,
    addTimelineAction,
    registerExtraOption,
    removeRelic,
    SimpleRewardState,
    pickRewardOption,
    rewardPickAdjustments,
} from '../metaLogic.js'

function rewardOptionNames(rewardState: SimpleRewardState): string[] {
    return rewardState.options.map(option => displayName(option as CardSpec))
}

registerExtraOption({
    id: 'singingBowl',
    selectionMarker: -4,
    render: (rewardState) => {
        const skipped = rewardOptionNames(rewardState)
        const details = skipped.length > 0 ? `Skipped: ${skipped.join(', ')}` : undefined
        return {
            label: '+2 Buffer',
            compact: true,
            transform: async state => {
                await addTimelineAction('Gain 2 buffer', details)(state)
                await addBuffer(2)(state)
            }
        }
    }
})

registerExtraOption({
    id: 'takeItAll',
    selectionMarker: -2,
    render: (rewardState) => {
        const taken = rewardOptionNames(rewardState)
        const details = taken.length > 0 ? `${taken.join(', ')}` : undefined
        return {
            label: 'Take it all',
            compact: true,
            transform: async state => {
                // Compute adjustments before any mutations so Sozu/Broken Crown fire correctly
                const adjustments = rewardPickAdjustments(rewardState.kind, rewardState.options.length, state)
                const piggyBank = state.data.relics.find(relic => relic.name === 'Piggy Bank')
                if (piggyBank) await removeRelic(state, piggyBank.id)
                await addTimelineAction('Take it all', details)(state)
                for (let i = 0; i < rewardState.options.length; i++) {
                    const option = rewardState.options[i] as CardSpec
                    await pickRewardOption(option, rewardState.kind, adjustments[i] ?? 0, { silent: true })(state)
                }
            }
        }
    }
})

registerExtraOption({
    id: 'destroyCursedKey',
    selectionMarker: -3,
    render: (rewardState) => {
        const skipped = rewardOptionNames(rewardState)
        const details = skipped.length > 0 ? `Skipped: ${skipped.join(', ')}` : undefined
        return {
            label: 'Destroy Cursed Key',
            compact: true,
            transform: async state => {
                const cursedKey = state.data.relics.find(relic => relic.name === 'Cursed Key')
                if (cursedKey) await removeRelic(state, cursedKey.id)
                await addTimelineAction('Destroy Cursed Key', details)(state)
            }
        }
    }
})
