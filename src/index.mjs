/*
1. Get the user's name
2. Show a menu
3. Menu items:
  a. Start New Game
  b. See Leaderboard
  c. Update Name
*/

class Game {
  constructor() {
    this.welcomeEl = document.getElementById("welcome-text");
    this.nameInputForm = document.getElementById("name-input");
    this.btnsContainer = document.getElementById("game-btns-container");
  }

  randomNumber() {
    return Math.floor(Math.random() * 10);
  }

  displayUserName = function () {
    this.welcomeEl.innerHTML = `Welcome, <span>${this.name}</span>`;
    this.welcomeEl.style.display = "block";
    this.nameInputForm.style.display = "none";
    this.displayMenu();
  }.bind(this);

  setUserName = function (e) {
    e.preventDefault();
    const username = e.target[0].value.trim();
    const errorMsgEl = document.querySelector(".error-msg").style;
    if (username) {
      errorMsgEl.display = "none";
      this.name = username;
      localStorage.setItem("player_name", this.name);
      this.displayUserName();
    } else {
      errorMsgEl.display = "block";
    }
  }.bind(this);

  start() {
    if (!localStorage.getItem("player_name")) {
      this.nameInputForm.removeEventListener("submit", this.setUserName);
      this.nameInputForm.addEventListener("submit", this.setUserName);
    } else {
      this.name = localStorage.getItem("player_name");
      this.displayUserName();
    }
  }

  handleMenuClick = function (event) {
    switch (event.target.dataset?.val) {
      case "1":
        this.updateLevel(1);
        this.gameLoop();
        break;
      case "2":
        console.log("Will Show Leaderboard Now...");
        break;
      case "3":
        this.name = prompt("Enter name to be updated:") || "Guest";
        this.displayMenu();
    }
  }.bind(this);

  displayMenu() {
    this.btnsContainer.style.display = "flex";
    this.btnsContainer.removeEventListener("click", this.handleMenuClick);
    this.btnsContainer.addEventListener("click", this.handleMenuClick);
  }
  updateLevel(level = 1) {
    this.generatedNumbers = [];
    this.enteredNumbers = [];
    this.level = level;
  }

  generateNumbersForLevel() {
    for (let i = 0; i < this.level; i++) {
      this.generatedNumbers.push(this.randomNumber());
    }
  }

  displayNumbersForLevel() {
    for (let i = 0; i < this.level; i++) {
      alert(this.generatedNumbers[i]);
    }
  }

  getNumbersFromUser() {
    for (let i = 0; i < this.level; i++) {
      let enteredValue = prompt(
        "Enter values in order one at a time: (press enter after every value)"
      );
      if (enteredValue === "" || enteredValue === null) {
        enteredValue = NaN;
      }
      this.enteredNumbers.push(Number(enteredValue));
    }
  }

  verifyLevel() {
    for (let i = 0; i < this.level; i++) {
      if (this.enteredNumbers[i] !== this.generatedNumbers[i]) return false;
    }
    return true;
  }

  gameLoop() {
    this.generateNumbersForLevel();
    this.displayNumbersForLevel();
    this.getNumbersFromUser();
    if (this.verifyLevel()) {
      this.updateLevel(this.level + 1);
      this.gameLoop();
    } else {
      alert(`Your score is: ${this.level}`);
    }
  }
}

let myGameInstance = new Game();
myGameInstance.start();
