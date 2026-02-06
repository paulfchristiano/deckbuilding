export interface ProgressStageDisplay {
    stage: number
    completed?: boolean
    current?: boolean
    replayable?: boolean
    replaying?: boolean
    scoreText?: string
    scoreColor?: string
    tooltipText?: string
    onClick?: (() => void) | null
}

function createTooltip(text: string): HTMLSpanElement {
    const tooltip = document.createElement('span')
    tooltip.className = 'tooltip'
    tooltip.style.whiteSpace = 'pre-line'
    tooltip.textContent = text
    return tooltip
}

export function renderProgressSidebar(
    selector: string,
    stages: ProgressStageDisplay[]
): void {
    const circles = document.querySelectorAll(`${selector} .progressCircle`)
    const byStage = new Map<number, ProgressStageDisplay>()
    for (const stage of stages) {
        byStage.set(stage.stage, stage)
    }

    circles.forEach(circle => {
        const el = circle as HTMLElement
        const stage = parseInt(el.getAttribute('data-stage') || '-1')
        const display = byStage.get(stage)

        el.classList.remove('completed', 'current', 'replayable', 'replaying')
        el.onclick = null
        const existingScore = el.querySelector('.progressScore')
        if (existingScore) existingScore.remove()
        const existingTooltips = el.querySelectorAll('.tooltip')
        existingTooltips.forEach(node => node.remove())

        if (!display) return
        if (display.completed) el.classList.add('completed')
        if (display.current) el.classList.add('current')
        if (display.replayable) el.classList.add('replayable')
        if (display.replaying) el.classList.add('replaying')
        if (display.onClick) el.onclick = display.onClick

        let tooltipTarget: HTMLElement = el
        if (display.scoreText !== undefined) {
            const scoreSpan = document.createElement('span')
            scoreSpan.className = 'progressScore'
            scoreSpan.textContent = display.scoreText
            if (display.scoreColor) scoreSpan.style.color = display.scoreColor
            el.appendChild(scoreSpan)
            tooltipTarget = scoreSpan
        }
        if (display.tooltipText && display.tooltipText.length > 0) {
            tooltipTarget.appendChild(createTooltip(display.tooltipText))
        }
    })
}
