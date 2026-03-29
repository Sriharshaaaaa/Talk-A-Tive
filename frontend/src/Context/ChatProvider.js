import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(); //to make the state accessible to everyone
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate(); //This instance allows you to programmatically navigate within your application, as well as to perform other navigation-related actions.
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //         This line retrieves an item named "userInfo" from the browser's local storage.
    // localStorage.getItem("userInfo") gets the value associated with the "userInfo" key.
    // JSON.parse converts this value from a JSON string back into a JavaScript object. If "userInfo" does not exist in local storage, localStorage.getItem("userInfo") will return null.
    setUser(userInfo); //this will update the userInfo

    if (!userInfo) {
      //if the user is not logged in
      navigate("/"); //this will push the user to the login page
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
