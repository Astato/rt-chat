const socket = io();
const form = document.getElementById("chat-text-input-container");
const submitbtn = document.getElementById("submit-message");
const textArea = document.getElementById("chat-textinput");
const messagesContainer = document.getElementById("chat-messages");
const chatContainer = document.getElementById("chat-container");
messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
const Notification = new Audio("../sounds/the-notification-email-143029.mp3");
const userList = document.getElementById("sidebar-chat-group");
const username = document.getElementById("username").innerText;
const globalChat = document.getElementById("global-chat");
const friendlist = document.getElementsByClassName("friend-list-item");
const logout = document.getElementById("logout");
const selectedChatLabel = document.getElementById("chat-selected-label");
const notificationVolume = document.getElementById("volume-slider");
const activeChats = new Set([]);

let isFriendChatSelected = false;
let targetSocketID = false;
let newGlobalMessageCount = 0;

window.addEventListener("focus", () => {
  if (document.title === "New Message") {
    document.title = "Message App";
  }
});

function notifications(data, isPrivate, issuer) {
  if (isPrivate && issuer) {
    if (isFriendChatSelected[0] === issuer) {
      return updateMessagesUI(data, true);
    } else {
      Array.from(friendlist).forEach((friend) => {
        if (friend.textContent === issuer) {
          friend.textContent += "(New)";
          return;
        }
      });
    }
  }
}

socket.on("New Message", (message) => {
  if (globalChat.className === "focused") {
    return updateMessagesUI(message, true);
  } else {
    return (globalChat.textContent =
      " New (" + Number(newGlobalMessageCount) + 1 + ")");
  }
});

socket.on("Private Message", (message, chatkey, sender) => {
  if (sender === username) {
    activeChats.add(chatkey);
    return updateMessagesUI(message, true);
  } else {
    activeChats.add(chatkey);
    return notifications(message, true, sender);
  }
});

socket.on("Append Unsaved Messages", (data) => {
  updateMessagesUI(data, true);
});

function updateMessagesUI(data, append) {
  if (append && !Array.isArray(data)) {
    const chatsbubble = document.createElement("div");
    data.name === username
      ? chatsbubble.classList.add("user-bubble")
      : chatsbubble.classList.add("chat-bubble");
    const msgName = document.createElement("p");
    const msgTime = document.createElement("p");
    const msgText = document.createElement("p");
    msgName.classList.add("message-name");
    msgText.classList.add("message-text");
    msgTime.classList.add("message-time");
    msgName.textContent = data.name;
    msgText.textContent = data.message;
    msgTime.textContent = data.time;
    chatsbubble.append(msgName, msgTime, msgText);
    messagesContainer.appendChild(chatsbubble);
  } else {
    if (!append) {
      messagesContainer.innerHTML = "";
    }
    for (const message of data) {
      const chatsbubble = document.createElement("div");
      message.name === username
        ? chatsbubble.classList.add("user-bubble")
        : chatsbubble.classList.add("chat-bubble");
      const msgName = document.createElement("p");
      const msgTime = document.createElement("p");
      const msgText = document.createElement("p");
      msgName.classList.add("message-name");
      msgText.classList.add("message-text");
      msgTime.classList.add("message-time");
      msgName.textContent = message.name;
      msgText.textContent = message.message;
      msgTime.textContent = message.time;
      chatsbubble.append(msgName, msgTime, msgText);
      messagesContainer.appendChild(chatsbubble);
    }
  }
  return messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
}

socket.on("Play Sound", () => {
  Notification.volume = notificationVolume.value / 100;
  Notification.play();
  return (document.title = "New Message");
});

if (username) {
  socket.emit("User Connected", username);
}

function updateConnectedFriends(connectedUser) {
  Array.from(friendlist).forEach((friend) => {
    if (friend.textContent === connectedUser) {
      friend.style.boxShadow = "-6px 0 0 0 green";
      friend.id = "online";
      //// if the chat is selected with the user offline and the user connects, emit a click event
      // to get the socket.id
      if (friend.textContent === isFriendChatSelected[0]) {
        const click = new MouseEvent("click");
        isFriendChatSelected = false;
        friend.dispatchEvent(click);
      }
    }
    if (connectedUser !== username && friend.textContent !== connectedUser) {
      friend.id = "";
      friend.style.boxShadow = "-6px 0 0 0 black";
    }
  });
}

