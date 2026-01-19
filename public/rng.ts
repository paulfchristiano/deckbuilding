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
    public prng: () => number;
    constructor(seedString: string) {
        this.prng = PRNGFromString(seedString);
    }
    newGenerator(): Generator {
        let result = "";
        for (let i = 0; i < 8; i++) {
            const idx = Math.floor(this.prng() * ALPHANUM.length);
            result += ALPHANUM[idx];
        }
        return new Generator(result);
    }
    samples<T>(list: readonly T[], k: number): T[] {
        if (k > list.length) {
            throw new Error("k cannot be larger than list length");
        }

        const arr = list.slice(); // copy
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(this.prng() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr.slice(0, k); 
    }
    sample<T>(list: readonly T[]): T {
        const idx = Math.floor(this.prng() * list.length);
        return list[idx];
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


/** Deterministic PRNG */
function PRNGFromString(seedString: string): () => number {
  let seed = makeSeedFromString(seedString);
  return function () {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/** Normalize the input string (capitalization only) */
function normalizeSeedString(s: string): string {
  return s.toUpperCase();
}