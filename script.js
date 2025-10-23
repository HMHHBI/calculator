let string = "";
let buttons = document.querySelectorAll("button");
let memory = 0;
const memoryDisplay = document.querySelector(".memory-display");
const historyContainer = document.querySelector(".history");
const clearHistoryBtn = document.querySelector(".clear-history");

// Update your Memory and its Display
function updateMemoryDisplay() {
  if (memory === 0) {
    memoryDisplay.classList.remove("memory-visible");
    setTimeout(() => {
      memoryDisplay.style.display = "none";
    }, 400); // matches CSS transition time
  } else {
    memoryDisplay.style.display = "block";
    setTimeout(() => {
      memoryDisplay.classList.add("memory-visible");
    }, 10); // small delay so transition triggers
    memoryDisplay.textContent = `Memory: ${memory}`;
  }
}

// 🧠 Save calculation to localStorage
function saveToHistory(expression, result) {
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.push({ expression, result });
  localStorage.setItem("calcHistory", JSON.stringify(history));
  displayHistory();
}

// 📜 Display history on screen
function displayHistory() {
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  historyContainer.innerHTML = ""; // clear first

  history.forEach((item) => {
    const p = document.createElement("p");
    p.textContent = `${item.expression} = ${item.result}`;
    historyContainer.appendChild(p);
  });
}

// 🧹 Clear all history
clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem("calcHistory");
  displayHistory();
});

Array.from(buttons).forEach((button) => {
  button.addEventListener("click", (e) => {
    const value = e.target.innerHTML;
    const display = document.querySelector("input");
    const operators = ["+", "-", "*", "/", "%", "^"];

    if (value == "=") {
      if (display.value.trim() === "") return;
      try {
        const expression = string;
        string = string.replace(/\^/g, "**");
        const result = eval(string);
        display.value = result;
        saveToHistory(expression, result);
        string = result.toString(); // allow chaining
      } catch {
        display.value = "Error";
        string = "";
      }
    } else if (value === "M+") {
      memory += parseFloat(display.value) || 0;
      updateMemoryDisplay();
      string = "";
      display.value = ""; // clear input after M+
    } else if (value === "M-") {
      memory -= parseFloat(display.value) || 0;
      updateMemoryDisplay();
      string = "";
      display.value = ""; // clear input after M-
    } else if (value === "MC") {
      memory = 0;
      updateMemoryDisplay();
    } else if (value === "MR") {
      display.value = memory;
      string = memory.toString();
      updateMemoryDisplay();
    } else if (value == "C") {
      string = "";
      display.value = string;
    } else {
      const lastChar = string[string.length - 1];
      if (operators.includes(value) && operators.includes(lastChar)) return;

      if (display.value === "Error") string = "";
      string = string + value;
      display.value = string;
    }
  });
});

document.addEventListener("keydown", (e) => {
  const display = document.querySelector(".display");
  const key = e.key;
  const operators = ["+", "-", "*", "/", "%", "^"];

  if (!isNaN(key) || key === ".") {
    // number or decimal
    string += key;
    display.value = string;
  } else if (operators.includes(key)) {
    const lastChar = string[string.length - 1];
    if (!operators.includes(lastChar)) {
      string += key;
      display.value = string;
    }
  } else if (key === "Enter") {
    try {
      string = string.replace(/\^/g, "**");
      string = eval(string);
      display.value = string;
    } catch {
      display.value = "Error";
      string = "";
    }
  } else if (key === "Backspace") {
    string = string.slice(0, -1);
    display.value = string;
  } else if (key.toLowerCase() === "c") {
    string = "";
    display.value = "";
  }

  // --- MEMORY SHORTCUTS ---
  if (e.shiftKey && e.code === "Equal") { 
    // SHIFT + = → "+"
    memory += parseFloat(display.value) || 0;
    updateMemoryDisplay();
    e.preventDefault();
    return;
  } else if (e.shiftKey && e.code === "Minus") { 
    // SHIFT + - → "_"
    memory -= parseFloat(display.value) || 0;
    updateMemoryDisplay();
    e.preventDefault();
    return;
  } else if (e.shiftKey && e.code === "KeyR") { 
    // CTRL + R → MR
    display.value = memory;
    updateMemoryDisplay();
    e.preventDefault();
    return;
  } else if (e.shiftKey && e.code === "KeyC") { 
    // CTRL + C → MC
    memory = 0;
    updateMemoryDisplay();
    e.preventDefault();
    return;
  }
});

displayHistory();