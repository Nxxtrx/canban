import React, { useContext, useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import TodoContainer from "./components/TodoContainer";
import UsersContainer from "./components/UsersContainer";
import Calendar from "./components/Calendar";
import TasksForDay from "./components/TasksForDay";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { WebSocketContext } from "./provider/WebSocketProvider";
import { io } from "socket.io-client";

function App() {
  const location = useLocation();
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const socket = io.connect("http://localhost:3002");

  useEffect(() => {
    function onConnect() {
      console.log("connected");
      const fetchMeetings = async () => {
        try {
          await socket.emit('fetchMeetings');
          socket.on('meetings', (data) => {
            console.log(data);
          });
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchMeetings();
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  // const socket = useRef();
  // const [connected, setConnected] = useState(false);

  // useEffect(() => {
  //   socket.current = new WebSocket("ws://localhost:8080");

  //   socket.current.onopen = () => {
  //     console.log("WebSocket connected");
  //     setConnected(true);
  //     const message = {
  //       type: "message",
  //       id: Date.now(),
  //       content: 'Hie',
  //     }
  //     if(socket.current && socket.current.readyState === 1) {
  //       socket.current.send(JSON.stringify(message));
  //     }
  //   };

  //   socket.current.onmessage = (event) => {
  //     const message = JSON.parse(event.data);
  //     console.log(message)
  //   };

  //   socket.current.onclose = () => {
  //     console.log("WebSocket disconnected");
  //   };

  //   socket.current.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };
  // }, [])

  // const { sendMessage, lastMessage, readyState} = useContext(WebSocketContext)

  // useEffect(() => {
  //   if (readyState === 1) { // WebSocket.OPEN
  //     const message = {
  //       type: "meeting",
  //     };
  //     sendMessage(JSON.stringify(message));
  //   }
  // }, [readyState, sendMessage]);

  // useEffect(() => {
  //   if (lastMessage !== null) {
  //     const message = JSON.parse(lastMessage.data);
  //     console.log("Received from server:", message);
  //   }
  // }, [lastMessage]);

  
  return (
    <div className= {`${location.pathname === "/" ? "overflow-hidden  overflow-x-scroll" : ""}`}>
      
        <Header
          setIsBoardModalOpen={setIsBoardModalOpen}
          isBoardModalOpen={isBoardModalOpen}
        />
      {windowSize[0] >= 768 && (
        <Sidebar
          setIsBoardModalOpen={setIsBoardModalOpen}
          isBoardModalOpen={isBoardModalOpen}
          isSideBarOpen={isSideBarOpen}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      )}
        <Routes>
          <Route path="/" element={<TodoContainer />} />
          <Route path="/users" element={<UsersContainer />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/date/:date" element={<TasksForDay />} />
        </Routes>
    </div>
  );
}

export default App;
