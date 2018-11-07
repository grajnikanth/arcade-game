/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        // added victory boolean variable to track if the player won the game or not
        victory = false,
        // I added "id" variable to capture the "id" of the Animation Frame.
        // I will use this id to stop the
        // game when the player wins the game.
        id;


    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call the main()
         * function again as soon as the browser is able to draw another frame. This
         * makes the game go in a loop until the cancelAnimationFrame() function is called
         * with the id of the original Animation Frame.
         */

        // Updated the browser call to requestAnimationFrame so that we can handle
        // the case where the player win's the game.

        // if player reaches water victory = true and we will call the cancelAnimationFrame
        // function with the Frame "id" as argument to stop the game and display a modal.
        if(victory) {
           win.cancelAnimationFrame(id);
           modalToggle();
         }
         else {
            id = win.requestAnimationFrame(main); // id will be used to cancel the animation Frame
                                                  // when player wins the game.
         }
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        // call player.update and also obtain the status of the player to check
        // if player reached the water that is if the player won the game.
        // if yes, victory variable will be = true.
        // In the main() function this information will be used to stop the
        // game if player win's by reaching the water at the top.
        victory = player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height)

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;

    // Make the Engine IIFE return an object with a property which will hold the the
    // init() function which can be called to replay the game later from
    // outside the IIFE Engine function.
    return {
      initializeEngine: init
    };

})(this);

//modal functionality to control the display once the user wins the game.

// modalToggle function will change the class of the modal background div
// in the html file by toggling the class = hide. Then the css styling
// will either display the modal or will hide the modal on the screen
function modalToggle() {
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
}

// On the modal we have two buttons one for cancel and one for replay

// when user clicks cancel nothing happens the the modal will be removed
// from the screen and game board as is shown to the user.
document.querySelector('.modal_cancel').addEventListener('click', function(event) {
  modalToggle();
});

// If the replay button is clicked on the modal, then we will first hide the
// modal and then reset the whole game.

document.querySelector('.modal_replay').addEventListener('click', function(event) {
  modalToggle();
  resetGame();
});

// resetGame function will set the player coordinates back to the starting x and y

// It will loop through all the enemy objects and set all enemies x = -101px and
// set enemy.y = random and also set snemy.speed to random

// Then we will call the Engine function initializeEngine() which will call the
// Engine.init() function which will restart the game loop by calling on
// the main() function and main function starts a loop using the requestAnimationFrame
// function and the whole game starts again.

function resetGame() {
  player.reset();
  player.victory = false; // This will reset the victory boolean variable to false since the player
                          // is back at the starting point on the game board.
  for(let enemy of allEnemies) {
    enemy.x = -101;
    enemy.randomY();
    enemy.randomSpeed();
  }
  Engine.initializeEngine();
}
