const ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function randomString() {
    let result = "";
    for (let i = 0; i < 8; i++) {
        const idx = Math.floor(Math.random() * ALPHANUM.length);
        result += ALPHANUM[idx];
    }
    return result;
}

export class Generator {
    private state: number;
    constructor(seedString: string, state: number | null = null) {
        this.state = state === null ? makeSeedFromString(seedString) : state;
    }
    static fromState(state: number): Generator {
        return new Generator('A', state);
    }
    exportState(): number {
        return this.state;
    }
    private next(): number {
        this.state |= 0;
        this.state = this.state + 0x6D2B79F5 | 0;
        let t = Math.imul(this.state ^ this.state >>> 15, 1 | this.state);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
    newGenerator(): Generator {
        let result = "";
        for (let i = 0; i < 8; i++) {
            const idx = Math.floor(this.next() * ALPHANUM.length);
            result += ALPHANUM[idx];
        }
        return new Generator(result);
    }
    permute<T>(list: readonly T[]): T[] {
        const result = list.slice(); // copy
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(this.next() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }    
        return result  
    }
    samples<T>(list: readonly T[], k: number, excludes:T[] = []): T[] {
        if (k == 0) return []
        const arr:T[] = this.permute(list)
        const result:T[] = []
        for (let i = 0; i < list.length; i++) {
          const candidate:T = arr[i]
          if (excludes.every(t => (t !== candidate))) {
            result.push(candidate)
          }
          if (result.length >= k) {
            return result
          }
        }
        console.log('Ran out of items!')
        return result
    }
    sample<T>(list: readonly T[], excludes:T[] = []): T {
      return this.samples(list, 1, excludes)[0]
    }
}

/** Hash string into a 32-bit seed */
function makeSeedFromString(s: string): number {
  const str = normalizeSeedString(s);
  let hash = 2166136261;

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}


/** Normalize the input string (capitalization only) */
function normalizeSeedString(s: string): string {
  return s.toUpperCase();
}
