Player.textures = wgs_64;

let wallTextures = randomTextures(10, 2);
wallTextures[0] = space_64;
wallTextures[1] = wall_64;
wallTextures[2] = doorFront_64;
wallTextures[3] = iron_64;

doorVal = 2;

let myMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1,],
    [1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
];