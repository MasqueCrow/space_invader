var aliens;
var ship_lasers;
var alien_lasers; 
var points;
var start_game;
var one_player_btn;
var two_player_btn;
var num_player;
var game_mode;
var ships;
var players;
var is_game_over;
var objects_position;
var bricks;
var num_laser;
var laser_sound;
var bgm;
var player_label;
var one_player_btn;
var two_player_btn;
var mode_label;
var mode;

function preload() {
  alien1a = loadImage('./images/alien1a.png');
  alien1b = loadImage('./images/alien1b.png');
  alien2a = loadImage('./images/alien2a.png');
  alien2b = loadImage('./images/alien2b.png');
  laser_sound = loadSound('./sound/laser.mp3');
  bgm = loadSound('./sound/viva_la_vida.mp3');

}

function setup() {
  // Set canvas position
  canvas_width = 1000;
  canvas_height = 650;
  const x = (windowWidth - canvas_width) / 2;
  const y = (windowHeight - canvas_height) / 2;
  canvas = createCanvas(canvas_width, canvas_height);
  canvas.parent('canvas-container');
  canvas.position(0,50);
  frameRate(10);
  imageMode(CENTER);
  
  //Initialise game variables
  aliens = [];
  ship_lasers = [];
  alien_lasers = []; 
  ships = [];
  points = 0;
  num_player = 1;
  players = 1;
  game_mode = "normal";
  start_game = false;
  is_game_over = false;
  objects_position = [];
  num_bricks = 2;
  num_laser = 3;
  bricks = [];
  
  // Select one or two players
  player_label = createDiv('Select Player:');
  player_label.parent("canvas-container");
  player_label.style("width:100px; height:25px; color:white;font-weight:bold;");
  player_label.position(30, 650,'relative');

  one_player_btn = createImg('./images/player.png');
  one_player_btn.parent("canvas-container");
  one_player_btn.size('60','60');
  one_player_btn.position(120, 595,'relative');
  one_player_btn.style('opacity', '1');
  one_player_btn.mousePressed(selectOnePlayer);

  two_player_btn = createImg('./images/two-player.png');
  two_player_btn.size('60','60');
  two_player_btn.style('opacity', '0.5');
  two_player_btn.parent("canvas-container");
  two_player_btn.position(130, 600,'relative');
  two_player_btn.mousePressed(selectTwoPlayers);

  // Radio button label
  mode_label = createDiv('Select Mode:');
  mode_label.parent("canvas-container");
  mode_label.style("width:100px; height:30px; color:white;font-weight:bold;");
  mode_label.position(700, 565,'relative');

  // Radio buttons for game mode
  mode = createRadio();
  mode.position(800, 535,'relative');
  mode.size(150);
  mode.parent("canvas-container");
  mode.style("color", "white");
  mode.option('normal');
  mode.option('hard');
  mode.selected('normal');

} //setup()

function playMusic() {
    if (!bgm.isPlaying())
      bgm.play();
  else
      bgm.stop();
}

// Create alien sprites based on the specified number and arrangement
function createAliens(no_of_aliens, aliens_per_row) {
  let startX;
  let startY = 40;
  let rows = no_of_aliens / aliens_per_row;

  for (var i = 0; i < rows; i++) {
    startX = 80; // Reset the X position for each row
    
    for (var j = 0; j < aliens_per_row; j++) {
      let idx = i * aliens_per_row + j; // Calculate the index for the current alien

      // Create alternating alien types based on column index
      if ( j % 2 == 0) 
        aliens[idx] = new Alien(startX , startY, alien1a, alien1b, 5);
      else
        aliens[idx] = new Alien(startX, startY, alien2a, alien2b, 10);
     
      startX += 80; // Move to the next X position
    }

    startY += 40; // Move to the next Y position for the next row
  }

} // createAliens(no_of_aliens, aliens_per_row)

