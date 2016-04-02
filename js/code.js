/*
By: Osama Aamer

JAVASCRIPT CODE FILE
*/


var playerSelect = 1;								//initially player one is selected
var boardStatusLineColor = "#fff";					//colour of board lines
var boardStatusStatus; 								//array holding positions
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var numMoves = 0;									//0 moves played initially
var canvasSize = 480;								//canvas size used for section calculation
var sectionSize = canvasSize / 3;					//width of one if the nine sections

context.translate(0.5, 0.5);						//remap the 0,0 initial position on canvas
context.ImageSmoothingEnabled = true;
context.mozImageSmoothingEnabled = true;

displayText("Press the play button to start.");

//function that resets our playing board
function initboardStatus() {
	boardStatus = getInitialboardStatus("");

		numMoves = 0;
		for (var x = 0;x < 3;x++) {
			for (var y = 0;y < 3;y++) {
				xCordinate = x * sectionSize;
				yCordinate = y * sectionSize;
				//loop over whole board and erase existing x's and o's
				clearPlayingArea(xCordinate, yCordinate);
			}
		}
		//draw board lines
		drawLines(10, boardStatusLineColor);
		return;
}

//initialises the array that holds the playerSelect moves
function getInitialboardStatus (initialiser) {
	var boardStatus = [];
	for (var x = 0;x < 3;x++) {
		boardStatus.push([]);
		for (var y = 0;y < 3;y++) {
			  boardStatus[x].push(initialiser);
		}
	}
	return boardStatus;
}

//clears a portion of the game board according to the section we pass
function clearPlayingArea (xCordinate, yCordinate) {
	context.fillStyle = "#2A2C2B";
	context.fillRect(xCordinate, yCordinate, sectionSize, sectionSize );
}

//draws an "O" on the section coordinates
function drawO (xCordinate, yCordinate, color) {
	var alpha = 0.0;   // full opacity
	var halfSectionSize = (0.5 * sectionSize);
	var centerX = xCordinate + halfSectionSize;
	var centerY = yCordinate + halfSectionSize;
	var radius = (sectionSize - 100) / 2;
	var startAngle = 0 * Math.PI;
	var endAngle = 2 * Math.PI;
	//fade in the O
	interval = setInterval(function () {
		context.lineWidth = 10;
		context.strokeStyle = "rgba(255, " + color + ", 255, " + alpha + ")";
		context.beginPath();
		context.arc(centerX, centerY, radius, startAngle, endAngle);
		context.stroke();
		alpha = alpha + 0.1; // increase opacity (fade in)
		if (alpha > 1) {
			clearInterval(interval);
		}
	}, 50);
}

//draws an "X" on the section coordinates
function drawX (xCordinate, yCordinate, color) {
	var alpha = 0.0;   // full opacity
	var offset = 50;
	//fade in the X
	interval2 = setInterval(function () {
		context.strokeStyle = "rgba(" + color + ",120, 255, " + alpha + ")";
		context.beginPath();
		context.moveTo(xCordinate + offset, yCordinate + offset);
		context.lineTo(xCordinate + sectionSize - offset, yCordinate + sectionSize - offset);
		context.moveTo(xCordinate + offset, yCordinate + sectionSize - offset);
		context.lineTo(xCordinate + sectionSize - offset, yCordinate + offset);
		context.stroke();
		alpha = alpha + 0.1; // increase opacity (fade in)
		if (alpha > 1) {
			clearInterval(interval2);
		}
	}, 50);
}

//draw Tic Tac Toe lines
function drawLines (lineWidth, strokeStyle) {
	var startPos = 4;
	var lineLenght = canvasSize - 5;
	context.lineWidth = lineWidth;
	context.lineCap = 'round';
	context.strokeStyle = strokeStyle;
	context.beginPath();

	//Horizontal lines drawn
	for (var y = 1;y <= 2;y++) {
		context.moveTo(startPos, y * sectionSize);
		context.lineTo(lineLenght, y * sectionSize);
	}

	//Vertical lines  drawn

	for (var x = 1;x <= 2;x++) {
		context.moveTo(x * sectionSize, startPos);
		context.lineTo(x * sectionSize, lineLenght);
	}
	context.stroke();
}

//displays the passed text in a div on our webpage
function displayText(text) {
	$("#gameInfo").text(text);
}

/*
0,0		1,0		2,0
0,1 	1,1 	2,1
0,2 	1,2		2,2
*/

