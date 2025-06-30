import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import ACTIONS from './actions.js'; // Ensure this is a JS module

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend
const io = new Server(server, {
  cors: {
    origin: 'https://fd-code-sync.vercel.app', // or your frontend domain in production
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const userSocketMap = {};
const codeMap = {}; // Stores current code for each room

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(socketId => {
    return {
      socketId,
      userName: userSocketMap[socketId],
    };
  });
}

io.on('connection', socket => {
  console.log('🔌 Socket connected:', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomId);

    // Initialize room with empty or default code if it doesn't exist
    if (!codeMap[roomId]) {
      codeMap[roomId] = '// Start coding...';
    }

    const clients = getAllConnectedClients(roomId);

    // Notify all clients (including the new one)
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        userName,
        socketId: socket.id,
      });
    });

    // Send current code to the newly joined client only
    io.to(socket.id).emit(ACTIONS.CODE_CHANGE, {
      code: codeMap[roomId],
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    codeMap[roomId] = code; // Save the latest code
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach(roomId => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