socket.on("Users List", (usersList) => {
  userList.innerHTML = "";
  if (Object.keys(usersList).length === 1) {
    return updateConnectedFriends(username * 3);
  }
  for (const connectedUser of Object.keys(usersList)) {
    updateConnectedFriends(connectedUser);
    const newItem = document.createElement("li");
    const newUser = document.createElement("p");
    newUser.textContent = connectedUser;
    newItem.appendChild(newUser);
    userList.appendChild(newItem);
  }
});

async function saveMessage(e) {
  e.preventDefault();
  submitbtn.disabled = true;
  submitbtn.ariaDisabled = true;
  const message = DOMPurify.sanitize(textArea.value);
  if (message) {
    const newMessage = {
      name: username,
      message: message,
      time: new Date().toLocaleString(),
    };
    textArea.value = "";
    if (!isFriendChatSelected) {
      socket.emit("New Message", newMessage);
    } else {
      if (isFriendChatSelected.includes("online")) {
        socket.emit(
          "Private Message",
          username,
          isFriendChatSelected[0],
          newMessage,
          targetSocketID
        );
      } else {
        socket.emit(
          "Private Message",
          username,
          isFriendChatSelected[0],
          newMessage
        );
      }
    }
  }
  setTimeout(() => {
    submitbtn.disabled = false;
    submitbtn.ariaDisabled = false;
  }, 1500);
}

function handleEnter(e) {
  const submit = new MouseEvent("click");
  if (e.key === "Enter") {
    e.preventDefault();
    submitbtn.dispatchEvent(submit);
  }
}

form.addEventListener("submit", saveMessage);
textArea.addEventListener("keypress", handleEnter);

socket.on("Friend Selected", (targetSocket) => {
  targetSocketID = targetSocket;
});

async function getFriendChat(issuer, target) {
  try {
    const getChat = await fetch("/friendchat", {
      method: "POST",
      body: JSON.stringify({
        issuer: issuer,
        target: target,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (getChat.status === 200) {
      globalChat.classList.add("unfocused");
      const data = await getChat.json();
      if (data[0] && data[0].chat) {
        return updateMessagesUI(data[0].chat);
      }
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

Array.from(friendlist).forEach((element) => {
  element.addEventListener("click", async () => {
    if (element.className.match("focused")) {
      return;
    }
    globalChat.classList.remove("focused");
    element.classList.add("focused");
    if (element.childNodes[1]) {
      element.childNodes[1].textContent = ""; /// new message indicator
    }
    const clickedUser = element.childNodes[0].textContent;
    selectedChatLabel.textContent = clickedUser;
    const removeNewMessage = clickedUser.split("(New)")[0];
    isFriendChatSelected = [removeNewMessage, element.id];
    if (clickedUser.match("(New)")) {
      element.childNodes[0].textContent = removeNewMessage;
      selectedChatLabel.textContent = removeNewMessage;
    }
    await getFriendChat(username, removeNewMessage)
      .then(() => socket.emit("Selected Chat", removeNewMessage, username))
      .catch((error) => console.log(error));
  });
});

async function getGlobalChats() {
  try {
    const response = await fetch("/globalchats", { method: "GET" });
    const data = await response.json();
    updateMessagesUI(data);
    return socket.emit("Select Global");
  } catch (error) {
    console.log(error);
    return error;
  }
}

globalChat.addEventListener("click", async () => {
  if (globalChat.className === "focused") {
    return;
  }
  globalChat.classList.remove("unfocused");
  if (document.getElementsByClassName("focused")) {
    const previouslyFocusedChat = document.getElementsByClassName("focused");
    previouslyFocusedChat[0].classList.remove("focused");
  }
  isFriendChatSelected = false;
  selectedChatLabel.textContent = "Global";
  globalChat.classList.add("focused");
  globalChat.textContent = "Global (Online)";
  return await getGlobalChats();
});

socket.on("Disconnect Request", (chatkeys) => {
  socket.emit("Disconnect Request", chatkeys);
});

logout.addEventListener("click", async () => {
  const setToArray = Array.from(activeChats);
  if (setToArray.length > 0) {
    try {
      const response = await fetch(
        "/sign-in/logout?socket=" +
          encodeURIComponent(socket.id) +
          "&activeChats=" +
          encodeURIComponent(setToArray),
        {
          method: "GET",
        }
      );
      if ((response.status = 200)) {
        window.location.href = "sign-in";
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  } else {
    try {
      const response = await fetch("/sign-in/logout", {
        method: "GET",
      });
      if (response.status === 200) {
        window.location.href = "sign-in";
      }
      return;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
});
