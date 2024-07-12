const dialog = document.getElementById("dialog");
const signUp = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const loginTitle = document.getElementById("login-title");
const loginForm = document.getElementById("login-form");
const backto = document.getElementById("backto-login-anchor");
const passwordInput = document.getElementById("password-input");
const passwordConfirmInput = document.getElementById("password-confirm-input");
const emailInput = document.getElementById("email-input");
const emailConfirmInput = document.getElementById("email-confirm-input");
const loginAction = document.getElementById("login-action");
const incorrectData = document.getElementById("incorrect-data");
const container = document.getElementById("login-form-container");

let loginAttemps = 0;

passwordConfirmInput.addEventListener("input", (e) => {
  if (e.target.value !== passwordInput.value) {
    passwordConfirmInput.setCustomValidity("Passwords do not match");
  } else {
    passwordConfirmInput.setCustomValidity("");
  }
});

emailConfirmInput.addEventListener("input", (e) => {
  if (e.target.value !== emailInput.value) {
    console.log(emailInput.value, e.target.value);
    console.log(emailInput.value === e.target.value);
    emailConfirmInput.setCustomValidity("Emails do not match");
  } else {
    console.log(emailInput.value === e.target.value);
    emailConfirmInput.setCustomValidity("");
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  container.style.cursor = "wait";
  loginBtn.style.cursor = "wait";
  loginBtn.ariaDisabled = true;
  loginBtn.disabled = true;
  loginBtn.style.backgroundColor = "gray";
  Array.from(loginForm.childNodes).forEach((element) => {
    if (element.nodeName === "INPUT" && element.value) {
      element.value = DOMPurify.sanitize(element.value);
    }
  });

  setTimeout(() => {
    loginForm.style.cursor = "wait";
    loginForm.submit();
    loginAttemps += 1;
  }, 2000);
});

function setShowElements(arg) {
  backto.hidden = !arg;
  backto.ariaHidden = !arg;
  if (arg) {
    loginTitle.innerHTML = "Sing Up";
    loginBtn.textContent = "Sign Up";
    loginAction.value = "SingUp";
    loginForm.setAttribute("action", "/sign-up");
    if (incorrectData) {
      incorrectData.hidden = true;
    }
  } else {
    loginBtn.textContent = "Sign In";
    loginTitle.textContent = "Sign In";
    loginAction.value = "SignIn";
    loginForm.setAttribute("action", "/sign-in");
    if (incorrectData) {
      incorrectData.hidden = false;
    }
  }
  for (const item of loginForm.children) {
    if (item.className.match("hiddable")) {
      item.hidden = !arg;
      item.ariaHidden = !arg;
      item.required = arg;
    }
  }
}

signUp.addEventListener("click", () => setShowElements(true));
backto.addEventListener("click", () => setShowElements(false));
