let io;

export const init = (httpServer) => {
    io = require('socket.io')(httpServer);
    return io;
}
export const getIO = () => {
    if (!io) {
        console.log("undefined io!");
        throw new Error('Socket.io is not initialized!');
    }
    return io;
}
