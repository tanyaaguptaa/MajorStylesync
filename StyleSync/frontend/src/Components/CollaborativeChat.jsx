// // import React, { useEffect, useState } from "react";
// // import { io } from "socket.io-client";

// // const socket = io("https://liveshare-1.onrender.com"); // 👈 Change this to your deployed or local server

// // const CollaborativeEditor = ({ room }) => {
// //   const [text, setText] = useState("");

// //   useEffect(() => {
// //     if (!room) return;

// //     // Join the room
// //     socket.emit("joinRoom", room);

// //     // Receive updates
// //     socket.on("update", (newText) => {
// //       setText(newText);
// //     });

// //     // Clean up on unmount
// //     return () => {
// //       socket.off("update");
// //     };
// //   }, [room]);

// //   const handleChange = (e) => {
// //     const newText = e.target.value;
// //     setText(newText);
// //     socket.emit("textChange", newText);
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <h2>Room: {room}</h2>
// //       <textarea
// //         style={styles.textarea}
// //         value={text}
// //         onChange={handleChange}
// //         placeholder="Start typing to collaborate..."
// //       />
// //     </div>
// //   );
// // };

// // const styles = {
// //   container: {
// //     padding: "1rem",
// //     backgroundColor: "#f0f0f0",
// //     borderRadius: "10px",
// //     width: "100%",
// //     maxWidth: "600px",
// //     margin: "auto",
// //   },
// //   textarea: {
// //     width: "100%",
// //     height: "300px",
// //     padding: "0.75rem",
// //     fontSize: "16px",
// //     fontFamily: "monospace",
// //     borderRadius: "8px",
// //     border: "1px solid #ccc",
// //     resize: "vertical",
// //   },
// // };

// // export default CollaborativeEditor;

// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";

// const socket = io("https://liveshare-1.onrender.com"); // update to your server

// const CollaborativeEditor = ({ room }) => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     socket.emit("join", room);

//     socket.on("receive", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [room]);

//   const sendMessage = () => {
//     if (message.trim()) {
//       socket.emit("send", { room, message });
//       setMessages((prev) => [...prev, { message, self: true }]);
//       setMessage("");
//     }
//   };

//   return (
//     <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//       <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             style={{
//               textAlign: msg.self ? "right" : "left",
//               margin: "5px 0",
//             }}
//           >
//             {msg.message}
//           </div>
//         ))}
//       </div>
//       <div style={{ display: "flex" }}>
//         <input
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message"
//           style={{ flex: 1 }}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default CollaborativeEditor;
// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import "./CollaborativeChat.css";
// import io from "socket.io-client";
// const CollaborativeChat = ({ room }) => {
//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [connected, setConnected] = useState(false);
//   const [username, setUsername] = useState("");
//   const [usernameSet, setUsernameSet] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   // Connect to socket server when component mounts
//   // In CollaborativeChat.jsx, modify the socket connection:
//   useEffect(() => {
//     // Point to your main backend server instead of a separate socket server
//     const socketURL =
//       process.env.NODE_ENV === "development"
//         ? "http://localhost:5000" // Your main server port, not 4000
//         : "https://your-deployed-backend-url.com";

//     const newSocket = io(socketURL);
//     setSocket(newSocket);

//     // Clean up on unmount
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   // Join room when socket is ready and username is set
//   useEffect(() => {
//     if (socket && usernameSet && room) {
//       socket.emit("joinRoom", room);

//       socket.on("connect", () => {
//         setConnected(true);
//         // Add system message that user has joined
//         setMessages((prev) => [
//           ...prev,
//           {
//             type: "system",
//             content: `Connected to chat room ${room}`,
//             timestamp: new Date().toLocaleTimeString(),
//           },
//         ]);
//       });

//       socket.on("userJoined", (user) => {
//         setMessages((prev) => [
//           ...prev,
//           {
//             type: "system",
//             content: `${user} joined the room`,
//             timestamp: new Date().toLocaleTimeString(),
//           },
//         ]);
//       });

