const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let isDead = false;

let enemySpawnTime;
let spawning = false;
let inVent = false;
let battery = 100;

let spawnTimer;

let mayuriSpawnTimeDecrementTotal = 0;

let currentTime = 0;
let setMenuButton = false;

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


let enemies = [];

function init() {
  enemySpawnTime;
  spawning = false;
  inVent = false;
  battery = 100;
  isDead = false;
  setMenuButton = false;
  clearTimeout(spawnTimer);
  clearTimeout(helpTimeouts[0]);
  clearTimeout(helpTimeouts[1]);
  difficultyLevel = 0;
  

  mayuriSpawnTimeDecrementTotal = 0;

  currentTime = 0;

  onJumpscareAnimation = false;
  jumpscare = {
    size: {
      x: 0,
      y: 0
    },
    position: {
      x: canvas.width / 2,
      y: canvas.height / 2
    }
  };

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

  enemies = [];
  animate();
  startTime();
  setUpHelp();
  myAudio.currentTime = 0;

  urgentHelp = false;
  onHelp = false;

  help = undefined;
  helpTimeouts = [];
}

addEventListener("load", () => {
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

addEventListener("mousedown", e => {
  myAudio.play();
  mouseClick(e);
})

addEventListener("mouseup", e => {
  mouseHeld(e);
})

addEventListener("keydown", e => {
  helpActions(e.key);

  if (e.key === " ") {
    shootEnemy();
  }
})

function animate() {

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
  manageHelp();
  drawEndScreen();
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
      battery -= BATTERY_DRAIN_ON_HOVER;
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
    if (!onHelp) {
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

  if (isDead) {
    if (e.x <= canvas.width / 2 - canvas.width / 10 + canvas.width / 5 &&
    e.x >= canvas.width / 2 - canvas.width / 10 &&
    e.y <= canvas.height / 2 - canvas.height / 10 + canvas.height / 5 &&
    e.y >= canvas.height / 2 - canvas.height / 10) {
      init();    
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
    enemySpawnTime = (Math.random() * (START_ENEMY_SPAWN_MAX - START_ENEMY_SPAWN_MIN)) + START_ENEMY_SPAWN_MIN - mayuriSpawnTimeDecrementTotal;

    spawnTimer = setTimeout(() => {
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
      } else {
        if (!setMenuButton) {

          setTimeout(() => {
            isDead = true;
          }, 2000)

          setMenuButton = true;
        }
      }
    }
  }
}

function shootEnemy() {
  if (battery > 0) {
    battery -= BATTERY_DRAIN_ON_SHOOT;
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
    battery -= BATTERY_DRAIN_ON_HOVER;

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
  c.fillText(POSSIBLE_TIMES[currentTime], canvas.width / 1.08, canvas.height / 20);
}

function startTime() {
  setInterval(() => {
    if (currentTime < POSSIBLE_TIMES.length - 1) {
      currentTime++;
    }
  }, 60000)
}

function drawBattery() {
  c.fillRect(canvas.width - canvas.width / 5, canvas.height / 15, canvas.width / 5.5, canvas.height / 22);
  c.fillStyle = "yellow";
  c.fillRect(canvas.width - canvas.width / 5, canvas.height / 15, battery * 3.87, canvas.height / 22);
}

function manageBattery() {
  spawnPoints.forEach(spawn => {
    if (!spawn.shown || inVent) {
      return;
    }
  })
}

function spawnJumpscare() {
  enemies.push(new Enemy());
  enemies[0].jumpscare = true;
}

init();

function drawEndScreen() {
  if (isDead) {
    c.fillStyle = "black";
    c.fillRect(canvas.width / 2 - canvas.width / 10, canvas.height / 2 - canvas.height / 10, canvas.width / 5, canvas.height / 5);
    c.fillStyle = "red";
    c.fillText("Play Again?", canvas.width / 2.18, canvas.height / 1.98);
  }
}