let urgentHelp = false;
let onHelp = false;

let difficultyLevel = 0;

let help = undefined;
let helpTimeouts = [];

class Help {
  constructor(titleText = null) {
    this.titleText = titleText;
    this.hasCompleted = false;
    happyOkabeSoundSrc.play();
  }

  drawBoard() {
    c.drawImage(tabletImage, canvas.width / 2 - canvas.width / (1.5 * 2), canvas.height / 2 - canvas.height / (1.5 * 2), canvas.width / 1.5, canvas.height / 1.5);

    c.fillStyle = "black";
    c.font = `bold ${canvas.width / 64}px Franklin Gothic Medium`;
    c.fillText(this.titleText, canvas.width / 1.25 - canvas.width / (1.5 * 2), canvas.height / 1.7 - canvas.height / (1.5 * 2));
  }
}

class Decipher extends Help {
  constructor(difficultyLevel) {
    super("Decipher")
    this.guess = "";
    this.key = {};
    this.code = "";
    this.answer = "";
    this.difficultyLevel = difficultyLevel;

    this.createCode();
    this.formatKey();
  }

  createCode() {
    let key = {};
  
    let code = "";
    let answer = "";
    let codeLength = DECIPHER_DEFAULT_CODE_LENGTH + this.difficultyLevel;
  
    // Generates a number from 0-9 for each possibleLetter and adds it to {key}
    possibleLetters.forEach(letter => {
      key[letter] = Math.ceil(Math.random() * 9);
    })
  
    // Creates a random code and answer and adds to respective variable
    for (let i = 0; i < codeLength; i++) {
      let letters = Object.keys(key);
      let randomLetterIndex = Math.floor(Math.random() * Object.keys(key).length);
      let randomKey = letters[randomLetterIndex];
      let randomValue = key[randomKey];
  
      code += randomKey;
      answer += randomValue;
    }

    this.key = key;
    this.code = code;
    this.answer = answer;

  }

  drawElements() {
    this.drawBoard();

    c.font = `bold ${canvas.width / 32}px Franklin Gothic Medium`;
    c.fillText(`${this.code}`, canvas.width / 1.9 - canvas.width / (1.5 * 2), canvas.height / 1.4 - canvas.height / (1.5 * 2));

    c.fillText(`${this.guess}`, canvas.width / 1.9 - canvas.width / (1.5 * 2), canvas.height / 1.2 - canvas.height / (1.5 * 2));

    c.font = `bold ${canvas.width / 128}px Franklin Gothic Medium`;
    c.fillStyle = "blue";
    c.fillText(`${this.key}`, canvas.width / 1.9 - canvas.width / (1.5 * 2), canvas.height / 1 - canvas.height / (2.3 * 2));
  }

  checkGuess() {
    if (this.guess === this.answer) this.hasCompleted = true;
    else spawnJumpscare();
  }

  formatKey() {
    let keys = Object.keys(this.key);
    let newKeys = "";

    keys.forEach(key => {
      newKeys += `${key} : ${this.key[key]}      `
    })

    this.key = newKeys;
  }
}


function manageHelp() {

  c.drawImage(okabeHelpImage, canvas.width / 1.15, canvas.height / 1.33, canvas.width / 8, canvas.height / 4);

  if (urgentHelp) c.drawImage(okabeHelpUrgentImage, canvas.width / 1.15, canvas.height / 1.33, canvas.width / 8, canvas.height / 4)

  if (help !== undefined) {
    if (onHelp) help.drawElements();

    if (help.hasCompleted) {
      winHelp();
    }
  }
}

function helpActions(key) {
  if (help !== undefined) {
    if (key === "Enter") help.checkGuess();
    else if (key === "Backspace") help.guess = "";
    else {
      for (number of NUMBERS) {
        if (key === number) {
          help.guess += number;
        }
      }
    }
  }
}


function setUpHelp() {

    let timeUntilNextTask = (Math.random() * (MAX_HELP_TIME - MIN_HELP_TIME)) + MIN_HELP_TIME;
    console.log(timeUntilNextTask);

    setTimeout(() => {
      help = new Decipher(difficultyLevel);

      helpTimeouts[0] = setTimeout(() => {
        urgentHelp = true;
        
        helpTimeouts[1] = setTimeout(() => {
          spawnJumpscare();
        }, TIME_TILL_PAST_URGENT);

      }, TIME_TILL_URGENT);

    }, timeUntilNextTask);

}

function winHelp() {
  happyOkabeSoundSrc.play();
  difficultyLevel++;
  mayuriSpawnTimeDecrementTotal += ENEMY_SPAWN_DECREMENT_PER_HELP;
  onHelp = false;
  help = undefined;

  clearTimeout(helpTimeouts[0]);
  clearTimeout(helpTimeouts[1]);
  setUpHelp();
}