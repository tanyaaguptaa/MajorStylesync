import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faUserCircle,
  faPalette,
  faComments,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import Profile from "./Profile";
import axios from "axios";
import CollaborativeChat from "./CollaborativeChat";
const config = require("../Config/Constant");

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState(""); // 👈 NEW
  const [isInChatRoom, setIsInChatRoom] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${config.BASE_URL}products/search`, {
        params: { query: searchQuery },
      });
      navigate("/search-results", { state: { products: response.data } });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleChatClick = () => {
    setIsChatModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsChatModalOpen(false);
    setRoomCode("");
    setUsername(""); // 👈 Reset username too
    setIsInChatRoom(false);
  };

  const handleRoomCodeSubmit = (e) => {
    e.preventDefault();
    if (
      roomCode &&
      roomCode.length === 3 &&
      /^\d{3}$/.test(roomCode) &&
      username.trim() !== ""
    ) {
      setIsInChatRoom(true);
    } else {
      alert("Please enter a valid 3-digit room code and your name.");
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo" onClick={handleLogoClick}>
          <img
            src="/images/logo1.png"
            alt="TrendTreasure Logo"
            className="logo-image"
          />
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="button" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="header-icons">
          <div className="header-icon" onClick={handleLoginClick}>
            <FontAwesomeIcon icon={faUser} /> Login
          </div>
          <div className="header-icon" onClick={handleCartClick}>
            <FontAwesomeIcon icon={faShoppingCart} /> Cart
          </div>
          <div className="header-icon" onClick={() => navigate("/skintone")}>
            <FontAwesomeIcon icon={faPalette} /> SkinTone
          </div>
          <div className="header-icon" onClick={handleChatClick}>
            <FontAwesomeIcon icon={faComments} /> Chat
          </div>
          <div className="header-icon profile-dropdown">
            <FontAwesomeIcon icon={faUserCircle} /> Profile
            <div className="profile-dropdown-content">
              <Profile />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {isChatModalOpen && (
        <div className="chat-modal-overlay">
          <div className="chat-modal">
            <div className="chat-modal-header">
              <h2>
                {isInChatRoom ? `Chat Room: ${roomCode}` : "Join Chat Room"}
              </h2>
              <button className="close-button" onClick={handleCloseModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="chat-modal-content">
              {!isInChatRoom ? (
                <form
                  onSubmit={handleRoomCodeSubmit}
                  className="room-code-form"
                >
                  <p>
                    Enter a 3-digit room code to join or create a chat room:
                  </p>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="Room Code (e.g. 123)"
                    maxLength="3"
                    pattern="\d{3}"
                    required
                    className="room-code-input"
                  />
                  <p>Enter your name:</p>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your Name"
                    required
                    className="room-code-input"
                  />
                  <button type="submit" className="join-button">
                    Join Room
                  </button>
                </form>
              ) : (
                <CollaborativeChat room={roomCode} username={username} /> // 👈 pass username
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faShoppingCart,
//   faUserCircle,
//   faPalette,
//   faComments,
//   faTimes,
// } from "@fortawesome/free-solid-svg-icons";
// import "./Header.css";
// import Profile from "./Profile";
// import axios from "axios";
// import CollaborativeChat from "./CollaborativeChat";
// const config = require("../Config/Constant");

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isChatModalOpen, setIsChatModalOpen] = useState(false);
//   const [roomCode, setRoomCode] = useState("");
//   const [isInChatRoom, setIsInChatRoom] = useState(false);
//   const navigate = useNavigate();

//   const handleLoginClick = () => {
//     navigate("/login");
//   };

//   const handleCartClick = () => {
//     navigate("/cart");
//   };

//   const handleLogoClick = () => {
//     navigate("/");
//   };

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(`${config.BASE_URL}products/search`, {
//         params: { query: searchQuery },
//       });
//       navigate("/search-results", { state: { products: response.data } });
//     } catch (error) {
//       console.error("Error fetching search results:", error);
//     }
//   };

//   const handleChatClick = () => {
//     setIsChatModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsChatModalOpen(false);
//     setRoomCode("");
//     setIsInChatRoom(false);
//   };

//   const handleRoomCodeSubmit = (e) => {
//     e.preventDefault();
//     if (roomCode && roomCode.length === 3 && /^\d{3}$/.test(roomCode)) {
//       setIsInChatRoom(true);
//     } else {
//       alert("Please enter a valid 3-digit numeric code.");
//     }
//   };

//   return (
//     <header className="header">
//       <div className="header-top">
//         <div className="logo" onClick={handleLogoClick}>
//           <img
//             src="/images/logo1.png"
//             alt="TrendTreasure Logo"
//             className="logo-image"
//           />
//         </div>
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search for products, brands and more"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <button type="button" onClick={handleSearch}>
//             Search
//           </button>
//         </div>
//         <div className="header-icons">
//           <div className="header-icon" onClick={handleLoginClick}>
//             <FontAwesomeIcon icon={faUser} /> Login
//           </div>
//           <div className="header-icon" onClick={handleCartClick}>
//             <FontAwesomeIcon icon={faShoppingCart} /> Cart
//           </div>
//           <div className="header-icon" onClick={() => navigate("/skintone")}>
//             <FontAwesomeIcon icon={faPalette} /> SkinTone
//           </div>
//           <div className="header-icon" onClick={handleChatClick}>
//             <FontAwesomeIcon icon={faComments} /> Chat
//           </div>
//           <div className="header-icon profile-dropdown">
//             <FontAwesomeIcon icon={faUserCircle} /> Profile
//             <div className="profile-dropdown-content">
//               <Profile />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chat Modal */}
//       {isChatModalOpen && (
//         <div className="chat-modal-overlay">
//           <div className="chat-modal">
//             <div className="chat-modal-header">
//               <h2>
//                 {isInChatRoom ? `Chat Room: ${roomCode}` : "Join Chat Room"}
//               </h2>
//               <button className="close-button" onClick={handleCloseModal}>
//                 <FontAwesomeIcon icon={faTimes} />
//               </button>
//             </div>

//             <div className="chat-modal-content">
//               {!isInChatRoom ? (
//                 <form
//                   onSubmit={handleRoomCodeSubmit}
//                   className="room-code-form"
//                 >
//                   <p>
//                     Enter a 3-digit room code to join or create a chat room:
//                   </p>
//                   <div className="room-code-input-group">
//                     <input
//                       type="text"
//                       value={roomCode}
//                       onChange={(e) => setRoomCode(e.target.value)}
//                       placeholder="123"
//                       maxLength="3"
//                       pattern="\d{3}"
//                       required
//                       className="room-code-input"
//                     />
//                     <button type="submit" className="join-button">
//                       Join Room
//                     </button>
//                   </div>
//                 </form>
//               ) : (
//                 <CollaborativeChat room={roomCode} />
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faShoppingCart,
//   faUserCircle,
//   faPalette,
//   faComments,
// } from "@fortawesome/free-solid-svg-icons";
// import "./Header.css";
// import Profile from "./Profile";
// import axios from "axios";
// const config = require("../Config/Constant");

// const Header = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   const handleLoginClick = () => {
//     navigate("/login");
//   };

//   const handleCartClick = () => {
//     navigate("/cart");
//   };

//   const handleLogoClick = () => {
//     navigate("/");
//   };

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(`${config.BASE_URL}products/search`, {
//         params: { query: searchQuery },
//       });
//       navigate("/search-results", { state: { products: response.data } });
//     } catch (error) {
//       console.error("Error fetching search results:", error);
//     }
//   };

//   const handleChatClick = () => {
//     const code = prompt("Enter 3-digit chat code:");
//     if (code && code.length === 3 && /^\d{3}$/.test(code)) {
//       window.location.href = `https://liveshare-1.onrender.com/${code}`;
//     } else {
//       alert("Please enter a valid 3-digit numeric code.");
//     }
//   };

