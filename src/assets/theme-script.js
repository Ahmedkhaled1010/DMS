// Theme Toggle Functionality
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"
    const icon = document.getElementById("darkIcon");

if (newTheme === "dark") {
    icon.classList.remove("pi-sun");
    icon.classList.add("pi-moon");
  } else {
    icon.classList.remove("pi-moon");
    icon.classList.add("pi-sun");
  }
  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
}

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = "dark" // default is dark
    const icon = document.getElementById("darkIcon");

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme)
  } else {
    // Check system preference
   const theme = "dark" // default is dark
  document.documentElement.setAttribute("data-theme", theme)
  localStorage.setItem("theme", theme)
  }

  if (savedTheme === "dark") {
    icon.classList.remove("pi-sun");
    icon.classList.add("pi-moon");
  } else {
    icon.classList.remove("pi-moon");
    icon.classList.add("pi-sun");
  }

})

// Listen for system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) {
    const theme = e.matches ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", theme)
  }
})
