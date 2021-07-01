var socket;
if (typeof io !== 'undefined') {
    socket = io();
} else {
    setTimeout(() => {
        setup();
        startDraw();
    });
}
var setupDone = false;
var myId;

socket?.on('start', data => {
    if (setupDone) return;

    myId = data.myId;
    myMap = data.worldMap;
    console.log('myId:', myId);

    setup();
    startDraw();
    setupDone = true;
});

socket?.on('update player', data => {
    let { id, player } = data;
    if (!Player.all.hasOwnProperty(id)) new Player(id);
    Object.assign(Player.all[id], player);
})

socket?.on('delete player', id => {
    console.log('left:', id);
    let player = Player.all[id];
    player?.delete();
});

socket?.on('toggle door', data => {
    let { x, y } = data;
    toggleDoor(x, y);
});

function emitMyPlayer() {
    let player = Object.assign({}, pl0);
    delete player.texture;
    delete player.textures;
    delete player.id;
    socket?.emit('update player', { id: myId, player })
}

function emitToggleDoor(x, y) {
    socket?.emit('toggle door', { x, y });
}