// cardRendering.ts - Card and spec rendering utilities
// Shared between gameUI and metaUI for consistent card display.

import { CardSpec, Cost, VariableCost, Trigger, Replacer, Rule } from './gameLogic.js'
import { cardSpecCost, cardSpecEffects, displayName, cardSpecReplacers, cardSpecStaticReplacers, cardSpecStaticTriggers, cardSpecTriggers, renderCost } from './gameLogic.js'

// ----------------------------- Helper Functions

function isZero(c: Cost | undefined): boolean {
    return c === undefined || renderCost(c) === ''
}

function actionCostKindForSpec(spec: CardSpec): 'play' | 'use' {
    return spec.buyCost === undefined ? 'use' : 'play'
}

// ----------------------------- Text Rendering

function renderEffects(spec: CardSpec): string {
    const parts: string[] = []
    for (const effect of cardSpecEffects(spec)) {
        parts.push(...effect.text)
    }
    return parts.map(x => `<div>${x}</div>`).join('')
}

function renderAbility(spec: CardSpec): string {
    const parts: string[] = []
    for (const effect of spec.ability || []) {
        parts.push(...effect.text.map(x => `<div>(ability) ${x}</div>`))
    }
    return parts.join('')
}

function renderTrigger(x: Trigger | Replacer, staticTrigger: boolean): string {
    const desc = staticTrigger ? '(static)' : '(effect)'
    return `<div>${desc} ${x.text}</div>`
}

function renderVariableCosts(cs: VariableCost[]): string {
    return cs.map(c => `<div>(cost) +${c.text}</div>`).join('')
}

function renderBuyable(bs: { text?: string }[]): string {
    return bs.map(
        b => b.text === undefined ? '' : `<div>(req) ${b.text}</div>`
    ).join('')
}

function renderRuleText(rule: Rule): string {
    const parts: string[] = []
    for (const trigger of (rule.triggers || [])) {
        parts.push(`<div>(rule) ${trigger.text}</div>`)
    }
    for (const replacer of (rule.replacers || [])) {
        parts.push(`<div>(rule) ${replacer.text}</div>`)
    }
    return parts.join('')
}

// ----------------------------- Card Text (Full Detail)

export function cardText(spec: CardSpec): string {
    const effectHtml = renderEffects(spec)
    const buyableHtml = spec.restrictions ? renderBuyable(spec.restrictions) : ''
    const costHtml = spec.variableCosts ? renderVariableCosts(spec.variableCosts) : ''
    const abilitiesHtml = renderAbility(spec)
    const triggerHtml = cardSpecTriggers(spec).map(x => renderTrigger(x, false)).join('')
    const replacerHtml = cardSpecReplacers(spec).map(x => renderTrigger(x, false)).join('')
    const staticTriggerHtml = cardSpecStaticTriggers(spec).map(x => renderTrigger(x, true)).join('')
    const staticReplacerHtml = cardSpecStaticReplacers(spec).map(x => renderTrigger(x, true)).join('')
    const rulesHtml = (spec.rules || []).map(renderRuleText).join('')

    return [
        buyableHtml, costHtml, effectHtml, abilitiesHtml,
        triggerHtml, replacerHtml, staticTriggerHtml, staticReplacerHtml, rulesHtml
    ].join('')
}

// ----------------------------- Spec Rendering

function renderSpecSimpleBody(spec: CardSpec): string {
    return (spec.simpleText && (spec.upgrades || []).length === 0)
        ? spec.simpleText.map(line => `<div>${line}</div>`).join('')
        : cardText(spec)
}

function buildSimpleTooltipForSingleSpec(spec: CardSpec): string {
    const buyCost = cardSpecCost(spec, 'buy')
    const actionCost = cardSpecCost(spec, actionCostKindForSpec(spec))
    const buyStr = !isZero(buyCost) ? `(${renderCost(buyCost as Cost)})` : '---'
    const costStr = !isZero(actionCost) ? `(${renderCost(actionCost as Cost)})` : '---'
    const header = `<div>---${buyStr} ${displayName(spec)} ${costStr}---</div>`
    const body = renderSpecSimpleBody(spec)
    return `${header}${body}`
}

// Build full HTML tooltip for a card spec (matching in-game tooltip style)
export function buildSpecTooltipFull(spec: CardSpec): string {
    const buyCost = cardSpecCost(spec, 'buy')
    const actionCost = cardSpecCost(spec, actionCostKindForSpec(spec))
    const buyStr = !isZero(buyCost) ? `(${renderCost(buyCost as Cost)})` : '---'
    const costStr = !isZero(actionCost) ? `(${renderCost(actionCost as Cost)})` : '---'
    const header = `<div>---${buyStr} ${displayName(spec)} ${costStr}---</div>`
    const baseFilling = header + cardText(spec)

    // Related cards
    const relatedCards = spec.relatedCards || []
    const relatedFilling = relatedCards.map(r => buildSpecTooltip(r)).join('')

    return `${baseFilling}${relatedFilling}`
}

