// const newChatButton = document.getElementById("newchat-btn");
// const chatsContainer = document.getElementById("sidebar-chat-group");
// const chatnameInput = document.getElementById("chatname-input");
// const chatsSaved = chatsContainer.children;

// function invalidChatName(err) {
//   err === "short"
//     ? (chatnameInput.ariaPlaceholder =
//         "Name to short, minimun length is four characters")
//     : (chatnameInput.ariaPlaceholder = "Chat name already in use");
//   chatnameInput.value = "";
//   err === "short"
//     ? (chatnameInput.placeholder = "Name to short (min 4 chars)")
//     : (chatnameInput.placeholder = "Chat name in use");
//   chatnameInput.style.border = "solid red 2px ";
//   return;
// }

// newChatButton.addEventListener("click", () => {
//   if (chatsContainer.childElementCount > 3) {
//     newChatButton.textContent = "Max Chats Reached";
//     newChatButton.disabled = true;
//     return;
//   }
//   if (newChatButton.textContent !== "Add") {
//     chatnameInput.setAttribute(
//       "style",
//       "height:20px ; opacity:1;  font-size: 15px, max-width:10rem; margin-top:.5rem"
//     );
//     return (newChatButton.textContent = "Add");
//   } else {
//     if (chatnameInput.value.length < 4) {
//       return invalidChatName("short");
//     }
//     if (chatnameInput.value.length > 4) {
//       Array.from(chatsSaved).map((element) => {
//         if (element.children[0].textContent === chatnameInput.value) {
//           return invalidChatName("exist");
//         }
//       });

//       const li = document.createElement("li");
//       const p = document.createElement("p");
//       p.textContent = chatnameInput.value;
//       li.appendChild(p);
//       newChatButton.textContent = "New Chat";
//       chatnameInput.setAttribute("style", "opacity: 0; height:0");
//       chatnameInput.value = "";
//       return chatsContainer.appendChild(li);
//     }
//   }
// });