//       socket.on("userLeft", (user) => {
//         setMessages((prev) => [
//           ...prev,
//           {
//             type: "system",
//             content: `${user} left the room`,
//             timestamp: new Date().toLocaleTimeString(),
//           },
//         ]);
//       });

//       socket.on("chatMessage", (message) => {
//         setMessages((prev) => [...prev, message]);
//       });

//       socket.on("imageMessage", (message) => {
//         setMessages((prev) => [...prev, message]);
//       });

//       socket.on("disconnect", () => {
//         setConnected(false);
//         setMessages((prev) => [
//           ...prev,
//           {
//             type: "system",
//             content: "Disconnected from server",
//             timestamp: new Date().toLocaleTimeString(),
//           },
//         ]);
//       });
//     }

//     return () => {
//       if (socket) {
//         socket.off("connect");
//         socket.off("userJoined");
//         socket.off("userLeft");
//         socket.off("chatMessage");
//         socket.off("imageMessage");
//         socket.off("disconnect");
//       }
//     };
//   }, [socket, room, usernameSet]);

//   // Scroll to bottom when messages update
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (inputMessage.trim() && socket && connected) {
//       const messageData = {
//         type: "text",
//         sender: username,
//         content: inputMessage,
//         timestamp: new Date().toLocaleTimeString(),
//       };

//       socket.emit("chatMessage", messageData, room);
//       setMessages((prev) => [...prev, messageData]);
//       setInputMessage("");
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file is an image and not too large (max 5MB)
//     if (!file.type.startsWith("image/")) {
//       alert("Please select an image file");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       alert("Image must be smaller than 5MB");
//       return;
//     }

//     setIsUploading(true);

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const imageData = event.target.result;
//       setImagePreview(imageData);
//     };
//     reader.readAsDataURL(file);
//   };

//   const sendImage = () => {
//     if (imagePreview && socket && connected) {
//       const messageData = {
//         type: "image",
//         sender: username,
//         content: imagePreview,
//         timestamp: new Date().toLocaleTimeString(),
//       };

//       socket.emit("imageMessage", messageData, room);
//       setMessages((prev) => [...prev, messageData]);
//       setImagePreview(null);
//       setIsUploading(false);

//       // Reset file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     }
//   };

//   const cancelImageUpload = () => {
//     setImagePreview(null);
//     setIsUploading(false);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleUsernameSubmit = (e) => {
//     e.preventDefault();
//     if (username.trim()) {
//       setUsernameSet(true);
//       if (socket) {
//         socket.emit("setUsername", username, room);
//       }
//     }
//   };

//   if (!usernameSet) {
//     return (
//       <div className="username-container">
//         <h2>Enter your username to join chat room {room}</h2>
//         <form onSubmit={handleUsernameSubmit} className="username-form">
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Your name"
//             required
//             className="username-input"
//           />
//           <button type="submit" className="username-btn">
//             Join Chat
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <h2>Chat Room: {room}</h2>
//         <span
//           className={`status-indicator ${
//             connected ? "connected" : "disconnected"
//           }`}
//         >
//           {connected ? "Connected" : "Disconnected"}
//         </span>
//       </div>

//       <div className="messages-container">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`message ${
//               msg.type === "system"
//                 ? "system-message"
//                 : msg.sender === username
//                 ? "own-message"
//                 : "other-message"
//             }`}
//           >
//             {msg.type !== "system" && (
//               <div className="message-sender">{msg.sender}</div>
//             )}

//             <div className="message-content">
//               {msg.type === "image" ? (
//                 <img
//                   src={msg.content}
//                   alt="Shared image"
//                   className="shared-image"
//                 />
//               ) : (
//                 msg.content
//               )}
//             </div>

//             <div className="message-timestamp">{msg.timestamp}</div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {isUploading && imagePreview && (
//         <div className="image-preview-container">
//           <img src={imagePreview} alt="Preview" className="image-preview" />
//           <div className="image-preview-actions">
//             <button onClick={sendImage} className="send-image-btn">
//               Send Image
//             </button>
//             <button onClick={cancelImageUpload} className="cancel-image-btn">
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSendMessage} className="chat-input-container">
//         <input
//           type="text"
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//           placeholder="Type a message..."
//           disabled={!connected}
//           className="chat-input"
//         />

