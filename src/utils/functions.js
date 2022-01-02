export const generateRandomFloatInRange = (min, max) =>
    Math.random() * (max - min + 1) + min;