// cardRendering.ts - Card and spec rendering utilities
// Shared between gameUI and metaUI for consistent card display.

import { CardSpec, Cost, VariableCost, Trigger, Replacer, Rule } from './gameLogic.js'
import { cardSpecCost, cardSpecEffects, cardSpecRules, cardSpecSimpleLines, displayName, cardSpecReplacers, cardSpecStaticReplacers, cardSpecStaticTriggers, cardSpecTriggers, renderCost } from './gameLogic.js'

// ----------------------------- Helper Functions

function isZero(c: Cost | undefined): boolean {
    return c === undefined || renderCost(c) === ''
}

function actionCostKindForSpec(spec: CardSpec): 'play' | 'use' {
    return spec.buyCost === undefined ? 'use' : 'play'
}

type MetaTextEntry = { text: string[] }
type MetaTextSpec = CardSpec & {
    metaReplacers?: MetaTextEntry[]
    metaTriggers?: MetaTextEntry[]
}

function asMetaTextSpec(spec: CardSpec): MetaTextSpec {
    return spec as MetaTextSpec
}

// ----------------------------- Text Rendering

function renderEffects(spec: CardSpec): string {
    const parts: string[] = []
    for (const effect of cardSpecEffects(spec)) {
        parts.push(...effect.text)
    }
    return parts.map(x => `<div>${x}</div>`).join('')
}

function renderLines(lines: string[], prefix: string | null = null): string {
    if (prefix === null) return lines.map(line => `<div>${line}</div>`).join('')
    return lines.map(line => `<div>${prefix} ${line}</div>`).join('')
}

function renderAbility(spec: CardSpec, isRelic: boolean): string {
    const parts: string[] = []
    for (const effect of spec.ability || []) {
        parts.push(...effect.text.map(x => isRelic ? `<div>${x}</div>` : `<div>(ability) ${x}</div>`))
    }
    return parts.join('')
}

function renderTrigger(x: Trigger | Replacer, staticTrigger: boolean, isRelic: boolean): string {
    if (isRelic) return renderLines(x.text)
    const desc = staticTrigger ? '(static)' : '(effect)'
    return renderLines(x.text, desc)
}

function renderVariableCosts(cs: VariableCost[], isRelic: boolean): string {
    const parts: string[] = []
    for (const variableCost of cs) {
        for (const line of variableCost.text) {
            parts.push(isRelic ? `<div>+${line}</div>` : `<div>(cost) +${line}</div>`)
        }
    }
    return parts.join('')
}

function renderBuyable(bs: { text?: string[] }[], isRelic: boolean): string {
    const parts: string[] = []
    for (const restriction of bs) {
        if (restriction.text === undefined) continue
        for (const line of restriction.text) {
            parts.push(isRelic ? `<div>${line}</div>` : `<div>(req) ${line}</div>`)
        }
    }
    return parts.join('')
}

function renderRuleText(rule: Rule, isRelic: boolean): string {
    const parts: string[] = []
    for (const trigger of (rule.triggers || [])) {
        parts.push(isRelic ? renderLines(trigger.text) : renderLines(trigger.text, '(rule)'))
    }
    for (const replacer of (rule.replacers || [])) {
        parts.push(isRelic ? renderLines(replacer.text) : renderLines(replacer.text, '(rule)'))
    }
    return parts.join('')
}

function renderMetaText(spec: CardSpec, isRelic: boolean): string {
    const x = asMetaTextSpec(spec)
    const parts: string[] = []
    for (const replacer of (x.metaReplacers || [])) {
        parts.push(isRelic ? renderLines(replacer.text) : renderLines(replacer.text, '(meta)'))
    }
    for (const trigger of (x.metaTriggers || [])) {
        parts.push(isRelic ? renderLines(trigger.text) : renderLines(trigger.text, '(meta)'))
    }
    return parts.join('')
}

// ----------------------------- Card Text (Full Detail)

export function cardText(spec: CardSpec, isRelic: boolean): string {
    const effectHtml = renderEffects(spec)
    const buyableHtml = spec.restrictions ? renderBuyable(spec.restrictions, isRelic) : ''
    const costHtml = spec.variableCosts ? renderVariableCosts(spec.variableCosts, isRelic) : ''
    const abilitiesHtml = renderAbility(spec, isRelic)
    const triggerHtml = cardSpecTriggers(spec).map(x => renderTrigger(x, false, isRelic)).join('')
    const replacerHtml = cardSpecReplacers(spec).map(x => renderTrigger(x, false, isRelic)).join('')
    const staticTriggerHtml = cardSpecStaticTriggers(spec).map(x => renderTrigger(x, true, isRelic)).join('')
    const staticReplacerHtml = cardSpecStaticReplacers(spec).map(x => renderTrigger(x, true, isRelic)).join('')
    const rulesHtml = cardSpecRules(spec).map(rule => renderRuleText(rule, isRelic)).join('')
    const metaHtml = renderMetaText(spec, isRelic)
    return [
        buyableHtml, costHtml, effectHtml, abilitiesHtml,
        triggerHtml, replacerHtml, staticTriggerHtml, staticReplacerHtml, rulesHtml, metaHtml
    ].join('')
}

// ----------------------------- Spec Rendering

function renderSpecSimpleBody(spec: CardSpec): string {
    return cardSpecSimpleLines(spec).map(line => `<div>${line}</div>`).join('')
}