//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleImageUpload}
//           accept="image/*"
//           style={{ display: "none" }}
//           id="image-upload"
//         />

//         <label htmlFor="image-upload" className="image-upload-btn">
//           📷
//         </label>

//         <button
//           type="submit"
//           disabled={!connected || !inputMessage.trim()}
//           className="send-btn"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CollaborativeChat;

// best one
// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";
// import "./CollaborativeChat.css";

// let socket;

// const CollaborativeChat = ({ room }) => {
//   const [username, setUsername] = useState("Guest" + Math.floor(Math.random() * 1000));
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [connected, setConnected] = useState(false);
//   const [image, setImage] = useState(null);

//   useEffect(() => {
//     socket = io("http://localhost:5000"); // 👈 Use your backend URL
//     socket.emit("joinRoom", room);

//     socket.on("connect", () => setConnected(true));
//     socket.on("disconnect", () => setConnected(false));

//     socket.on("message", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [room]);

//   const sendMessage = () => {
//     if (message.trim()) {
//       socket.emit("message", { room, text: message, username });
//       setMessage("");
//     }
//   };

//   const sendImage = () => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       socket.emit("image", { room, image: reader.result, username });
//       setImage(null);
//     };
//     reader.readAsDataURL(image);
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <span>Room: {room}</span>
//         <span className={`status-indicator ${connected ? "connected" : "disconnected"}`}>
//           {connected ? "Connected" : "Disconnected"}
//         </span>
//       </div>

//       <div className="messages-container">
//         {messages.map((msg, index) => (
//           <div key={index} className={`message ${msg.username === username ? "own-message" : "other-message"}`}>
//             <div className="message-sender">{msg.username}</div>
//             {msg.image ? (
//               <img src={msg.image} alt="shared" className="shared-image" />
//             ) : (
//               <div>{msg.text}</div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="chat-input-container">
//         <input
//           className="chat-input"
//           placeholder="Type a message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button className="send-btn" onClick={sendMessage}>Send</button>
//         <label className="image-upload-btn">
//           +
//           <input
//             type="file"
//             accept="image/*"
//             style={{ display: "none" }}
//             onChange={(e) => setImage(e.target.files[0])}
//           />
//         </label>
//       </div>

//       {image && (
//         <div className="image-preview-container">
//           <img src={URL.createObjectURL(image)} className="image-preview" />
//           <div className="image-preview-actions">
//             <button className="send-image-btn" onClick={sendImage}>Send Image</button>
//             <button className="cancel-image-btn" onClick={() => setImage(null)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CollaborativeChat;
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./CollaborativeChat.css";

let socket;

const CollaborativeChat = ({ room, username }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    socket = io("http://localhost:5000"); // 👈 Use your backend URL
    socket.emit("joinRoom", room);

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", { room, text: message, username });
      setMessage("");
    }
  };

  const sendImage = () => {
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit("image", { room, image: reader.result, username });
      setImage(null);
    };
    reader.readAsDataURL(image);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>Room: {room}</span>
        <span
          className={`status-indicator ${
            connected ? "connected" : "disconnected"
          }`}
        >
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.username === username ? "own-message" : "other-message"
            }`}
          >
            <div className="message-sender">{msg.username}</div>
            {msg.image ? (
              <img src={msg.image} alt="shared" className="shared-image" />
            ) : (
              <div>{msg.text}</div>
            )}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="send-btn" onClick={sendMessage}>
          Send
        </button>
        <label className="image-upload-btn">
          +
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
      </div>

      {image && (
        <div className="image-preview-container">
          <img src={URL.createObjectURL(image)} className="image-preview" />
          <div className="image-preview-actions">
            <button className="send-image-btn" onClick={sendImage}>
              Send Image
            </button>
            <button className="cancel-image-btn" onClick={() => setImage(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborativeChat;
