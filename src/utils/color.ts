export const rgb2Hsl = (color: [number, number, number]) => {
    const {0: r, 1: g, 2: b} = color;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const l = (max + min) / 2 / 255;
    const d = max - min;
    let s = 0;
    let h = 0;

    if (max === min) {
      h = 0;
      s = 0;
    } else {
      s = l > 0.5 ? d / (2 * 255 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d * 60;
          break;
        case g:
          h = (b - r) / d * 60 + 120;
          break;
        case b:
          h = (r - g) / d * 60 + 240;
          break;
      }
    }

    if (h < 0) {
      h += 360;
    }

    return {
        h,
        s,
        l
    };
}