function buildSimpleTooltipForSingleSpec(spec: CardSpec): string {
    const buyCost = cardSpecCost(spec, 'buy')
    const actionCost = cardSpecCost(spec, actionCostKindForSpec(spec))
    const buyStr = (!isZero(buyCost) ? `(${renderCost(buyCost as Cost)})` : '---')
    const costStr = (!isZero(actionCost) ? `(${renderCost(actionCost as Cost)})` : '---')
    const header = `<div>---${buyStr} ${displayName(spec)} ${costStr}---</div>`
    const body = renderSpecSimpleBody(spec)
    return `${header}${body}`
}

// Build full HTML tooltip for a card spec (matching in-game tooltip style)
export function buildSpecTooltipFull(spec: CardSpec): string {
    const buyCost = cardSpecCost(spec, 'buy')
    const actionCost = cardSpecCost(spec, actionCostKindForSpec(spec))
    const buyStr = (!isZero(buyCost) ? `(${renderCost(buyCost as Cost)})` : '---')
    const costStr = (!isZero(actionCost) ? `(${renderCost(actionCost as Cost)})` : '---')
    const header = `<div>---${buyStr} ${displayName(spec)} ${costStr}---</div>`
    const baseFilling = header + cardText(spec, false)
    const relatedCards = spec.relatedCards || []
    const relatedFilling = relatedCards.map(r => buildSimpleTooltipForSingleSpec(r)).join('')
    return `${baseFilling}${relatedFilling}`
}

export function buildSpecTooltipSimple(spec: CardSpec): string {
    const mine = buildSimpleTooltipForSingleSpec(spec)
    const related = (spec.relatedCards || []).map(r => buildSimpleTooltipForSingleSpec(r)).join('')
    return `${mine}${related}`
}

export function buildSpecTooltipOnlyRelatedSimple(spec: CardSpec): string {
    const rules = cardSpecRules(spec).map(rule => renderRuleText(rule, false)).join('')
    const related = (spec.relatedCards || []).map(r => buildSimpleTooltipForSingleSpec(r)).join('')
    return `${rules}${related}`
}

export type SpecTooltipMode = 'default' | 'onlyRelated'

export type RenderAuxData = {kind: 'spec'} | {kind: 'relic', charges: number }

// Render a CardSpec without related cards inline, but with tooltip
// Uses simpleText if available for compact display
// aux specifies if you are rendering a relic and its charge.
// TODO: Eventually I want to pass in Renderable here, this si very janky.
export function renderSpecNoRelated(spec: CardSpec, aux: RenderAuxData = {kind: 'spec'}, tooltipMode: SpecTooltipMode = 'default'): string {
    const buyCost = cardSpecCost(spec, 'buy')
    const actionCost = cardSpecCost(spec, actionCostKindForSpec(spec))
    const buyText = aux.kind === 'relic' ? '' : (isZero(buyCost) ? '' : `(${renderCost(buyCost as Cost)})&nbsp;`)
    const costText = aux.kind === 'relic' ? '' : (isZero(actionCost) ? '' : `&nbsp;(${renderCost(actionCost as Cost)})`)
    const relicText = aux.kind === 'relic' && aux.charges > 0 ? ` (${aux.charges})` : ''
    const header = `<div>${buyText}<strong>${displayName(spec)}${relicText}</strong>${costText}</div>`

    // Use simpleText if available, otherwise full card text
    const displayText = renderSpecSimpleBody(spec)

    const hasRelatedCards = (spec.relatedCards || []).length > 0
    let result: string
    if (tooltipMode === 'onlyRelated' && hasRelatedCards) {
        const tooltipSimple = buildSpecTooltipOnlyRelatedSimple(spec)
        const tooltipFull = buildSpecTooltipFull(spec)
        result = `<div class='spec has-related-only'>${header}${displayText}<span class='tooltip tooltip-simple'>${tooltipSimple}</span><span class='tooltip tooltip-full'>${tooltipFull}</span></div>`
    } else if (hasRelatedCards) {
        const tooltipSimple = buildSpecTooltipSimple(spec)
        const tooltipFull = buildSpecTooltipFull(spec)
        result = `<div class='spec has-related'>${header}${displayText}<span class='tooltip tooltip-simple'>${tooltipSimple}</span><span class='tooltip tooltip-full'>${tooltipFull}</span></div>`
    } else if (tooltipMode === 'onlyRelated') {
        result = `<div class='spec'>${header}${displayText}</div>`
    } else {
        const tooltipHtml = buildSpecTooltipFull(spec)
        result = `<div class='spec'>${header}${displayText}<span class='tooltip'>${tooltipHtml}</span></div>`
    }
    return result
}

// Render a CardSpec with full details including related cards
export function renderSpec(spec: CardSpec): string {
    const buyCost = cardSpecCost(spec, 'buy')
    const actionCost = cardSpecCost(spec, actionCostKindForSpec(spec))
    const buyText = isZero(buyCost) ? '' : `(${renderCost(buyCost as Cost)})&nbsp;`
    const costText = isZero(actionCost) ? '' : `&nbsp;(${renderCost(actionCost as Cost)})`
    const header = `<div>${buyText}<strong>${displayName(spec)}</strong>${costText}</div>`
    const me = `<div class='spec'>${header}${cardText(spec, false)}</div>`
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
