const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let enemySpawnTime;
let spawning = false;
let inVent = false;
let battery = 100;

let settingHelp = false;
let okabeNeedsHelp = false;
let okabeNeedsUrgentHelp = false;
let onHelp = false;
let totalNumbers = 7;

let helpTimeout1;
let helpTimeout2;

let mayuriSpawn = 30000;

let letters = {"!": undefined, "@": undefined, "#": undefined, "$": undefined, "%": undefined, "^": undefined, "&": undefined, "*": undefined, "(": undefined, ")": undefined, "-": undefined, "=": undefined, "+": undefined, "]": undefined, "[": undefined}

let unsolvedCode = "";
let solvedCode = "";
let key = "";
let writtenAnswer = "";

let currentTime = 0;
let times = ["5:00PM", "5:30PM", "6:00PM", "6:30PM", "7:00PM", "7:30PM", "8:00PM"];

let onJumpscareAnimation = false;
let jumpscare = {
  size: {
    x: 0,
    y: 0
  },
  position: {
    x: canvas.width / 2,
    y: canvas.height / 2
  }
};

let spawnPoints = [
  {
    position: {
    x: canvas.width / 7.07,
    y: canvas.height / 2.43,
    width: canvas.width / 10.2,
    height: canvas.height / 2.95
  },
    shown: true 
  },
  {
    position: {
      x: canvas.width / 5.2,
      y: canvas.height / 1.2,
      width: canvas.width / 7,
      height: canvas.height / 25
    },
      hidden: true,
  }
];

addEventListener("load", () => {
  animate();
  startTime();
})

addEventListener("resize", () => {
  spawnPoints = [
    {
      position: {
      x: canvas.width / 7.07,
      y: canvas.height / 2.43,
      width: canvas.width / 10.2,
      height: canvas.height / 2.95
    },
      shown: true 
    },
    {
      position: {
        x: canvas.width / 5.2,
        y: canvas.height / 1.2,
        width: canvas.width / 7,
        height: canvas.height / 25
      },
        hidden: true,
    }
  ];
  
  canvas.width = innerWidth;
  canvas.height = innerHeight;
})

let enemies = [];

addEventListener("mousedown", e => {
  myAudio.play();
  mouseClick(e);
})

addEventListener("mouseup", e => {
  mouseHeld(e);
})

addEventListener("keydown", e => {
  if (e.key === " ") {
    shootEnemy();
  }

  if (onHelp) {
    if (e.key === "Backspace") {
      writtenAnswer = "";
      return;
    } else if (e.key === "Enter") {
      if (writtenAnswer === solvedCode) {
        letters = {"!": undefined, "@": undefined, "#": undefined, "$": undefined, "%": undefined, "^": undefined, "&": undefined, "*": undefined, "(": undefined, ")": undefined, "-": undefined, "=": undefined, "+": undefined, "]": undefined, "[": undefined}

        totalNumbers++;
        mayuriSpawn -= 1500;

        unsolvedCode = "";
        solvedCode = "";
        key = "";
        writtenAnswer = "";

        happyOkabeSoundSrc.play();
        onHelp = false;
        okabeNeedsHelp = false;
        okabeNeedsUrgentHelp = false; 
        settingHelp = false;
        clearTimeout(helpTimeout1);
        clearTimeout(helpTimeout2);
        return;
      } else if (writtenAnswer !== solvedCode) {
        enemies.push(new Enemy(spawnPoints[1].position));
        enemies[0].jumpscare = true;
        return;
      }
    }
    writtenAnswer += e.key;
  }
})

function animate() {

  if (times[currentTime] === "8:00PM") {
    alert("you win! mayuri died to steiners gaters!")
  }
  requestAnimationFrame(animate);

  drawBackground();

  drawVent();
  drawSpawnPoints();
  startEnemySpawning();
  drawEnemies();
  drawJumpscare();
  drawTime();
  drawBattery();
  manageBattery();
  manageOkabeHelp();
}

function drawBackground() {
  if (inVent) {
    c.drawImage(backgroundVentImage, 0, 0, canvas.width, canvas.height);
  } else {
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }
}

function drawSpawnPoints() {
  c.fillStyle = "black";

  spawnPoints.forEach(spawn => {
    if (spawn.shown && !spawn.hidden) {
      c.fillRect(spawn.position.x, spawn.position.y, spawn.position.width, spawn.position.height)
    } 
    
    if (!spawnPoints[0].shown) {
      battery -= 0.02;
    }
  })

  c.drawImage(background2Image, 0, 0, canvas.width, canvas.height);

}