//   return (
//     <header className="header">
//       <div className="header-top">
//         <div className="logo" onClick={handleLogoClick}>
//           <img
//             src="/images/logo1.png"
//             alt="TrendTreasure Logo"
//             className="logo-image"
//           />
//         </div>
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search for products, brands and more"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <button type="button" onClick={handleSearch}>
//             Search
//           </button>
//         </div>
//         <div className="header-icons">
//           <div className="header-icon" onClick={handleLoginClick}>
//             <FontAwesomeIcon icon={faUser} /> Login
//           </div>
//           <div className="header-icon" onClick={handleCartClick}>
//             <FontAwesomeIcon icon={faShoppingCart} /> Cart
//           </div>
//           <div className="header-icon" onClick={() => navigate("/skintone")}>
//             <FontAwesomeIcon icon={faPalette} /> SkinTone
//           </div>
//           <div className="header-icon" onClick={handleChatClick}>
//             <FontAwesomeIcon icon={faComments} /> Chat
//           </div>
//           <div className="header-icon profile-dropdown">
//             <FontAwesomeIcon icon={faUserCircle} /> Profile
//             <div className="profile-dropdown-content">
//               <Profile />
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import {
// //   faUser,
// //   faShoppingCart,
// //   faUserCircle,
// //   faPalette,
// //   faComments,
// // } from "@fortawesome/free-solid-svg-icons";
// // import "./Header.css";
// // import Profile from "./Profile";
// // import axios from "axios";
// // import Modal from "react-modal";
// // import CollaborativeEditor from "./CollaborativeEditor"; // path adjust karo agar alag folder me ho

// // const config = require("../Config/Constant");

// // const Header = () => {
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [roomCode, setRoomCode] = useState("");
// //   const navigate = useNavigate();

// //   const handleLoginClick = () => {
// //     navigate("/login");
// //   };

// //   const handleCartClick = () => {
// //     navigate("/cart");
// //   };

// //   const handleLogoClick = () => {
// //     navigate("/");
// //   };

// //   const handleSearch = async () => {
// //     try {
// //       const response = await axios.get(`${config.BASE_URL}products/search`, {
// //         params: { query: searchQuery },
// //       });
// //       navigate("/search-results", { state: { products: response.data } });
// //     } catch (error) {
// //       console.error("Error fetching search results:", error);
// //     }
// //   };

// //   const handleChatClick = () => {
// //     setIsModalOpen(true);
// //   };

// //   const startChat = () => {
// //     if (roomCode && roomCode.length === 3 && /^\d{3}$/.test(roomCode)) {
// //       // valid code, keep modal open and load editor
// //     } else {
// //       alert("Please enter a valid 3-digit numeric code.");
// //     }
// //   };

// //   return (
// //     <header className="header">
// //       <div className="header-top">
// //         <div className="logo" onClick={handleLogoClick}>
// //           <img
// //             src="/images/logo1.png"
// //             alt="TrendTreasure Logo"
// //             className="logo-image"
// //           />
// //         </div>
// //         <div className="search-bar">
// //           <input
// //             type="text"
// //             placeholder="Search for products, brands and more"
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //           />
// //           <button type="button" onClick={handleSearch}>
// //             Search
// //           </button>
// //         </div>
// //         <div className="header-icons">
// //           <div className="header-icon" onClick={handleLoginClick}>
// //             <FontAwesomeIcon icon={faUser} /> Login
// //           </div>
// //           <div className="header-icon" onClick={handleCartClick}>
// //             <FontAwesomeIcon icon={faShoppingCart} /> Cart
// //           </div>
// //           <div className="header-icon" onClick={() => navigate("/skintone")}>
// //             <FontAwesomeIcon icon={faPalette} /> SkinTone
// //           </div>
// //           <div className="header-icon" onClick={handleChatClick}>
// //             <FontAwesomeIcon icon={faComments} /> Chat
// //           </div>
// //           <div className="header-icon profile-dropdown">
// //             <FontAwesomeIcon icon={faUserCircle} /> Profile
// //             <div className="profile-dropdown-content">
// //               <Profile />
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Modal for Collaborative Chat */}
// //       <Modal
// //         isOpen={isModalOpen}
// //         onRequestClose={() => {
// //           setIsModalOpen(false);
// //           setRoomCode("");
// //         }}
// //         contentLabel="Chat Modal"
// //         style={{
// //           content: {
// //             top: "50%",
// //             left: "50%",
// //             right: "auto",
// //             bottom: "auto",
// //             marginRight: "-50%",
// //             transform: "translate(-50%, -50%)",
// //             width: "90%",
// //             height: "80%",
// //             padding: "20px",
// //           },
// //         }}
// //       >
// //         <div
// //           style={{
// //             display: "flex",
// //             flexDirection: "column",
// //             gap: "10px",
// //             height: "100%",
// //           }}
// //         >
// //           {!roomCode ? (
// //             <>
// //               <input
// //                 type="text"
// //                 placeholder="Enter 3-digit room code"
// //                 value={roomCode}
// //                 onChange={(e) => setRoomCode(e.target.value)}
// //               />
// //               <button onClick={startChat}>Start Chat</button>
// //               <button onClick={() => setIsModalOpen(false)}>Cancel</button>
// //             </>
// //           ) : (
// //             <>
// //               <CollaborativeEditor room={roomCode} />
// //               <button
// //                 onClick={() => {
// //                   setRoomCode("");
// //                   setIsModalOpen(false);
// //                 }}
// //               >
// //                 Close
// //               </button>
// //             </>
// //           )}
// //         </div>
// //       </Modal>
// //     </header>
// //   );
// // };

