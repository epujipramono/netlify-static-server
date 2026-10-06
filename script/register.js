const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  try {
    window.location.href = "../pages/login.html";
  } catch (error) {
    message.textContent = "Unable to connect to server.";
  }
});