function mouseClick(e) {
  if (!inVent && !onJumpscareAnimation && battery > 0 && !onHelp) {
    spawnPoints.forEach(spawn => {
      if (e.x <= spawn.position.x + spawn.position.width &&
        e.x >= spawn.position.x &&
        e.y <= spawn.position.y + spawn.position.height &&
        e.y >= spawn.position.y) {
  
          if (spawnPoints.indexOf(spawn) === 1) {
            inVent = true;
          }
  
        spawn.shown = false;
  
  
        for (enemy of enemies) {
          if (enemy.position === spawn.position && !enemy.vent) {
            enemy.shown = true;
          }
        }     
      }
    })
  } else {
    inVent = false;
  }

  if (!onJumpscareAnimation) {
    if (!onHelp && okabeNeedsHelp) {
      if (e.x <= canvas.width / 1.15 + canvas.height / 1.33 &&
      e.x >= canvas.width / 1.15 &&
      e.y <= canvas.height / 1.33 + canvas.height / 4 &&
      e.y >= canvas.height / 1.33) {
  
        onHelp = true;
      }
    } else if (onHelp && !(e.x <= canvas.width / 2 - canvas.width / (1.5 * 2) + canvas.width / 1.5 &&
    e.x >= canvas.width / 2 - canvas.width / (1.5 * 2) &&
    e.y <= canvas.height / 2 - canvas.height / (1.5 * 2) + canvas.height / 1.5 &&
    e.y >= canvas.height / 2 - canvas.height / (1.5 * 2))) {
    onHelp = false;
  }
  }
}

function mouseHeld(e) {
  spawnPoints.forEach(spawn => {
    if (spawn.hidden) {
      spawn.shown = false;
    } else {
      spawn.shown = true;
    }
  })

  enemies.forEach(enemy => {
    enemy.shown = false;
  })
}

function startEnemySpawning() {
  while (!spawning) {
    enemySpawnTime = (Math.random() * 10000) + mayuriSpawn

    setTimeout(() => {
      randomEnemySpawnNumber = Math.round(Math.random() * (spawnPoints.length - 1));

      if (spawnPoints[randomEnemySpawnNumber].hidden) {
        enemies.push(new Enemy(spawnPoints[randomEnemySpawnNumber].position, true));
        spawnPoints[randomEnemySpawnNumber].shown = true;
      } else {
        enemies.push(new Enemy(spawnPoints[randomEnemySpawnNumber].position));
        spawnPoints[randomEnemySpawnNumber].shown = true;
      }

      enemies.forEach(enemy => {
        enemy.shown = false;
      })
      
      spawning = false;
    }, enemySpawnTime);

    spawning = true;
  }
}

function drawEnemies() {
  enemies.forEach(enemy => {
    if (enemy.shown || (inVent && enemy.vent)) {
      c.drawImage(shootButtonImage, 0, 0, canvas.width / 8, canvas.width / 8);
      enemy.draw();
    }
  })
}

function drawJumpscare() {
  
  c.drawImage(mayuriJumpscareImage, jumpscare.position.x, jumpscare.position.y, jumpscare.size.x, jumpscare.size.y);

  for (let enemy of enemies) {
    if (enemy.jumpscare) {
      inVent = false;
      onHelp = false;
      if (jumpscare.size.x == 0) {
        onJumpscareAnimation = true;
        tuturuDeathSoundSrc.play();
        jumpscare.size.x = canvas.width / 50;
        jumpscare.size.y = canvas.height / 50; 
      }
    
      if (jumpscare.size.x <= canvas.width) {
        jumpscare.size.x *= 1.3;
        jumpscare.size.y *= 1.3;
        jumpscare.position.x = canvas.width / 2 - jumpscare.size.x / 2;
        jumpscare.position.y = canvas.height / 2 - jumpscare.size.y / 2;
      }
    }
  }
}

function shootEnemy() {
  if (battery > 0) {
    battery -= 0.1;
  }
  
  for (enemy of enemies) {
    if (enemy.shown || (inVent && enemy.vent) && !onJumpscareAnimation) {
      okabeSaysMayuriSoundSrc.play();
      enemies.splice(enemies.indexOf(enemy), 1);
    }
  }
}