// // export default Header;

// // // import React, { useState } from "react";
// // // import { Link, useNavigate } from "react-router-dom";
// // // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // // import {
// // //   faUser,
// // //   faShoppingCart,
// // //   faUserCircle,
// // //   faPalette,
// // //   faComments,
// // // } from "@fortawesome/free-solid-svg-icons";
// // // import "./Header.css";
// // // import Profile from "./Profile";
// // // import axios from "axios";
// // // const config = require("../Config/Constant");

// // // const Header = () => {
// // //   const [searchQuery, setSearchQuery] = useState("");
// // //   const navigate = useNavigate();

// // //   const handleLoginClick = () => {
// // //     navigate("/login");
// // //   };

// // //   const handleCartClick = () => {
// // //     navigate("/cart");
// // //   };

// // //   const handleLogoClick = () => {
// // //     navigate("/");
// // //   };

// // //   const handleSearch = async () => {
// // //     try {
// // //       const response = await axios.get(`${config.BASE_URL}products/search`, {
// // //         params: { query: searchQuery },
// // //       });
// // //       navigate("/search-results", { state: { products: response.data } });
// // //     } catch (error) {
// // //       console.error("Error fetching search results:", error);
// // //     }
// // //   };

// // //   const handleChatClick = () => {
// // //     const code = prompt("Enter 3-digit chat code:");
// // //     if (code && code.length === 3 && /^\d{3}$/.test(code)) {
// // //       window.location.href = `https://liveshare-1.onrender.com/${code}`;
// // //     } else {
// // //       alert("Please enter a valid 3-digit numeric code.");
// // //     }
// // //   };

