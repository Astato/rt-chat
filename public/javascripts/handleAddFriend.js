const openAddFriend = document.getElementById("open-friend-dialog");
const addFriendDialog = document.getElementById("add-friend-dialog");
const closeAddFriendDialog = document.getElementById("close-add-friend");
const addFriend = document.getElementById("add-friend-btn");
const friendEmailInput = document.getElementById("addfriendemail");
const addFriendErrorText = document.getElementById("addFriendError");
const openAddDialog = () => {
  addFriendDialog.style.display = "block";
  openAddFriend.style.display = "none";
};

const closeAddDialog = () => {
  addFriendDialog.style.display = "none";
  openAddFriend.style.display = "block";
};

closeAddFriendDialog.addEventListener("click", closeAddDialog);
openAddFriend.addEventListener("click", openAddDialog);

const tryAddFriend = async () => {
  const sanitizedEmail = DOMPurify.sanitize(friendEmailInput.value);
  const response = await fetch("/addfriend", {
    method: "POST",
    body: "email=" + sanitizedEmail,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const data = await response.json();
  if (data.addFriendError) {
    addFriendErrorText.textContent = data.addFriendError;
  }
  return response;
};

addFriend.addEventListener("click", async (e) => {
  e.preventDefault();
  await tryAddFriend();
});