function drawVent() {
  if (inVent) {
    battery -= 0.02;

    for (let enemy of enemies) {
      if (enemy.position === spawnPoints[1].position) {
        c.drawImage(ventOccupiedImage, canvas.width / 4, 
        canvas.height / 4, canvas.width / 2, canvas.height / 2);
        return
      };
    }

    c.drawImage(ventEmptyImage, canvas.width / 4, 
    canvas.height / 4, canvas.width / 2, canvas.height / 2);
  }
}

function drawTime() {
  c.fillStyle = "white";
  c.font = `bold ${canvas.width / 64}px Franklin Gothic Medium`;
  c.fillText(times[currentTime], canvas.width / 1.08, canvas.height / 20);
}

function startTime() {
  setInterval(() => {
    if (currentTime < times.length - 1) {
      currentTime++;
    }
  }, 60000)
}

function drawBattery() {
  c.fillRect(canvas.width - canvas.width / 5, canvas.height / 15, canvas.width / 5.5, canvas.height / 22);
  c.fillStyle = "yellow";
  c.fillText(battery, 50, 100);
  c.fillRect(canvas.width - canvas.width / 5, canvas.height / 15, battery * 13.9, canvas.height / 22);
}

function manageBattery() {
  spawnPoints.forEach(spawn => {
    if (!spawn.shown || inVent) {
      return;
    }
  })
}

function manageOkabeHelp() {

  if (!settingHelp) {
    let timeUntilNextTask = (Math.random() * 45000) + 45000
    setTimeout(() => {
      createCode();
      happyOkabeSoundSrc.play();
      okabeNeedsHelp = true;

      helpTimeout1 = setTimeout(() => {
        okabeNeedsUrgentHelp = true;
        helpTimeout2 = setTimeout(() => {
          enemies.push(new Enemy(spawnPoints[1].position));
          enemies[0].jumpscare = true;
        }, 10000)
      }, 30000)
    }, timeUntilNextTask)

    settingHelp = true;
  }

  c.drawImage(okabeHelpImage, canvas.width / 1.15, canvas.height / 1.33, canvas.width / 8, canvas.height / 4)

  if (okabeNeedsUrgentHelp) {
    c.drawImage(okabeHelpUrgentImage, canvas.width / 1.15, canvas.height / 1.33, canvas.width / 8, canvas.height / 4)
  }

  if (onHelp) {


  c.drawImage(tabletImage, canvas.width / 2 - canvas.width / (1.5 * 2), canvas.height / 2 - canvas.height / (1.5 * 2), canvas.width / 1.5, canvas.height / 1.5);

  c.fillStyle = "black";
  c.font = `bold ${canvas.width / 64}px Franklin Gothic Medium`;
  c.fillText("DECIPHER", canvas.width / 1.25 - canvas.width / (1.5 * 2), canvas.height / 1.7 - canvas.height / (1.5 * 2));
  c.font = `bold ${canvas.width / 32}px Franklin Gothic Medium`;
  c.fillText(`${unsolvedCode}`, canvas.width / 1.9 - canvas.width / (1.5 * 2), canvas.height / 1.4 - canvas.height / (1.5 * 2));
  c.fillText(`${writtenAnswer}`, canvas.width / 1.9 - canvas.width / (1.5 * 2), canvas.height / 1.2 - canvas.height / (1.5 * 2));
  c.font = `bold ${canvas.width / 128}px Franklin Gothic Medium`;
  c.fillStyle = "blue";
  c.fillText(`${key}`, canvas.width / 1.9 - canvas.width / (1.5 * 2), canvas.height / 1 - canvas.height / (2.3 * 2));
  }
}

function createCode() {

  Object.keys(letters).forEach(letter => {
    letters[letter] = Math.ceil(Math.random() * 9);
  })

  for (let i = 0; i < totalNumbers; i++) {
    let keys = Object.keys(letters);

    unsolvedCode += keys[Math.floor(Math.random() * keys.length)];
  }

  for (let i = 0; i < totalNumbers; i++) {
    solvedCode += letters[unsolvedCode[i]];
  }

    Object.keys(letters).forEach(letter => {
      key += `"${letter}" : ${letters[letter]}
      `;
    })

}

/*
let letters = {"!": undefined, "@": undefined, "#": undefined, "$": undefined, "%": undefined, "^": undefined, "&": undefined, "*": undefined, "(": undefined, ")": undefined, "-": undefined, "=": undefined, "+": undefined, "]": undefined, "[": undefined}
Object.keys(letters).forEach(letter => {
  letters[letter] = Math.ceil(Math.random() * 10);

})*/