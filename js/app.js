// I will use the ES6 class syntax to define the Enemy class
// The Enemy constructor will be used to initialize the x and y of each enemy
// created. The x,y of enemy and the speed at which each enemy moves will
// be randomized. The y coordinate is set such that the enemy will be centered
// on the game block.
// render() function will draw enemy at the x,y location

// update(dt) function will be used to create the logic to move each enemy
// across the screen at certain speed proportional to dt.

class Enemy {
  constructor() {
    this.x = -101; // this x value will make the enemy enter the game board more smoothly.
    this.yMax = 341; // max and min used to obtain a random number in between these two numbers.
    this.yMin = 65;
    this.randomY(); // obtain randomY location
    this.xStep = 101; // Each game board pixel is 101 px wide. This was used to check if the enemy
                      // moved out of the game board in update() function
    this.speedMax = 500;// the spped variables were used to obtain a random speed for each enemy
                        // between the max and min speed.
    this.speedMin = 300;
    this.speed = 100;
    this.randomSpeed(); // obtain random speed for enemy.
    this.sprite = 'images/enemy-bug.png';
  }

//randomY() function sets a random Y coordinate for each enemy.
  randomY() {
    this.y = Math.floor(Math.random() * (this.yMax - this.yMin + 1)) + this.yMin;
    if(this.y >= 65 && this.y <= 148) {
      this. y = 65;
    }
    else if(this.y <= 231) {
      this.y = 148;
    }
    else if(this.y <=341) {
      this.y = 231;
    }
  }

//randomspeed() sets a random speed for each enemy.
  randomSpeed() {
    this.speed = Math.floor(Math.random() * (this.speedMax - this.speedMin + 1)) + this.speedMin;
  }
// draws the enemy at the x,y location.
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
// update() function moves the enemy to the next x coordinate based on its current location.

// The if and else logic in update() function will walk the enemies out of the screen and walk them
// back on the screen similar to how it walked off the screen. This is done by
// letting enemies walk completely off the screen and bring them back at x = -101 px
  update(dt) {
    if(this.x < this.xStep*5) {
      this.x += this.speed*dt;
    }
    else {
      this.x = -101; // this else statement will bring the enemies back to x = -101px position
                  // once they reach x = 505px.
      // randomize Y and speed of the enemy when starting back at origin on the left of the game board.
      this.randomY();
      this.randomSpeed();
    }
  }
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
  // First create a constructor function to initialize a Player object.
  // We defined x,y, and sprite as the properties for a Player object.
  // sprite will hold a string to the .png file which is the image of
  // the Player we are going to use.

  // set begining x = 202px and y = 397px which will place the player in
  // the 6th row and 3rd column.
  // These x and y coordinates were selected to coordinate with the Enemy
  // x and y coordinates. The above selected coordinates place the enemies
  // and players centered in the game blocks.

  // the startx and starty were initialized to use as a reset/initial values
  // for player. These will be used in the reset() function later to reset the
  // player location when collisions with enemies occur or when the game is replayed.
  constructor() {
    this.startx = 2*101;
    this.starty = 65+4*83;
    this.x = this.startx;
    this.y = this.starty;
    this.winY = -18; // if palyer reaches this Y coordinate than the player has reached
                    // reached the water portion of the game blocks and hence won the game.
                    // we use this in the checkVictory() function.
    this.victory = false; // This keeps track whether player won the game or not.
//    this.id;
    this.sprite = 'images/char-boy.png';
  }

  // Create the render() function which will draw the Player object
  // at the current x,y coordinate
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

// Create the handleInput method to deal with the keyboard input
// provided by the player.
// argument to this function will be a string which corresponds to the
// arrow keys -> left/right/up/down movement input by the player.
// The function addEventListener() defined at the bottom of app.js
//listens to the keyboard input and calls the handleInput function with
// the user input.

// Using the input we will udpate the x or y coordinate of the player.
// we will move 101 pixels in x direction and 83 pixels in the y direction
// for each valid key press.
// The step = 101 px and 83 px is based on the engine.js file where each
// game block was defined such that each block of game background image
// is 101 px wide x 83 px high

//In this function we will also check if the player is at the boundary and
// use if statements to keep him within the game board. This is done by checking
// for example if x > 0, then upon pressing left he can move left by 101px but
// if x = 0 then we do not do anything so he cannot move any more.
// Note that for each key press we are moving by a row or column block. that
// is 101 px x dir and 83 pix Y dir and hence the above if logic will work.
  handleInput(keyPressed) {
    switch(keyPressed) {
      case 'left':
        if(this.x > 0) {
            this.x -=101;
        }
        break;
      case 'up':
        if(this.y > 0) {
          this.y -=83;
        }
        break;
      case 'right':
        if(this.x < 404) {
          this.x +=101;
        }
        break;
      case 'down':
        if(this.y <= 314) {
          this.y +=83;
        }
        break;
    }
  }

  // player.update() function will be used to check if player collided with
  // any of the three enemies or if player won the game by reaching the water
  // portion of the game board which is at the top.
  update() {
    this.checkCollision(); // call this function to check player and enemy checkCollisions
    return this.checkVictory(); // call this function to see if player won the game
  }

  // checkCollision function checks if the player and any of the enemies
  // overlap and if they do call the reset() function.
  // The collision zone was determined by playing the game couple of times
  checkCollision() {
    for(let enemy of allEnemies) {
      if(this.y === enemy.y) {
        if((this.x + 70) > enemy.x && this.x < (enemy.x + 80)) {
          this.reset();
        }
      }
    }
  }

  // reset() will be called when player collides with the enemy. So we will
  // reset the player coordinates back to original startx and starty in this
  // function which will put the player back in row 6 and column 3.
  reset() {
    this.x = this.startx;
    this.y = this.starty;
  }

  checkVictory() {
    if(this.y === this.winY) {
      this.victory = true;
      return this.victory;
    }
    else {
      return this.victory;
    }
  }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const player = new Player();
const allEnemies = [];
const noOfEnemies = 3;
for(let i = 0; i < noOfEnemies; i++) {
  allEnemies.push(new Enemy());
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.

// The argument sent to the handleInput() function is the allowedKeys[e.keyCode].
// the e.keyCode probably contains the integer representing the key press. We convert
// this number to a string which represents the type of key pressed. If a key other
// the four defined below are pressed the allowedKeys[] array will not return anything
// as it does not contain the corresponding key and value pair.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
