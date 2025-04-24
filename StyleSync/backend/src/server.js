const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  socket.on("message", ({ room, text, username }) => {
    io.to(room).emit("message", { text, username });
  });

  socket.on("image", ({ room, image, username }) => {
    io.to(room).emit("message", { image, username });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Socket server running on http://localhost:5000");
});


// const express = require('express'); 
// const dotenv = require('dotenv'); 
// const compression = require('compression'); 
// const connectDB = require('./config/db'); 
// const cors = require('cors'); 
// const bodyParser = require('body-parser');
// const http = require('http');
// const { Server } = require('socket.io');

// const authRoutes = require('./routes/authRoutes'); 
// const productRoutes = require('./routes/productRoutes'); 
// const orderRoutes = require('./routes/orderRoutes'); 
// const reviewRoutes = require('./routes/reviewRoutes'); 
// const paymentRoutes = require('./routes/paymentRoutes'); 
// const cartRoutes = require('./routes/cartRoutes'); 
// const categoryRoutes = require('./routes/categoryRoutes')
// const addressRoutes = require('./routes/addressRoutes');  

// dotenv.config();  
// connectDB();  

// const app = express(); 
// // Create HTTP server using Express app
// const server = http.createServer(app);

// // Set up Socket.io
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     methods: ["GET", "POST"]
//   },
//   maxHttpBufferSize: 5e6 // 5MB max buffer size for images
// });

// // Socket.io logic
// let rooms = {};

// io.on('connection', (socket) => {
//   console.log('New client connected');
//   let currentRoom = null;
//   let username = null;

//   // Join a room
//   socket.on('joinRoom', (room) => {
//     currentRoom = room;
//     socket.join(room);
//     console.log(`Client joined room ${room}`);

//     // Initialize room if not exists
//     if (!rooms[room]) {
//       rooms[room] = {
//         texts: '', // For collaborative editor
//         messages: [], // For chat messages
//         users: {} // For tracking users in the room
//       };
//     }

//     // Send current room data to new client
//     socket.emit('update', rooms[room].texts || '');
    
//     // Send message history to new client
//     if (rooms[room].messages && rooms[room].messages.length > 0) {
//       socket.emit('messageHistory', rooms[room].messages);
//     }
//   });

//   // Set username for chat
//   socket.on('setUsername', (name, room) => {
//     username = name;
//     if (room && rooms[room]) {
//       rooms[room].users[socket.id] = name;
      
//       // Notify others that user joined
//       socket.to(room).emit('userJoined', name);
//     }
//   });

//   // Handle text changes (for collaborative editor)
//   socket.on('textChange', (newText) => {
//     if (currentRoom && rooms[currentRoom]) {
//       rooms[currentRoom].texts = newText;
//       io.to(currentRoom).emit('update', rooms[currentRoom].texts);
//     }
//   });

//   // Handle chat messages
//   socket.on('chatMessage', (message, room) => {
//     if (room && rooms[room]) {
//       // Store message
//       rooms[room].messages.push(message);
      
//       // Limit message history (optional)
//       if (rooms[room].messages.length > 100) {
//         rooms[room].messages = rooms[room].messages.slice(-100);
//       }
      
//       // Broadcast to everyone else in the room
//       socket.to(room).emit('chatMessage', message);
//     }
//   });

//   // Handle image messages
//   socket.on('imageMessage', (message, room) => {
//     if (room && rooms[room]) {
//       // Store image message
//       rooms[room].messages.push(message);
      
//       // Limit message history (optional)
//       if (rooms[room].messages.length > 100) {
//         rooms[room].messages = rooms[room].messages.slice(-100);
//       }
      
//       // Broadcast to everyone else in the room
//       socket.to(room).emit('imageMessage', message);
//     }
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
    
//     // Notify room users if user was in a room
//     if (currentRoom && rooms[currentRoom] && username) {
//       delete rooms[currentRoom].users[socket.id];
//       io.to(currentRoom).emit('userLeft', username);
//     }
//   });
// });

// app.use(bodyParser.json({ limit: '10mb' })); 
// app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); 
// app.use(compression()); 
// app.use(express.json()); 
// app.use(cors()); 
// app.use('/api/users', authRoutes); 
// app.use('/api/products', productRoutes); 
// app.use('/api/orders', orderRoutes); 
// app.use('/api/products/:id/reviews', reviewRoutes); 
// app.use('/api/payment', paymentRoutes); 
// app.use('/api/cart', cartRoutes); 
// app.use('/api/category', categoryRoutes) 
// app.use('/api/address', addressRoutes);  

// const PORT = process.env.PORT || 5000;  

// // Use server.listen instead of app.listen
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
//   console.log(`Socket.io server running on the same port`);
// });





// const express = require('express');
// const dotenv = require('dotenv');
// const compression = require('compression');
// const connectDB = require('./config/db');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const reviewRoutes = require('./routes/reviewRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const cartRoutes = require('./routes/cartRoutes');
// const categoryRoutes = require('./routes/categoryRoutes')
// const addressRoutes = require('./routes/addressRoutes');

// dotenv.config();

// connectDB();

// const app = express();
// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// app.use(compression());
// app.use(express.json());
// app.use(cors());
// app.use('/api/users', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/products/:id/reviews', reviewRoutes);
// app.use('/api/payment', paymentRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/category', categoryRoutes)
// app.use('/api/address', addressRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, console.log(`Server running on http://localhost:${PORT}`));
