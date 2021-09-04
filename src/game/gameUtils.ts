export function random(from: number = 0, to: number = 1): number {
    return Math.random() * (to - from) + from;
}

/**
 * @param p p-value in [0, 1]
 */
export function chance(p: number): boolean {
    return Math.random() < p;
}

// Identity function to get syntax highlighting in shaders
export function glsl(x: any): string {
    return x[0];
}
