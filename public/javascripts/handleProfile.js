const notification = new Audio("../sounds/the-notification-email-143029.mp3");
const settingbtn = document.getElementById("settings-btn");
const settingsContainer = document.getElementById("settings-container");
const volume = document.getElementById("volume");
const volumeSlider = document.getElementById("volume-slider");
const body = document.getElementsByTagName("body")[0];
const chatcontainer = document.querySelector("#chat-container");
const chatmsgs = document.querySelector("#chat-messages");
const resetBtn = document.getElementById("reset-colors");
const defaultBtn = document.getElementById("default-theme");
const sidebar = document.getElementById("sidebar");
const textColorPicker = document.getElementById("text-color-picker");
const recievedColorPicker = document.getElementById("recieved-color-picker");
const sentColorPicker = document.getElementById("sent-color-picker");
const chatTextColorPicker = document.getElementById("chat-text-color-picker");
const bodyColorPicker = document.getElementById("body-color-picker");
const accentColorPicker = document.getElementById("accent-color-picker");
const bubblesTextColorPicker = document.getElementById(
  "bubbles-text-color-picker"
);
const settingsSVG = document.getElementById("settings-svg");
const messageSVG = document.getElementById("message-svg");
const chatColorPicker = document.getElementById("chat-color-picker");
const logoutbutton = document.getElementById("logout");
const testUserBubbles = document.getElementById("test-userbubble");
const testChatBubbles = document.getElementById("test-chatbubble");
const chatTextInput = document.getElementById("chat-textinput");

const saveThemeBtn = document.getElementById("save-theme");
const defaultThemeBtn = document.getElementById("default-theme");

const settingsObj = {};