//checks for a winning combination
function checkWin (symbol) {
	if((boardStatus[0][0] == symbol && boardStatus[1][1] == symbol && boardStatus[2][2] == symbol )
	||(boardStatus[0][2] == symbol && boardStatus[1][1] == symbol && boardStatus[2][0] == symbol )
	||(boardStatus[0][0] == symbol && boardStatus[0][1] == symbol && boardStatus[0][2] == symbol )
	||(boardStatus[1][0] == symbol && boardStatus[1][1] == symbol && boardStatus[1][2] == symbol )
	||(boardStatus[2][0] == symbol && boardStatus[2][1] == symbol && boardStatus[2][2] == symbol )
	||(boardStatus[0][0] == symbol && boardStatus[1][0] == symbol && boardStatus[2][0] == symbol )
	||(boardStatus[0][1] == symbol && boardStatus[1][1] == symbol && boardStatus[2][1] == symbol )
	||(boardStatus[0][2] == symbol && boardStatus[1][2] == symbol && boardStatus[2][2] == symbol )
	) {
		return true;
	}
	else {
		return false;
	}
}

$(document).ready(function(){

	initboardStatus();				//initialise our board

	//adds symbol at the location of mouse click
	function addPlayingPiece (mouse) {

		var xCordinate;				//variables to store mouse click location
		var yCordinate;

		for (var x = 0;x < 3;x++) {	//loop iterates over 3 cross 3 array
			for (var y = 0;y < 3;y++) {
				  xCordinate = x * sectionSize;		//creates sections according to game boardStatus
				  yCordinate = y * sectionSize;

				  if (		//check where user has clicked the boardStatus
					  mouse.x >= xCordinate && mouse.x <= xCordinate + sectionSize &&
					  mouse.y >= yCordinate && mouse.y <= yCordinate + sectionSize
					) {
						if (boardStatus[x][y] != "") {		//if the spot is already full, return
							displayText("Spot already occupied.");
							return;
						}

						numMoves++;		//increase number of moves

						if (playerSelect === 1) {
							displayText("Player One's Turn.");
							boardStatus[x][y] = "x";						//mark move in array

							drawX(xCordinate, yCordinate, 0);		//draw an X at location

							if (checkWin('x')) {					//if x wins
								displayText("Player Two Wins!");
								$("#ResetButton").fadeIn();
								//disable clicks on canvas to prevent more moves
								$( "#myCanvas" ).css( 'pointer-events', 'none' );
								return;
							}
						}
						else {
							displayText("Player Two's Turn.");
							boardStatus[x][y] = "o";						//mark move in array

							drawO(xCordinate, yCordinate, 255);

							if (checkWin('o')) {
								displayText("Player One Wins!");
								$("#ResetButton").fadeIn();
								//disable clicks on canvas to prevent more moves
								$( "#myCanvas" ).css( 'pointer-events', 'none' );
								return;
							}
						}
					}
			}
		}
		//to handle a draw
		if (numMoves > 8) {
			displayText("It's a draw!");
			$("#ResetButton").fadeIn();
		}
	}
	//generic function to generate position of mouse click on canvas
	function getCanvasMousePosition (event) {
		var rect = canvas.getBoundingClientRect();

		return {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top
		}
	}
	//function that handles mouse clicks on our game board
	canvas.addEventListener('mouseup', function (event) {
		//once a turn is done, select other player
		if (playerSelect === 1) {
			playerSelect = 2;
		} else {
			playerSelect = 1;
		}
		var canvasMousePosition = getCanvasMousePosition(event);
		addPlayingPiece(canvasMousePosition);
		}
	);


    // Add smooth scrolling to all links in navbar + footer link
	$(".navbar a, footer a[href='#myPage']").on('click', function(event) {

    // Prevent default anchor click behavior
    event.preventDefault();

    // Store hash
    var hash = this.hash;

    // Using jQuery's animate() method to add smooth page scroll
    // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 900, function(){

      // Add hash (#) to URL when done scrolling (default click behavior)
      window.location.hash = hash;
    });
  });
  //smooth scroll
  $(window).scroll(function() {
    $(".slideanim").each(function(){
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
        if (pos < winTop + 600) {
          $(this).addClass("slide");
        }
    });
  });
  	//handles pressing the start button
	$("#StartButton").click(function () {
        $("#SplashScreen").fadeOut("slow", function() {
			$("#myCanvas").fadeIn("slow", function() {
				displayText("Player One's Turn.");
			});
		});
    });
	});

	//handles pressing the reset game button
	$("#ResetButton").click(function () {
	$( "#myCanvas" ).css( 'pointer-events', 'auto' );
		$("#ResetButton").fadeOut("slow");
        $("#myCanvas").fadeOut("slow", function() {
			initboardStatus();
			$("#myCanvas").fadeIn("slow", function() {
				displayText("Player One's Turn.");
			});
		});
    }
);
