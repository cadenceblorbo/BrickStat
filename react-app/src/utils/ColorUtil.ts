import { Color } from 'three';

import { Clamp } from './MathUtil';

export function colorLerp3(
    color1: Color,
    color2: Color,
    color3: Color,
    t: number,
    midpoint: number = 0.5,
): Color {
    t = Clamp(t, 0, 1);
    midpoint = Clamp(midpoint, Number.MIN_VALUE, 1 - Number.MIN_VALUE);
    if (t >= midpoint) {
        color1 = color2;
        color2 = color3;
        t = (t - midpoint) * (1 / (1 - midpoint));
        if (isNaN(t)) {
            t = 0;
        }
    } else {
        t *= (1 / midpoint);
    }
    return new Color().lerpColors(color1, color2, t);
}