// // //   return (
// // //     <header className="header">
// // //       <div className="header-top">
// // //         <div className="logo" onClick={handleLogoClick}>
// // //           <img
// // //             src="/images/logo1.png"
// // //             alt="TrendTreasure Logo"
// // //             className="logo-image"
// // //           />
// // //         </div>
// // //         <div className="search-bar">
// // //           <input
// // //             type="text"
// // //             placeholder="Search for products, brands and more"
// // //             value={searchQuery}
// // //             onChange={(e) => setSearchQuery(e.target.value)}
// // //           />
// // //           <button type="button" onClick={handleSearch}>
// // //             Search
// // //           </button>
// // //         </div>
// // //         <div className="header-icons">
// // //           <div className="header-icon" onClick={handleLoginClick}>
// // //             <FontAwesomeIcon icon={faUser} /> Login
// // //           </div>
// // //           <div className="header-icon" onClick={handleCartClick}>
// // //             <FontAwesomeIcon icon={faShoppingCart} /> Cart
// // //           </div>
// // //           <div className="header-icon" onClick={() => navigate("/skintone")}>
// // //             <FontAwesomeIcon icon={faPalette} /> SkinTone
// // //           </div>
// // //           <div className="header-icon" onClick={handleChatClick}>
// // //             <FontAwesomeIcon icon={faComments} /> Chat
// // //           </div>
// // //           <div className="header-icon profile-dropdown">
// // //             <FontAwesomeIcon icon={faUserCircle} /> Profile
// // //             <div className="profile-dropdown-content">
// // //               <Profile />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </header>
// // //   );
// // // };

// // // export default Header;

// // // import React, { useState } from "react";
// // // import { Link, useNavigate } from "react-router-dom";
// // // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // // import {
// // //   faUser,
// // //   faShoppingCart,
// // //   faUserCircle,
// // //   faPalette,
// // // } from "@fortawesome/free-solid-svg-icons";
// // // import "./Header.css";
// // // import Profile from "./Profile";
// // // import axios from "axios";
// // // const config = require("../Config/Constant");

// // // const Header = () => {
// // //   const [searchQuery, setSearchQuery] = useState("");
// // //   const navigate = useNavigate();

// // //   const handleLoginClick = () => {
// // //     navigate("/login");
// // //   };

// // //   const handleCartClick = () => {
// // //     navigate("/cart");
// // //   };

// // //   const handleLogoClick = () => {
// // //     navigate("/");
// // //   };

// // //   const handleSearch = async () => {
// // //     try {
// // //       const response = await axios.get(`${config.BASE_URL}products/search`, {
// // //         params: { query: searchQuery },
// // //       });
// // //       navigate("/search-results", { state: { products: response.data } });
// // //     } catch (error) {
// // //       console.error("Error fetching search results:", error);
// // //     }
// // //   };

