(Overview written by claude for claude)

# Roguelike Deckbuilding Game Engine

A browser-based roguelike deckbuilder built with TypeScript. Players progress through 8 stages, collecting cards, events, potions, and relics while trying to meet victory point targets within par constraints.

**Hosted at:** [engine-game.com](https://engine-game.com)

## Setup

- Compile TypeScript: `npm install && npm run build` (or `tsc -w -p .` for watch mode)
- Serve locally: `cd public && python -m http.server 8080`, then open `http://localhost:8080/`

## Directory Structure

```
/
├── *.ts                      # Source files (game engine)
├── data/*.ts                 # Source files (game content)
├── public/                   # Compiled output + static assets
│   ├── *.js                  # Compiled JavaScript (gitignored)
│   ├── data/*.js             # Compiled JavaScript (gitignored)
│   ├── index.html            # Entry point
│   └── style.css             # Game styles
├── package.json              # Node dependencies
└── tsconfig.json             # TypeScript configuration
```

## Architecture Overview

### Two Parallel State Systems

The game has two independent state management systems that operate at different levels:

#### 1. MetaState (Roguelike Progression)

`MetaState` in `metaLogic.ts` manages the roguelike layer:

```typescript
interface MetaStateData {
    stage: number                    // Current stage (0-7)
    buffer: number                   // Health/life (starts at 10)
    challenge: ChallengeSpec | null  // Current stage configuration
    rewards: Reward[]                // Pending rewards to claim
    collectedCards: CardSpec[]       // Cards collected (persist across stages)
    collectedEvents: CardSpec[]      // Events collected (persist across stages)
    potions: Card[]                  // Consumable items
    relics: Relic[]                  // Persistent artifacts
    stageScores: (number | null)[]   // Score history
    stagePars: (number | null)[]     // Par history
}
```

`MetaState` is a class that wraps `MetaStateData` and provides:
- Mutable updates via `update(partial)` method
- Undo/redo via checkpoint-based system
- Seeded RNG via `Generator` instances

#### 2. State (Individual Game)

`State` in `gameLogic.ts` manages a single card game:

```typescript
class State {
    // Resources
    coin: number
    energy: number      // @ symbol - action points
    points: number      // Victory points earned
    actions: number
    buys: number

    // Zones (arrays of Cards)
    hand: Zone
    supply: Zone
    discard: Zone
    play: Zone
    events: Zone
    potions: Zone
    relics: Zone
    void: Zone

    // Undo system
    checkpoint: State | null
    history: Replayable[]
    future: Replayable[]
    redo: Replayable[]
}
```

`State` is **immutable** - all updates return a new State via `update(partial)`.

### How the Meta Game Starts Individual Games

The main entry point is `playGame()` in `metaLogic.ts`:

```typescript
async function playGame(ui: MetaUI, test: TestSpec | null): Promise<void> {
    const state = new MetaState(ui)
    // ... initialize first path with rewards and challenge

    while (true) {
        if (state.data.playingGame) {
            // Build a GameSpec from challenge + collected cards/events/potions/relics
            const gameSpec = makeSpec(state, state.data.challenge!)

            // Hand off to the UI to run the actual card game
            const { score, potionsRemaining } = await state.ui.playGame(gameSpec)

            // Process results
            await endCourse(score, gameSpec.par, state)
            state.update({ stage: state.data.stage + 1 })
            // ... pick next path or end game
        } else {
            // Player picks rewards or starts the challenge
            const choice = await state.ui.pickNextStep(state)
            // ... handle reward selection or start game
        }
    }
}
```

The `MetaUI.playGame(spec)` method (in `metaUI.ts`) calls `startGame(spec)` from `gameUI.ts`, which:
1. Creates an initial `State` from the `GameSpec`
2. Runs `mainLoop()` to process turns until victory or loss
3. Returns a `VictoryData` with score and remaining potions

If the player undoes past the beginning of a game, an `UndoPastBeginning` exception propagates up and becomes an `Undo` in the meta layer.

### The Undo System

Both state systems support undo, but with different mechanisms:

#### Game State Undo (Immutable + Replay)

The game `State` uses an immutable checkpoint-based system:

- **checkpoint**: A saved State that can be returned to
- **history**: List of `Replayable` actions taken since checkpoint
- **future**: Actions that can be replayed (populated during undo)
- **redo**: Actions available for redo

Key operations:
- `setCheckpoint()`: Save current state, clear history
- `backup()`: Return to checkpoint with history moved to future
- `addHistory(action)`: Record an action for potential replay

When undoing:
1. Return to `checkpoint` state
2. Move `history` to `future`
3. Pop actions from `future` until reaching the desired point
4. Replay remaining `future` actions

This allows undoing to any previous decision point while preserving the ability to replay forward.

#### Meta State Undo (Checkpoint Stack)

The `MetaState` uses a simpler stack-based system:

```typescript
class MetaState {
    checkpoint: MetaStateData      // Last committed state
    undoStack: MetaStateData[]     // Previous checkpoints
    redoStack: MetaStateData[]     // Undone checkpoints
    data: MetaStateData            // Current state
}
```

Key operations:
- `setCheckpoint()`: Push current checkpoint to undoStack, make current data the new checkpoint
- `undo()`: If data != checkpoint, revert to checkpoint. Otherwise pop from undoStack.
- `redo()`: Pop from redoStack and restore

Checkpoints are set after each reward selection or before starting a game.

### The Replacer System

Replacers intercept and modify parameters before actions execute. They're the primary mechanism for cards to affect costs, movements, and other game mechanics.

#### Replacer Interface

```typescript
interface Replacer<T extends Params, S = Card> {
    text: string                                    // Description for display
    kind: T['kind']                                 // Which param type this handles
    handles: (p: T, s: State, source: S) => boolean // Should this replacer apply?
    replace: (p: T, s: State, source: S) => T       // Transform the params
}
```

#### How Replacement Works

The `replace()` function in `gameLogic.ts` applies all matching replacers:

```typescript
function replace<T extends Params>(x: T, state: State): T {
    // Collect replacers from relevant zones
    const replacers: [Card, TypedReplacer][] = []

    // Static replacers (active in supply, events, relics)
    for (const card of state.events.concat(state.supply).concat(state.relics))
        for (const replacer of card.staticReplacers())
            replacers.push([card, replacer])

    // Normal replacers (active only when card is in play)
    for (const card of state.play)
        for (const replacer of card.replacers())
            replacers.push([card, replacer])

    // Apply each matching replacer
    for (const [card, replacer] of replacers) {
        if (replacer.kind == x.kind && replacer.handles(x, state, card)) {
            x = replacer.replace(x, state, card)
        }
    }

    // Then apply rule replacers (global effects)
    // ...

    return x
}
```

#### Common Replacer Kinds

- **cost** / **costIncrease**: Modify card costs (discounts, surcharges)
- **move**: Intercept card movement (e.g., trash instead of discard)
- **create**: Modify newly created cards
- **resource**: Modify resource gains

#### Meta Replacers

Relics can have `metaReplacers` that modify game setup:

```typescript
type MetaReplacer =
    | { kind: 'gameSetup', replace: (params: GameSetupParams) => GameSetupParams }
    | { kind: 'reward', replace: (params: RewardParams) => RewardParams }
```

These can adjust par, VP targets, available cards, or reward options.

### The Trigger System

Triggers respond to game events after they occur:

```typescript
interface Trigger<T extends GameEvent> {
    text: string
    kind: T['kind']
    handles: (e: T, s: State, source: Card | null) => boolean
    transform: (e: T, s: State, source: Card | null) => Transform
}
```

Trigger kinds include: `play`, `afterPlay`, `buy`, `afterBuy`, `use`, `afterUse`, `activate`, `move`, `discard`, `create`, `cost`, `resource`, `gainCharge`, `removeTokens`, `addToken`, `beforeStart`, `afterStart`.

Like replacers, triggers can be:
- **Normal triggers**: Active only when the card is in play
- **Static triggers**: Active when in supply, events, or relics zones

### The Transform System

All game effects are expressed as `Transform` functions:

```typescript
type Transform = (state: State) => Promise<State> | State
```

Transforms can be sync or async (for UI choices). They're composed using helpers and always return a new State.

The meta layer uses a similar but mutable pattern:

```typescript
type MetaTransform = (state: MetaState) => Promise<void> | void
```

### Cards and Specs

A `CardSpec` defines a card type (static definition):

```typescript
interface CardSpec {
    name: string
    fixedCost?: Cost
    variableCosts?: VariableCost[]
    buyCost?: Cost
    effects?: Effect[]
    triggers?: TypedTrigger[]
    staticTriggers?: TypedTrigger[]
    replacers?: TypedReplacer[]
    staticReplacers?: TypedReplacer[]
    ability?: Effect[]
    simpleText?: string[]
    relatedCards?: CardSpec[]
    isPotion?: boolean
    rules?: Rule[]
}
```

A `Card` is an instance with runtime state:

```typescript
class Card {
    readonly spec: CardSpec
    readonly id: number
    readonly ticks: number[]           // For "each time" effects
    readonly tokens: Map<Token, number> // Charge tokens, etc.
    readonly place: PlaceName
    readonly zoneIndex: number         // For consistent hotkey mapping
}
```

Cards are immutable - `update()` returns a new Card.

## Core Source Files

### Game Engine

| File | Purpose |
|------|---------|
| `main.ts` | Entry point. Loads data, initializes MetaGameUI, calls `playGame()` |
| `gameLogic.ts` | Core card game: `Card`, `State`, transforms, triggers, replacers, cost system |
| `metaLogic.ts` | Roguelike layer: `MetaState`, `Relic`, stages, paths, rewards, challenges |
| `gameUI.ts` | In-game UI: hotkeys, logging, zone rendering, `startGame()`, `mainLoop()` |
| `metaUI.ts` | Meta UI: `MetaGameUI` class, card pickers, path selection, stage screens |
| `cardRendering.ts` | Shared card display: tooltips, effect text rendering |
| `rng.ts` | Deterministic RNG using FNV-1a hash for seeded randomness |

### Game Content (`data/`)

| File | Purpose |
|------|---------|
| `index.ts` | Loads and exports all content arrays |
| `cards.ts` | Reward cards added to deck during runs |
| `events.ts` | Event cards with special abilities |
| `victory.ts` | VP cards/events, `vpModes[]` defining 15+ victory conditions |
| `relics.ts` | Persistent artifacts with meta-replacers and meta-triggers |
| `potions.ts` | Single-use consumables (trashed after use) |
| `boons.ts` | Stage modifiers that add cards/events and reduce par |
| `encounters.ts` | Interactive reward events (Trading Post, Bottle, etc.) |
| `curses.ts` | Curse/debuff cards |
| `utils.ts` | Helper functions for common card effects |

## Game Flow

1. **Initialize** - Create `MetaState` with stage 0, buffer 10
2. **Path Selection** - Choose between paths (different VP modes + boons)
3. **Reward Phase** - Claim pending rewards (cards, events, potions, relics, encounters)
4. **Build GameSpec** - Combine challenge + collected items, apply meta-replacers
5. **Play Game** - Run card game until VP target reached
6. **Score** - Compare score to par; lose buffer if below par
7. **Advance** - Move to next stage, generate new paths
8. **Victory/Defeat** - Complete 8 stages (win) or buffer reaches 0 (lose)

## Constants

- `TOTAL_STAGES = 8`
- `INITIAL_BUFFER = 10`
- `BASE_PARS = [30, 27, 25, 23, 21, 19, 18, 8]`
