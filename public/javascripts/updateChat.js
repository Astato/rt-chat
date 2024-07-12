// const getChats = require("../../controllers/readDB");

// async function updateChats() {
//   try {
//     const updatedChats = await getChats();
//     console.log(updatedChats, "updated chats");
//     if (updatedChats) {
//       const response = await fetch("http://localhost:3000", {
//         method: "POST",
//         body: "updatedChats=" + updatedChats,
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update Chats" + response.statusText);
//       }
//     }
//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// }

// module.exports = updateChats;
