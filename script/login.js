const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  try {
    window.location.href = "../pages/dashboard.html";
  } catch (error) {
    message.textContent = "Unable to connect to server.";
    console.log(error)
  }
});