async function updateProfile() {
  try {
    const response = await fetch("/profile/update", {
      method: "POST",
      body: JSON.stringify(settingsObj),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if ((response.status = 200)) {
      return (window.location.href = "/");
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

saveThemeBtn.addEventListener("click", () => {
  if (Object.keys(settingsObj).length > 0) {
    return updateProfile();
  }
});

async function defaultSettings() {
  try {
    const response = await fetch("/profile?default=true", {
      method: "GET",
    });
    if (response.status === 200) {
      return (window.location.href = "/");
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

defaultBtn.addEventListener("click", () => {
  return defaultSettings();
});

const accentStyle = window.getComputedStyle(sidebar);
const accentColor = accentStyle.backgroundColor;
const textColor = accentStyle.color;
const color = tinycolor(accentColor);
if (color.isDark()) {
  settingsSVG.style.filter = "invert(1)";
  messageSVG.style.filter = "invert(1)";
  if (textColor === "rgb(0, 0, 0)") {
    // body.style.color = "white";
    // settingsContainer.style.color = "white";
  }
}
if (color.isLight()) {
  settingsSVG.style.filter = "invert(0)";
  messageSVG.style.filter = "invert(0)";
  if (textColor === "rgb(255, 255, 255)") {
    // body.style.color = "black";
    // settingsContainer.style.color = "black";
  }
}

volumeSlider.addEventListener("input", (e) => {
  volume.textContent = e.target.value + "%";
  notification.volume = e.target.value / 100;
  notification.play();
  settingsObj.volume = e.target.value;
});

resetBtn.addEventListener("click", () => {
  window.location.href = "/";
});

settingbtn.addEventListener("click", () => {
  if (
    settingsContainer.style.width === "0rem" ||
    !settingsContainer.style.width
  ) {
    settingsContainer.style.border = "solid 3rem rgba(0, 0, 0, 0.24)";

    const enlargeAnimation = settingsContainer.animate(
      [{ width: "48rem" }],

      {
        duration: 300,
        iterations: 1,
      }
    );
    enlargeAnimation.onfinish = () => {
      settingsContainer.style.width = "48rem";
    };
  } else {
    const shrinkAnimation = settingsContainer.animate(
      [{ width: "0" }],

      {
        duration: 300,
        iterations: 1,
      }
    );
    shrinkAnimation.onfinish = () => {
      settingsContainer.style.width = "0rem";
      settingsContainer.style.border = "none";
    };
  }
});

bodyColorPicker.addEventListener("input", (e) => {
  body.style.backgroundColor = e.target.value;
  settingsObj.body_bg = e.target.value;
});

accentColorPicker.addEventListener("input", (e) => {
  const color = tinycolor(e.target.value);
  if (color.isLight()) {
    body.style.color = "black";
    settingsContainer.style.color = "black";
    settingsSVG.style.filter = "invert(0)";
    messageSVG.style.filter = "invert(0)";
  }
  if (color.isDark()) {
    body.style.color = "white";
    settingsContainer.style.color = "white";
    settingsSVG.style.filter = "invert(1)";
    messageSVG.style.filter = "invert(1)";
  }
  chatcontainer.style.backgroundColor = e.target.value;
  sidebar.style.backgroundColor = e.target.value;
  settingsContainer.style.backgroundColor = e.target.value;
  settingsObj.accent_bg = e.target.value;
});

chatColorPicker.addEventListener("input", (e) => {
  chatmsgs.style.backgroundColor = e.target.value;
  settingsObj.chat_bg = e.target.value;
});

bubblesTextColorPicker.addEventListener("input", (e) => {
  testUserBubbles.style.color = e.target.value;
  testChatBubbles.style.color = e.target.value;
  settingsObj.bubbles_tc = e.target.value;
});

chatTextColorPicker.addEventListener("input", (e) => {
  chatTextInput.style.color = e.target.value;
  settingsObj.textarea_tc = e.target.value;
});

textColorPicker.addEventListener("input", (e) => {
  body.style.color = e.target.value;
  settingsContainer.style.color = e.target.value;
  settingsObj.all_tc = e.target.value;
});

recievedColorPicker.addEventListener("input", (e) => {
  testChatBubbles.style.backgroundColor = e.target.value;
  settingsObj.chatbubble_bg = e.target.value;
});

sentColorPicker.addEventListener("input", (e) => {
  testUserBubbles.style.backgroundColor = e.target.value;
  settingsObj.userbubble_bg = e.target.value;
});

const changePasswordForm = document.getElementById("change-password-form");
const changeEmailForm = document.getElementById("change-email-form");
const creedentialsChangeErrorMessage = document.createElement("p");
creedentialsChangeErrorMessage.setAttribute(
  "style",
  "color:#ff5252; font-size:16px"
);

changeEmailForm.append(creedentialsChangeErrorMessage);
changePasswordForm.append(creedentialsChangeErrorMessage);
const newEmail = document.getElementById("newEmail");
const newEmailConfirm = document.getElementById("newEmailConfirm");

function handlePasswordChange(e) {
  e.preventDefault();
  const newPassword = document.getElementById("newPassword");
  const newPasswordConfirm = document.getElementById("newPasswordConfirm");
  if (newPassword.value.length < 8) {
    return (creedentialsChangeErrorMessage.textContent =
      "Password to short (8 character required)");
  }

  if (newPassword.value === newPasswordConfirm.value) {
    Array.from(changePasswordForm.childNodes).forEach((child) => {
      if (child.nodeName === "INPUT") {
        child.value = DOMPurify.sanitize(child.value);
      }
    });
    return changePasswordForm.submit();
  } else {
    return (creedentialsChangeErrorMessage.textContent =
      "New passwords do not match");
  }
}

// async function updateEmail(email) {
//   try {
//     const response = await fetch("/profile/change-creedentials", {
//       method: "POST",
//       body: "newEmail=" + email,
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });
//     const data = await response.json();
//     if (response.status === 204) {
//       newEmail.value = "";
//       newEmailConfirm.value = "";
//     }
//     // creedentialsChangeErrorMessage.textContent = data.creedetialsMessage;
//     if (response.status !== 200) {
//       // return (creedentialsChangeErrorMessage.textContent = data.message);
//     }
//     return;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }

function handleEmailChange(e) {
  e.preventDefault();
  if (newEmail.value === newEmailConfirm.value) {
    Array.from(changeEmailForm.childNodes).forEach((child) => {
      if (child.nodeName === "INPUT") {
        child.value = DOMPurify.sanitize(child.value);
      }
    });
    changeEmailForm.submit();
  } else {
    return (creedentialsChangeErrorMessage.textContent = "Emails do not match");
  }
}

changePasswordForm.addEventListener("submit", handlePasswordChange);
changeEmailForm.addEventListener("submit", handleEmailChange);
