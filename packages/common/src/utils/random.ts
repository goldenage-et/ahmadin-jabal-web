/**
 * Deterministically generates a pseudo-random number between start and end (inclusive)
 * based on a given integer seed. Same inputs will always yield the same output.
 * @param seed - deterministic seed value (number or string)
 * @param start - minimum returned value (inclusive)
 * @param end - maximum returned value (inclusive)
 */
export function seededRandom(seed: number | string, start: number, end: number): number {
    // Ensure numeric seed
    let s: number;
    if (typeof seed === 'string') {
        // Simple hash to convert string seed into number
        s = Array.from(seed)
            .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    } else {
        s = seed;
    }
    // Mulberry32 PRNG (fast, deterministic)
    function mulberry32(a: number) {
        return function () {
            var t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }
    const rng = mulberry32(s);
    const rnd = rng();
    // Clamp, ensure integer range
    return Math.floor(rnd * (end - start + 1)) + start;
}
