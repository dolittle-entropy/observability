export const generateRandomID = (): string =>
    ('00000000'+Math.floor(Math.random()*4294967295).toString(16)).slice(-8);
