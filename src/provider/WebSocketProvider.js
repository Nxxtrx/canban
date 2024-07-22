// import React, { createContext } from 'react';
// import useWebSocket from 'react-use-websocket';

// export const WebSocketContext = createContext(null);

// export const WebSocketProvider = ({ children }) => {
//   const {
//     sendMessage,
//     lastMessage,
//     readyState,
//     getWebSocket
//   } = useWebSocket('ws://localhost:8080');

//   return (
//     <WebSocketContext.Provider value={{ sendMessage, lastMessage, readyState, getWebSocket }}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };