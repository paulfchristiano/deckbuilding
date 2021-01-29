import { cardsAndEvents, makeKingdom, GameSpec, Kingdom } from '../public/logic.js'
import { allCardsEvents } from '../public/main.js'

const N = 100000
const counts:Map<string, number> = new Map()

function increment<T>(x:Map<T, number>, key:T): void {
	x.set(key, (x.get(key)||0) + 1)
}

for (let i = 0; i < N; i++) {
	const seed = `testseed.${i}`
	const spec:GameSpec = {kind: 'full', randomizer: {seed: seed, expansions: ['base']}}
	const kingdom:Kingdom = makeKingdom(spec, allCardsEvents)
	const names:string[] = kingdom.cards.map(c => c.name)
	for (const a of names) {
		for (const b of names) {
			for (const c of names) {
				if (a != b && a != c && b != c) {
					const key = a + b + c
					increment(counts, key)
				}
			}
		}
	}
}

const countCounts:Map<number, number> = new Map()
const K = 10000

for (const [key, count] of counts) {
	increment(countCounts, Math.floor(count * K / N))
}

for (let i = 0; i < K; i++) {
	if (countCounts.has(i)) {
		console.log(`${i}: ${(countCounts.get(i)||0) / 6}`)
	}
}
