import { io } from "socket.io-client";

const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };

    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    return io(backendURL, options);
};

export default initSocket;
