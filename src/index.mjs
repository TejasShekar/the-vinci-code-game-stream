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
    // Elements
    this.welcomeEl = document.getElementById("welcome-text");
    this.nameInputForm = document.getElementById("name-input");
    this.btnsContainer = document.getElementById("game-btns-container");
    this.gameDisplayContainer = document.getElementById("game-container");
    this.numberInputForm = document.getElementById("game-input");
    this.numberDisplayEl = this.gameDisplayContainer.querySelector(".numbers-display");
    this.rulesBtn = document.querySelector("#game-instructions button");
    this.rulesSection = document.querySelector("#game-instructions ul");
    this.rulesBtn.addEventListener("click", () => {
      this.rulesSection.classList.toggle("show");
    });
    this.gameOverMsg = document.querySelector(".game-end-msg");

    // Variables
    this.currDisplayIndex = 0;
    this.generatedNumbers = [];
    this.enteredNumbers = [];
    this.level = 0;
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
      if (this.level === 0) this.displayUserName();
      this.nameInputForm.removeEventListener("submit", this.setUserName);
    } else {
      errorMsgEl.display = "block";
    }
  }.bind(this);

  start() {
    if (!localStorage.getItem("player_name")) {
      this.nameInputForm.addEventListener("submit", this.setUserName);
    } else {
      this.name = localStorage.getItem("player_name");
      this.displayUserName();
    }
  }

  handleMenuClick = function (event) {
    switch (event.target.dataset?.val) {
      case "new_game":
        this.btnsContainer.removeEventListener("click", this.handleMenuClick);
        this.updateGameState("Start Game");
        break;
      case "see_leaderbaord":
        console.log("Will Show Leaderboard Now...");
        break;
      case "update_name":
        this.welcomeEl.style.display = "none";
        this.btnsContainer.style.display = "none";
        this.nameInputForm.style.display = "flex";
        this.nameInputForm.addEventListener("submit", this.setUserName);
    }
  }.bind(this);

  displayMenu() {
    this.btnsContainer.style.display = "flex";
    this.btnsContainer.removeEventListener("click", this.handleMenuClick);
    this.btnsContainer.addEventListener("click", this.handleMenuClick);
  }

  randomNumber() {
    return Math.floor(Math.random() * 10);
  }

  generateNumbersForLevel() {
    for (let i = 0; i < this.level; i++) {
      this.generatedNumbers.push(this.randomNumber());
    }
  }

  onEnterKeyPress = function (e) {
    if (e.key === "Enter") {
      this.updateGameState("Display Next Number");
    }
  }.bind(this);

  displayNumber() {
    document.removeEventListener("keydown", this.onEnterKeyPress);
    this.numberDisplayEl.classList.add("fade");
    const currentNumber = this.generatedNumbers[this.currDisplayIndex];
    setTimeout(() => {
      this.numberDisplayEl.textContent = currentNumber;
      this.numberDisplayEl.classList.remove("fade");
    }, 500);
    this.currDisplayIndex += 1;
    document.addEventListener("keydown", this.onEnterKeyPress);
  }

  verifyLevel() {
    for (let i = 0; i < this.level; i++) {
      if (this.enteredNumbers[i] !== this.generatedNumbers[i]) {
        this.numberDisplayEl.style.display = "none";
        this.gameOverMsg.innerHTML = `<span>GAME OVER.</span> Your Score : ${
          this.level * 10
        }`;
        this.numberInputForm.style.display = "none";
        this.displayMenu();
        break;
      }
    }
    this.updateGameState("Update Level");
  }

  getInputValue = function (e) {
    e.preventDefault();
    this.enteredNumbers.push(Number(e.target[0].value));
    e.target[0].value = "";
    this.numberInputForm.removeEventListener("submit", this.getInputValue);
    this.updateGameState("Wait For Input");
  }.bind(this);

  getEachNumberFromPlayer() {
    this.numberInputForm.style.visibility = "visible";
    setTimeout(() => {
      this.numberInputForm.children[1].focus();
    }, 100);
    this.numberInputForm.addEventListener("submit", this.getInputValue);
  }

  updateGameState(nextState) {
    switch (nextState) {
      // Need to use constants as a better practise
      case "Start Game":
        this.level += 1;
        this.welcomeEl.style.display = "none";
        this.btnsContainer.style.display = "none";
        this.numberInputForm.style.display = "block";
        this.numberInputForm.style.visibility = "hidden";
        this.generateNumbersForLevel();
        this.gameDisplayContainer.style.display = "flex";
        this.displayNumber();
        break;
      case "Display Next Number":
        if (this.generatedNumbers.length !== this.currDisplayIndex) {
          this.displayNumber(this.currDisplayIndex + 1);
        } else {
          document.removeEventListener("keydown", this.onEnterKeyPress);
          this.numberInputForm.style.display = "block";
          this.updateGameState("Wait For Input");
        }
        break;
      case "Wait For Input":
        this.numberDisplayEl.classList.add("fade");
        if (this.enteredNumbers.length !== this.generatedNumbers.length) {
          this.getEachNumberFromPlayer();
        } else {
          this.numberInputForm.style.display = "block";
          this.numberInputForm.style.visibility = "hidden";
          this.verifyLevel();
        }
        break;
      case "Update Level":
        this.level += 1;
        this.generatedNumbers = [];
        this.enteredNumbers = [];
        this.currDisplayIndex = 0;
        this.generateNumbersForLevel();
        this.gameDisplayContainer.style.display = "flex";
        this.displayNumber();
        break;
      default:
        break;
    }
  }
}

let myGameInstance = new Game();
myGameInstance.start();