// // //   return (
// // //     <header className="header">
// // //       <div className="header-top">
// // //         <div className="logo" onClick={handleLogoClick}>
// // //           <img
// // //             src="/images/logo1.png"
// // //             alt="TrendTreasure Logo"
// // //             className="logo-image"
// // //           />
// // //         </div>
// // //         {/* {<nav className="header-bottom">
// // //           <ul>
// // //             <li><Link to="/category/Men">Men</Link></li>
// // //             <li><Link to="/category/Women">Women</Link></li>
// // //             <li><Link to="/category/Kids">Kids</Link></li>
// // //             <li><Link to="/category/Electronics">Electronics</Link></li>
// // //             <li><Link to="/category/Footwear">Footwear</Link></li>
// // //             <li><Link to="/category/Beauty">Beauty</Link></li>
// // //             <li><Link to="/category/Jewellery">Jewellery</Link></li>
// // //           </ul>
// // //         </nav>} */}
// // //         <div className="search-bar">
// // //           <input
// // //             type="text"
// // //             placeholder="Search for products, brands and more"
// // //             value={searchQuery}
// // //             onChange={(e) => setSearchQuery(e.target.value)}
// // //           />
// // //           <button type="button" onClick={handleSearch}>
// // //             Search
// // //           </button>
// // //         </div>
// // //         <div className="header-icons">
// // //           <div className="header-icon" onClick={handleLoginClick}>
// // //             <FontAwesomeIcon icon={faUser} /> Login
// // //           </div>
// // //           <div className="header-icon" onClick={handleCartClick}>
// // //             <FontAwesomeIcon icon={faShoppingCart} /> Cart
// // //           </div>
// // //           <div className="header-icon" onClick={() => navigate("/skintone")}>
// // //             <FontAwesomeIcon icon={faPalette} /> SkinTone
// // //           </div>
// // //           <div className="header-icon profile-dropdown">
// // //             <FontAwesomeIcon icon={faUserCircle} /> Profile
// // //             <div className="profile-dropdown-content">
// // //               <Profile />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </header>
// // //   );
// // // };

// // // export default Header;
// // // // import React, { useState } from 'react';
// // // // import { Link, useNavigate } from 'react-router-dom';
// // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // import { faUser, faShoppingCart, faUserCircle } from '@fortawesome/free-solid-svg-icons';
// // // // import './Header.css';
// // // // import Profile from './Profile';
// // // // import axios from 'axios';
// // // // const config = require('../Config/Constant');

// // // // const Header = () => {
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const navigate = useNavigate();

// // // //   const handleLoginClick = () => {
// // // //     navigate('/login');
// // // //   };

// // // //   const handleCartClick = () => {
// // // //     navigate('/cart');
// // // //   };

// // // //   const handleLogoClick = () => {
// // // //     navigate('/');
// // // //   };

// // // //   const handleSearch = async () => {
// // // //     try {
// // // //       const response = await axios.get(`${config.BASE_URL}products/search`, {
// // // //         params: { query: searchQuery },
// // // //       });
// // // //       navigate('/search-results', { state: { products: response.data } });
// // // //     } catch (error) {
// // // //       console.error('Error fetching search results:', error);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <header className="header">
// // // //       <div className="header-top">
// // // //         <div className="logo" onClick={handleLogoClick}>
// // // //           <img src="/images/logo1.png" alt="TrendTreasure Logo" className="logo-image" />
// // // //         </div>
// // // //         {/* {<nav className="header-bottom">
// // // //           <ul>
// // // //             <li><Link to="/category/Men">Men</Link></li>
// // // //             <li><Link to="/category/Women">Women</Link></li>
// // // //             <li><Link to="/category/Kids">Kids</Link></li>
// // // //             <li><Link to="/category/Electronics">Electronics</Link></li>
// // // //             <li><Link to="/category/Footwear">Footwear</Link></li>
// // // //             <li><Link to="/category/Beauty">Beauty</Link></li>
// // // //             <li><Link to="/category/Jewellery">Jewellery</Link></li>
// // // //           </ul>
// // // //         </nav>} */}
// // // //         <div className="search-bar">
// // // //           <input
// // // //             type="text"
// // // //             placeholder="Search for products, brands and more"
// // // //             value={searchQuery}
// // // //             onChange={(e) => setSearchQuery(e.target.value)}
// // // //           />
// // // //           <button type="button" onClick={handleSearch}>Search</button>
// // // //         </div>
// // // //         <div className="header-icons">
// // // //           <div className="header-icon" onClick={handleLoginClick}>
// // // //             <FontAwesomeIcon icon={faUser} /> Login
// // // //           </div>
// // // //           <div className="header-icon" onClick={handleCartClick}>
// // // //             <FontAwesomeIcon icon={faShoppingCart} /> Cart
// // // //           </div>
// // // //           <div className="header-icon profile-dropdown">
// // // //             <FontAwesomeIcon icon={faUserCircle} /> Profile
// // // //             <div className="profile-dropdown-content">
// // // //               <Profile />
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </header>
// // // //   );
// // // // };

// // // // export default Header;
