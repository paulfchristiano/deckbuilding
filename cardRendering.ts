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

function isRelicSpec(spec: CardSpec): boolean {
    return spec.isRelic === true
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

function renderAbility(spec: CardSpec, plain: boolean): string {
    const parts: string[] = []
    for (const effect of spec.ability || []) {
        parts.push(...effect.text.map(x => plain ? `<div>${x}</div>` : `<div>(ability) ${x}</div>`))
    }
    return parts.join('')
}

function renderTrigger(x: Trigger | Replacer, staticTrigger: boolean, plain: boolean): string {
    if (plain) return renderLines(x.text)
    const desc = staticTrigger ? '(static)' : '(effect)'
    return renderLines(x.text, desc)
}

function renderVariableCosts(cs: VariableCost[], plain: boolean): string {
    const parts: string[] = []
    for (const variableCost of cs) {
        for (const line of variableCost.text) {
            parts.push(plain ? `<div>+${line}</div>` : `<div>(cost) +${line}</div>`)
        }
    }
    return parts.join('')
}

function renderBuyable(bs: { text?: string[] }[], plain: boolean): string {
    const parts: string[] = []
    for (const restriction of bs) {
        if (restriction.text === undefined) continue
        for (const line of restriction.text) {
            parts.push(plain ? `<div>${line}</div>` : `<div>(req) ${line}</div>`)
        }
    }
    return parts.join('')
}

function renderRuleText(rule: Rule, plain: boolean): string {
    const parts: string[] = []
    for (const trigger of (rule.triggers || [])) {
        parts.push(plain ? renderLines(trigger.text) : renderLines(trigger.text, '(rule)'))
    }
    for (const replacer of (rule.replacers || [])) {
        parts.push(plain ? renderLines(replacer.text) : renderLines(replacer.text, '(rule)'))
    }
    return parts.join('')
}

function renderMetaText(spec: CardSpec, plain: boolean): string {
    const x = asMetaTextSpec(spec)
    const parts: string[] = []
    for (const replacer of (x.metaReplacers || [])) {
        parts.push(plain ? renderLines(replacer.text) : renderLines(replacer.text, '(meta)'))
    }
    for (const trigger of (x.metaTriggers || [])) {
        parts.push(plain ? renderLines(trigger.text) : renderLines(trigger.text, '(meta)'))
    }
    return parts.join('')
}

// ----------------------------- Memoization

// All rendering functions here are pure functions of CardSpec.
// Specs are module-level constants with stable object identity, so WeakMap
// caches make repeated calls (e.g. on every metagame re-render) essentially free.
const cardTextCache = new WeakMap<CardSpec, string>()
const tooltipFullCache = new WeakMap<CardSpec, string>()
const tooltipSimpleCache = new WeakMap<CardSpec, string>()
const tooltipOnlyRelatedSimpleCache = new WeakMap<CardSpec, string>()
const specNoRelatedDefaultCache = new WeakMap<CardSpec, string>()
const specNoRelatedOnlyRelatedCache = new WeakMap<CardSpec, string>()

// ----------------------------- Card Text (Full Detail)

export function cardText(spec: CardSpec): string {
    const cached = cardTextCache.get(spec)
    if (cached !== undefined) return cached
    const plain = isRelicSpec(spec)
    const effectHtml = renderEffects(spec)
    const buyableHtml = spec.restrictions ? renderBuyable(spec.restrictions, plain) : ''
    const costHtml = spec.variableCosts ? renderVariableCosts(spec.variableCosts, plain) : ''
    const abilitiesHtml = renderAbility(spec, plain)
    const triggerHtml = cardSpecTriggers(spec).map(x => renderTrigger(x, false, plain)).join('')
    const replacerHtml = cardSpecReplacers(spec).map(x => renderTrigger(x, false, plain)).join('')
    const staticTriggerHtml = cardSpecStaticTriggers(spec).map(x => renderTrigger(x, true, plain)).join('')
    const staticReplacerHtml = cardSpecStaticReplacers(spec).map(x => renderTrigger(x, true, plain)).join('')
    const rulesHtml = cardSpecRules(spec).map(rule => renderRuleText(rule, plain)).join('')
    const metaHtml = renderMetaText(spec, plain)
    const result = [
        buyableHtml, costHtml, effectHtml, abilitiesHtml,
        triggerHtml, replacerHtml, staticTriggerHtml, staticReplacerHtml, rulesHtml, metaHtml
    ].join('')
    cardTextCache.set(spec, result)
    return result
}

// ----------------------------- Spec Rendering

function renderSpecSimpleBody(spec: CardSpec): string {
    return cardSpecSimpleLines(spec).map(line => `<div>${line}</div>`).join('')
}

function buildSimpleTooltipForSingleSpec(spec: CardSpec): string {
    const relic = isRelicSpec(spec)
    const buyCost = cardSpecCost(spec, 'buy')
    const actionCost = cardSpecCost(spec, actionCostKindForSpec(spec))
    const buyStr = relic ? '---' : (!isZero(buyCost) ? `(${renderCost(buyCost as Cost)})` : '---')
    const costStr = relic ? '---' : (!isZero(actionCost) ? `(${renderCost(actionCost as Cost)})` : '---')
    const header = `<div>---${buyStr} ${displayName(spec)} ${costStr}---</div>`
    const body = renderSpecSimpleBody(spec)
    return `${header}${body}`
}

// Build full HTML tooltip for a card spec (matching in-game tooltip style)
export function buildSpecTooltipFull(spec: CardSpec): string {
    const cached = tooltipFullCache.get(spec)
    if (cached !== undefined) return cached
    const relic = isRelicSpec(spec)
    const buyCost = cardSpecCost(spec, 'buy')
    const actionCost = cardSpecCost(spec, actionCostKindForSpec(spec))
    const buyStr = relic ? '---' : (!isZero(buyCost) ? `(${renderCost(buyCost as Cost)})` : '---')
    const costStr = relic ? '---' : (!isZero(actionCost) ? `(${renderCost(actionCost as Cost)})` : '---')
    const header = `<div>---${buyStr} ${displayName(spec)} ${costStr}---</div>`
    const baseFilling = header + cardText(spec)
    const relatedCards = spec.relatedCards || []
    const relatedFilling = relatedCards.map(r => buildSpecTooltip(r)).join('')
    const result = `${baseFilling}${relatedFilling}`
    tooltipFullCache.set(spec, result)
    return result
}

export function buildSpecTooltipSimple(spec: CardSpec): string {
    const cached = tooltipSimpleCache.get(spec)
    if (cached !== undefined) return cached
    const mine = buildSimpleTooltipForSingleSpec(spec)
    const related = (spec.relatedCards || []).map(buildSimpleTooltipForSingleSpec).join('')
    const result = `${mine}${related}`
    tooltipSimpleCache.set(spec, result)
    return result
}

export function buildSpecTooltipOnlyRelatedSimple(spec: CardSpec): string {
    const cached = tooltipOnlyRelatedSimpleCache.get(spec)
    if (cached !== undefined) return cached
    const rules = cardSpecRules(spec).map(rule => renderRuleText(rule, false)).join('')
    const related = (spec.relatedCards || []).map(buildSimpleTooltipForSingleSpec).join('')
    const result = `${rules}${related}`
    tooltipOnlyRelatedSimpleCache.set(spec, result)
    return result
}

export type SpecTooltipMode = 'default' | 'onlyRelated'

// Render a CardSpec without related cards inline, but with tooltip
// Uses simpleText if available for compact display
export function renderSpecNoRelated(spec: CardSpec, tooltipMode: SpecTooltipMode = 'default'): string {
    const cache = tooltipMode === 'onlyRelated' ? specNoRelatedOnlyRelatedCache : specNoRelatedDefaultCache
    const cached = cache.get(spec)
    if (cached !== undefined) return cached
    const relic = isRelicSpec(spec)
    const buyCost = cardSpecCost(spec, 'buy')
    const actionCost = cardSpecCost(spec, actionCostKindForSpec(spec))
    const buyText = relic ? '' : (isZero(buyCost) ? '' : `(${renderCost(buyCost as Cost)})&nbsp;`)
    const costText = relic ? '' : (isZero(actionCost) ? '' : `&nbsp;(${renderCost(actionCost as Cost)})`)
    const header = `<div>${buyText}<strong>${displayName(spec)}</strong>${costText}</div>`

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
    cache.set(spec, result)
    return result
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