// Create bricks at random positions
function createBricks(num_bricks) {
    for (var i = 0; i < num_bricks; i++) {
      var rand_x = getRandomInt(0, 950);
      bricks.push(new Brick(rand_x, 500 + i *30));
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Select one-player mode
function selectOnePlayer() {
  num_player = 1; // Set the number of players to 1
  one_player_btn.style('opacity', '1'); // Highlight the one-player button
  two_player_btn.style('opacity', '0.5'); // Dim the two-player button
  players = 1; // Update the players variable
}

// Select two-player mode
function selectTwoPlayers() {
  num_player = 2; // Set the number of players to 2
  two_player_btn.style('opacity', '1'); // Highlight the two-player button
  one_player_btn.style('opacity', '0.5'); // Dim the one-player button
  players = 2; // Update the players variable
}

// Select normal game mode
function selectNormalMode() {
  mode.selected('normal');
}

// Select hard game mode
function selectHardMode() {
  mode.selected('hard');
} 

function windowResized() {
  resizeCanvas(canvas_width, canvas_height);
}

// Move and update behavior of bricks
function activateBricks() {
  if (bricks) {
    bricks.forEach((brick) => {
      brick.show(); 
      brick.move(); 

      // Bounce off the canvas edges
      if (brick.getX() >= canvas_width) {
        brick.setDirection(-1); // move to left direction
      } else if (brick.getX() < 0) {
        brick.setDirection(1); // move to right direction
      }
    });
  }
} // activateBricks()

function alienShootLaser(num_laser) {
  // Randomly select an alien
  const randomIndex = floor(random(aliens.length));
  const randomAlien = aliens[randomIndex];
  
  // Only allow alien to shoot lasers up to the specified limit
  if (alien_lasers.length <= num_laser - 1) 
    randomAlien.shoot();
  
  // Update and check each alien laser
  for (var i = alien_lasers.length - 1; i >= 0; i--) {
    alien_lasers[i].show();
    alien_lasers[i].moveDown();

    // Check for collisions with player ships
    for (let j = 0; j < ships.length; j++) {
      if (alien_lasers[i].hit(ships[j])) {
        ships[j].decreaseLife();
        alien_lasers[i].remove();
      }
    }

    // Remove lasers that go off the screen
    if (alien_lasers[i].y >= height) {
      alien_lasers[i].remove();
    }
  }

  // Clean up lasers marked for deletion
  for (var z = alien_lasers.length - 1; z >= 0; z--) {
    if (alien_lasers[z].shouldDelete === true) {
      alien_lasers.splice(z, 1); // Remove laser from array
    }
  }
} // alienShootLaser(num_laser)

// Set life for all player ships
function setShipLife(life) {
  for (let i = 0; i < ships.length; i++) { 
    ships[i].life = life;
  }
} // alienShootLaser(life)


function shipShootLaser() {
    for (let i = 0; i < ship_lasers.length; i++) {
        ship_lasers[i].show();
        if (ship_lasers[i].isMovingUp) {
            ship_lasers[i].moveUp();
        } else {
            ship_lasers[i].moveDown(); // Reverse laser direction
            ships.forEach((ship) => {
                if (ship_lasers[i].hit(ship)) {
                    ship_lasers[i].remove();  // Flag laser to remove
                    ship.life -= 1;
                }
            });
        }

        // Handle collisions with aliens
        aliens.forEach((alien, j) => {
            if (ship_lasers[i].hit(alien)) {
                points += alien.pts; // Increase player score
                aliens.splice(j, 1); // Remove alien from the array
                ship_lasers[i].remove(); // Flag laser to remove
            } else if (ship_lasers[i].y <= 0) {
                ship_lasers[i].remove(); // Flag laser to remove if out of canvas
            }
        });

        // Handle collisions with bricks
        if (bricks) {
          bricks.forEach((brick) => {
              if (ship_lasers[i].hit(brick)) {
                  console.log(ship_lasers[i].isMovingUp);
                  ship_lasers[i].isMovingUp = false; // flag to prevent laser from moving up
              } 
          });
        }
    }

    // Clean up lasers marked for deletion
    for (let z = ship_lasers.length - 1; z >= 0; z--) {
        if (ship_lasers[z].shouldDelete === true) {
            ship_lasers.splice(z, 1); // Remove laser from the array
        }
    }
}

// Move and update behavior of aliens
function moveAliens() {
  
  var edge = false; // Flag to detect when aliens reach the edge

  for (var i = 0; i < aliens.length; i++) {
    aliens[i].show();
    aliens[i].move();

    // Detect when alien reach edge
    if (aliens[i].x >= canvas_width || aliens[i].x <= 0) {
      edge = true;
    }

    // Remove bricks when aliens' positions are near them
    if (bricks) {
      bricks.forEach((brick, index) => {
        if (brick.y - aliens[i].y <= 10) {
          bricks.splice(index, 1); // Remove brick
        }
      });
    }


     // End the game when aliens reach the bottom
    if (aliens[i].y >= canvas.height) 
      displayGameOver();
    
  }

  // Shift aliens down when they reach either left or right edge
  if (edge) {
    for (var k = 0; k < aliens.length; k++) {
        aliens[k].shiftDown();
      }
  }
}

// Main game loop
function draw() {
  canvas.background(0); // Set background to black
  game_mode = mode.value(); // Update the game mode based on user selection


  if (!start_game)
    startScreen(); // Display the start screen if the game hasn't started
  
  else {
    
    if (players === 1) {
      ships[0].show();
      ships[0].move();
      moveAliens();
      activateBricks(); // Activate the bricks' behavior
      updateStats(); // Update the game statistics (score, lives, etc.)
      alienShootLaser(num_laser); // Allow aliens to shoot lasers
      shipShootLaser(); // Handle the player's laser shooting
      removeShip(); // Remove the ship if it's hit

      // Check for game over conditions
      if (aliens.length <= 0 || ships.length == 0) 
        displayGameOver();
    }
    else {
      
      // Two players mode
      for (var i = 0; i < ships.length; i++) {
        ships[i].show();
        ships[i].move();
      }

      // The rest of the game logic is the same for both modes
      moveAliens();
      activateBricks();
      updateStats();
      alienShootLaser(num_laser); 
      shipShootLaser(); 
      removeShip();

      if (aliens.length <= 0 || ships.length == 0 ) {
        displayGameOver();
      }   
    }
    
  } //end if 
} // draw()


//keys event handler

//stop moving ship
function keyReleased() {
  // Check if ship object has been created
  if (ships) {
    
    for(var i = 0; i < ships.length; i++) {
      ships[i].setDirection(0);
    }
  }

} // keyReleased()


function keyPressed() {
  // Player selection keys (1 for one player, 2 for two players)
  if (keyCode === 49) { // 1
    selectOnePlayer(); // Set game mode to one player
  } else if (keyCode === 50) { // 2
    selectTwoPlayers(); // Set game mode to two players
  }

  // Game mode keys (N for normal, H for hard)
  if (keyCode === 78) { // N
    selectNormalMode(); // Set game mode to normal
  } else if (keyCode === 72) { // H
    selectHardMode(); // Set game mode to hard
  }

  // Enter key (start the game)
  if (keyCode === 13) {
    start_game = true; // Flag to start the game
    player_label.remove();
    one_player_btn.remove();
    two_player_btn.remove();
    mode_label.remove();
    mode.hide();
    playMusic(); // Play background music

    // Create ships based on game mode selection
    if (players === 1) {
      ships.push(new Ship()); // Create one player's ship
    } else {
      ships.push(new Ship()); // Create first player's ship
      ships.push(new Ship('blue', width / 2)); // Create second player's ship (corrected x position)
    }

    // Set up game parameters for hard mode
    if (mode.value() === 'hard') {
      createAliens(50, 10); // Create more aliens
      createBricks(4); // Create more bricks
      num_laser = 5; // Increase available lasers
      setShipLife(2); // Set initial ship life

      // Increase aliens' speed
      for (var i = 0; i < aliens.length; i++) {
        aliens[i].setPace(5);
      }
    } else {
      createAliens(30, 10); // Create aliens for normal mode
      createBricks(2); // Create bricks for normal mode
    }
  }

  // Player controls
  if (players === 1 && start_game) {
    if (keyCode === 65) // A
      ships[0].setDirection(-1); // Move left
    if (keyCode === 68) // D
      ships[0].setDirection(1); // Move right
    if (keyCode === 83) { // S
      var laser = new Laser(ships[0].x + ships[0].width / 2, ships[0].y, 'orange');
      ship_lasers.push(laser); // Shoot a laser
      laser_sound.play();
      laser_sound.setVolume(0.2);
    }
  } 
  else if (players === 2 && start_game) {
    if (keyCode === 65) // A (player 1)
      ships[0].setDirection(-1);
    if (keyCode === 68) // D (player 1)
      ships[0].setDirection(1);
    if (keyCode === 83) { // S (player 1)
      var laser = new Laser(ships[0].x + ships[0].width / 2, ships[0].y, 'orange');
      ship_lasers.push(laser);
      laser_sound.play();
      laser_sound.setVolume(0.2);
    }

    if (keyCode === 76) // L (player 2)
      ships[1].setDirection(-1);
    if (keyCode === 222)  // ' (player 2)
      ships[1].setDirection(1);
    if (keyCode === 186) { // ; (player 2)
      var laser = new Laser(ships[1].x + ships[1].width / 2, ships[1].y, 'purple');
      ship_lasers.push(laser);
      laser_sound.play();
      laser_sound.setVolume(0.2);
    }
  }

  // Return to start screen after game over
  if (is_game_over && keyCode === SHIFT) {
    setup();
    loop();
  }
} // keyPressed()


function startScreen() {
  fill(255);
  textSize(30);
  textAlign(CENTER);
  text("Press [", canvas_width * 0.33, canvas_height * 0.5);

  if (frameCount % 15 < 10)
    text("ENTER", canvas_width * 0.45, canvas_height * 0.5 + 3);
  text("] TO START", canvas_width * 0.60, canvas_height * 0.5);
} // startScreen()

// Display game statistics (remaining aliens, score, and ship lives)
function updateStats() {
  fill(255); // Set text color to white
  textSize(10); // Set text size
  textAlign(LEFT); // Align text to the left

  // Display remaining aliens count and player score
  text("Alien Remaining: " + aliens.length, 10, 20);
  text("Score: " + points, 110, 20);

  const heartEmoji = "❤️"; // Heart emoji for ship lives
  for (var i = 0; i < ships.length; i++) {
    var xPosition = 10 + i * 80; // Adjust the spacing between texts
    var hearts = heartEmoji.repeat(ships[i].getRemainingLives()); // Create heart symbols based on remaining lives
    text("Ship " + (i + 1) + ": " + hearts, xPosition, 40); // Display ship lives
  }
} // updateStats()


function destroyObjects() {
  ships = null;
  alien_lasers = []
  ship_lasers = []
  aliens = [] 
} // destroyObjects()

function removeShip() {
  //remove ship in array when its life reaches 0
  for (var i = ships.length - 1; i >= 0; i--) {
    if (ships[i].getRemainingLives() === 0) {
      ships.splice(i, 1); 
    }
  }
} // removeShip()

function displayGameOver() {
  fill(255); // Set text color to white
  background(0); // Set background color to black
  textSize(72); // Set large text size
  textAlign(CENTER); // Center-align text

  // Display "GAME OVER" in the middle of the canvas
  text("GAME OVER", canvas_width / 2, canvas_height / 2);

  textSize(12); // Set smaller text size
  // Display instructions for returning to the start screen
  text("Press [SHIFT] to return to the start screen", canvas_width / 2, canvas_height / 1.8);

  // Display mode-specific completion message
  if (mode.value() == "normal" && aliens.length == 0) {
    text("Normal Mode Completed!!", canvas_width / 2 - 7, canvas_height / 1.7);
  } else if (mode.value() == "hard" && aliens.length == 0) {
    text("Hard Mode Completed!!", canvas_width / 2 - 14, canvas_height / 1.7);
  }

  destroyObjects(); // Clean up game objects
  noLoop(); // Stop the game loop
  start_game = false; // Reset game state
  is_game_over = true; // Set game over flag
  bgm.stop(); // Stop background music
} // displayGameOver()