export function buildSpecTooltipSimple(spec: CardSpec): string {
    const mine = buildSimpleTooltipForSingleSpec(spec)
    const related = (spec.relatedCards || []).map(buildSimpleTooltipForSingleSpec).join('')
    return `${mine}${related}`
}

export function buildSpecTooltipOnlyRelatedSimple(spec: CardSpec): string {
    const rules = (spec.rules || []).map(renderRuleText).join('')
    const related = (spec.relatedCards || []).map(buildSimpleTooltipForSingleSpec).join('')
    return `${rules}${related}`
}

export type SpecTooltipMode = 'default' | 'onlyRelated'

// Render a CardSpec without related cards inline, but with tooltip
// Uses simpleText if available for compact display
export function renderSpecNoRelated(spec: CardSpec, tooltipMode: SpecTooltipMode = 'default'): string {
    const buyCost = cardSpecCost(spec, 'buy')
    const actionCost = cardSpecCost(spec, actionCostKindForSpec(spec))
    const buyText = isZero(buyCost) ? '' : `(${renderCost(buyCost as Cost)})&nbsp;`
    const costText = isZero(actionCost) ? '' : `&nbsp;(${renderCost(actionCost as Cost)})`
    const header = `<div>${buyText}<strong>${displayName(spec)}</strong>${costText}</div>`

    // Use simpleText if available, otherwise full card text
    const displayText = renderSpecSimpleBody(spec)

    const hasRelatedCards = (spec.relatedCards || []).length > 0
    const hasRelatedRules = (spec.rules || []).length > 0
    const hasRelatedContent = hasRelatedCards || hasRelatedRules
    if (tooltipMode === 'onlyRelated' && hasRelatedContent) {
        const tooltipSimple = buildSpecTooltipOnlyRelatedSimple(spec)
        const tooltipFull = buildSpecTooltipFull(spec)
        return `<div class='spec has-related-only'>${header}${displayText}<span class='tooltip tooltip-simple'>${tooltipSimple}</span><span class='tooltip tooltip-full'>${tooltipFull}</span></div>`
    }

    if (hasRelatedCards) {
        const tooltipSimple = buildSpecTooltipSimple(spec)
        const tooltipFull = buildSpecTooltipFull(spec)
        return `<div class='spec has-related'>${header}${displayText}<span class='tooltip tooltip-simple'>${tooltipSimple}</span><span class='tooltip tooltip-full'>${tooltipFull}</span></div>`
    }

    if (tooltipMode === 'onlyRelated') {
        return `<div class='spec'>${header}${displayText}</div>`
    }

    const tooltipHtml = buildSpecTooltipFull(spec)
    return `<div class='spec'>${header}${displayText}<span class='tooltip'>${tooltipHtml}</span></div>`
}

// Backward-compatible export for existing callsites.
export function buildSpecTooltip(spec: CardSpec): string {
    return buildSpecTooltipFull(spec)
}

// Render a CardSpec with full details including related cards
export function renderSpec(spec: CardSpec): string {
    const buyCost = cardSpecCost(spec, 'buy')
    const actionCost = cardSpecCost(spec, actionCostKindForSpec(spec))
    const buyText = isZero(buyCost) ? '' : `(${renderCost(buyCost as Cost)})&nbsp;`
    const costText = isZero(actionCost) ? '' : `&nbsp;(${renderCost(actionCost as Cost)})`
    const header = `<div>${buyText}<strong>${displayName(spec)}</strong>${costText}</div>`
    const me = `<div class='spec'>${header}${cardText(spec)}</div>`
    const related = (spec.relatedCards || []).map(renderSpec)
    return [me, ...related].join('')
}

// Render a simple card header (name + cost) without text
export function renderSpecHeader(spec: CardSpec): string {
    const buyCost = cardSpecCost(spec, 'buy')
    const actionCost = cardSpecCost(spec, actionCostKindForSpec(spec))
    const buyText = isZero(buyCost) ? '' : `(${renderCost(buyCost as Cost)})&nbsp;`
    const costText = isZero(actionCost) ? '' : `&nbsp;(${renderCost(actionCost as Cost)})`
    return `${buyText}<strong>${displayName(spec)}</strong>${costText}`
}

// Render just the simple description (for tooltips in other contexts)
export function renderSpecSimple(spec: CardSpec): string {
    if (spec.simpleText && (spec.upgrades || []).length === 0) {
        return spec.simpleText.join(' ')
    }
    return displayName(spec)
}
