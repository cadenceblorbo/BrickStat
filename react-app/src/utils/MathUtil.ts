export function Clamp(
    num: number,
    min: number,
    max: number
) {
    if (min > max) {
        throw new RangeError("Clamp FUnction Error: " + min + " is greater than " + max + " !");
    }
    return Math.min(max, Math.max(num, min));
}

export function Lerp(from: number, to: number, t: number) {
    t = Clamp(t, 0, 1);
    return to * t + from * (1 - t);
}

export function Smoothstep(from: number, to: number, t: number) {
    let t_real = Clamp(t, 0, 1);
    t_real = t_real * t_real * (3.0 - 2.0 * t_real);
    return to * t_real + from * (1 - t_real);
}