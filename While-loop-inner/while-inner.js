
//button which activates the ball movement
const button = document.getElementById("startLoopBtn");
const dotRadius = 15; // The radius of the dot
let shouldMove = true; // Flag to control if ball should move
let alertShown = false;

let px = 50; // Position x and y
let py = 50;
let vx = 0.0; // Velocity x and y
let vy = 0.0;
let updateRate = 1 / 60; // Sensor refresh rate



button.addEventListener("click", function () {
  console.log("test");
  DeviceMotionEvent.requestPermission().then((response) => {
    if (response == "granted") {
      // Add a listener to get smartphone orientation
      // in the alpha-beta-gamma axes (units in degrees)
      window.addEventListener("deviceorientation", (event) => {
        if (!shouldMove) return; // If ball shouldn't move, don't update position
     // Expose each orientation angle in a more readable way
    rotation_degrees = event.alpha;
    frontToBack_degrees = event.beta;
    leftToRight_degrees = event.gamma;

    // Update velocity according to how tilted the phone is
    // Since phones are narrower than they are long, double the increase to the x velocity
    vx = vx + leftToRight_degrees * updateRate * 2;
    vy = vy + frontToBack_degrees * updateRate;

    // Set maximum allowed velocity
    const maxVelocity = 10;
    vx = Math.min(Math.max(vx, -maxVelocity), maxVelocity);
    vy = Math.min(Math.max(vy, -maxVelocity), maxVelocity);

    // Calculate new position
    const newPx = px + vx * 0.5;
    const newPy = py + vy * 0.5;

    // Clip new position to bounds
    const clippedPx = Math.max(0, Math.min(98, newPx)); // Clip px between 0-98
    const clippedPy = Math.max(0, Math.min(98, newPy)); // Clip py between 0-98

    // Check if the new position collides with the borders
    const isCollidingWithBorders =
        clippedPx === 0 || clippedPx === 98 || clippedPy === 0 || clippedPy === 98;

    // Update position if not colliding with the borders
    if (!isCollidingWithBorders) {
        px = clippedPx;
        py = clippedPy;
    }


    dot = document.getElementsByClassName("indicatorDot")[0];
    dot.setAttribute("style", "left:" + px + "%;" + "top:" + py + "%;");

    //Converts balls percentage position into coordinates
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const pixelX = (px / 100) * viewportWidth;
    const pixelY = (py / 100) * viewportHeight;

    const targetDot = document.querySelector(".targetDot");
    const targetRect = targetDot.getBoundingClientRect();
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const radius = 15; // Both circles have a radius of 15px

    //collision between the ball and the hollow circle
    const hollowCircle = document.querySelector(".hollowCircle");
    const circleRect = hollowCircle.getBoundingClientRect();
    const circleX = circleRect.left + circleRect.width / 2;
    const circleY = circleRect.top + circleRect.height / 2;
    const circleRadius = circleRect.width / 2;

    const dx = pixelX - circleX;
    const dy = pixelY - circleY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const ballRadius = 50; // Ball's radius is 50px

    if (distance + ballRadius > circleRadius) {
      // Calculate the angle between the ball and the center of the circle
      const angle = Math.atan2(dy, dx);

      // Set the ball's position to the edge of the circle (minus the ball's radius)
      const constrainedX = circleX + (circleRadius - ballRadius) * Math.cos(angle);
      const constrainedY = circleY + (circleRadius - ballRadius) * Math.sin(angle);

      // Update px and py based on the new constrained position
      px = (constrainedX / viewportWidth) * 100;
      py = (constrainedY / viewportHeight) * 100;
    }

    // Check collision with the targetDot
    const targetRadius = targetRect.width / 2;
    const dxTarget = pixelX - targetX;
    const dyTarget = pixelY - targetY;
    const distanceToTarget = Math.sqrt(dxTarget * dxTarget + dyTarget * dyTarget);

    if (distanceToTarget - radius < targetRadius) {
      // Calculate the angle between the ball and the center of the targetDot
      const angle = Math.atan2(dyTarget, dxTarget);

      // Set the ball's position to the edge of the targetDot (plus the ball's radius)
      const constrainedX = targetX + (targetRadius + radius) * Math.cos(angle);
      const constrainedY = targetY + (targetRadius + radius) * Math.sin(angle);

      // Update px and py based on the new constrained position
      px = (constrainedX / viewportWidth) * 100;
      py = (constrainedY / viewportHeight) * 100;
    }

    // Update the ball's position on screen
    dot.setAttribute("style", "left:" + px + "%;" + "top:" + py + "%;");

     
        
      });
    }
  });
});

//the ball and the small circle
function checkCollision(x1, y1, r1, x2, y2, r2) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < r1 + r2;
}


// The overlapping check code
const indicatorDot = document.querySelector(".indicatorDot");
// Initialize collision counts
const collisionCounts = {
  rectangle: 0,
  circle: 0,
  triangle: 0
};

const draggableRectangle = document.querySelector(".draggableRectangle");

function calculateDistanceRectangle(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  const dx = rect1.left + rect1.width / 2 - (rect2.left + rect2.width / 2);
  const dy = rect1.top + rect1.height / 2 - (rect2.top + rect2.height / 2);

  return Math.sqrt(dx * dx + dy * dy);
}

//cooldown for melody counter rectangle/ball collison
let cooldownRect = false;

function checkOverlapRectangle() {
  const distance = calculateDistanceRectangle(draggableRectangle, indicatorDot);
  const combinedRadius =
    draggableRectangle.offsetWidth / 2 + indicatorDot.offsetWidth / 2;

  
  
  if (distance < combinedRadius) {
    draggableRectangle.style.backgroundColor = "#ED2939"; // light red

       if (!cooldownRect) {
      // get the counter element and its current value
      let counter = document.getElementById("counterMelody");
      let currentValue = parseInt(counter.innerText.split('/')[0]);

      // increment the counter if it's less than 6
      if(currentValue < 6) {
        counter.innerText = `${currentValue + 1}/6`;
        cooldownRect = true;
        setTimeout(() => {
          cooldownRect = false;
        }, 500);
      }
    }
  
    // Check if audio is paused or not
    if (audioRect.paused) {
      // Request user interaction to play the sound
      audioRect.play().catch((error) => {
        console.error("Failed to play sound:", error);
      });
      collisionCounts.rectangle++;
      if(collisionCounts.rectangle === 2) checkAllCollisionCount();
      
    }
  } else {
    draggableRectangle.style.backgroundColor = "#7C0A02"; // dark red
    if (!audioRect.paused) {
      audioRect.pause();
      audioRect.currentTime = 0;
    }
  }

  requestAnimationFrame(checkOverlapRectangle);
}

// Create the audio object
const audioRect = new Audio(
  "https://drive.google.com/uc?export=download&id=1E1FPIEui6DF-LQ20DFL_N-na8tU45HWY"
);

let audioUnlockedRect = false;

// Listen for touchstart event on the document to initiate the collision detection
document.addEventListener("touchstart", function (e) {
  if (!audioUnlockedRect) {
    audioRect.play();
    audioRect.pause();
    audioUnlockedRect = true;
  }

  checkOverlapRectangle();
  checkOverlapLine();
});

// Listen for touchmove event on the draggable rectangle to update its position
draggableRectangle.addEventListener("touchmove", function (e) {
  e.preventDefault();
  const touchLocation = e.targetTouches[0];
  let pixelX = touchLocation.clientX;
  let pixelY = touchLocation.clientY;

  draggableRectangle.style.left = (pixelX / window.innerWidth) * 100 + "%";
  draggableRectangle.style.top = (pixelY / window.innerHeight) * 100 + "%";
  checkOverlapLine();
});





// The draggable circle code
const draggableDot = document.querySelector(".draggableDot");

function calculateDistanceCircle(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  const dx = rect1.left + rect1.width / 2 - (rect2.left + rect2.width / 2);
  const dy = rect1.top + rect1.height / 2 - (rect2.top + rect2.height / 2);

  return Math.sqrt(dx * dx + dy * dy);
}


//cooldown for melody counter Circle/ball collison
let cooldownCircle = false;

function checkOverlapCircle() {
  const distance = calculateDistanceCircle(draggableDot, indicatorDot);
  const combinedRadius =
    draggableDot.offsetWidth / 2 + indicatorDot.offsetWidth / 2;

  if (distance < combinedRadius) {
    draggableDot.style.backgroundColor = "#00abff"; // Darker blue

    if (!cooldownCircle) {
      // get the counter element and its current value
      let counter = document.getElementById("counterMelody");
      let currentValue = parseInt(counter.innerText.split('/')[0]);

      // increment the counter if it's less than 6
      if(currentValue < 6) {
        counter.innerText = `${currentValue + 1}/6`;
        cooldownCircle = true;
        setTimeout(() => {
          cooldownCircle = false;
        }, 500);
      }
    }
    
    
     // Check if audio is paused or not
    if (audioCircle.paused) {
      // Request user interaction to play the sound
      audioCircle.play().catch((error) => {
        console.error("Failed to play sound:", error);
      });
      
     collisionCounts.circle++;
      if(collisionCounts.circle === 2) checkAllCollisionCount(); 
    }
  } else {
    draggableDot.style.backgroundColor = "#005780"; // Original blue
    
     if (!audioCircle.paused) {
      audioCircle.pause();
      audioCircle.currentTime = 0;
    }
  }

  requestAnimationFrame(checkOverlapCircle);
}

// Create the audio object
const audioCircle = new Audio(
  "https://drive.google.com/uc?export=download&id=1J1piF2fuUQQlt3iCsIbCd6XzG4FmbE2K"
);

let audioUnlockedCircle = false;

// Listen for touchstart event on the document to initiate the collision detection
document.addEventListener("touchstart", function (e) {
  if (!audioUnlockedCircle) {
    audioCircle.play();
    audioCircle.pause();
    audioUnlockedCircle = true;
  }

  checkOverlapCircle();
  checkOverlapLine();
});


draggableDot.addEventListener("touchmove", function (e) {
  e.preventDefault();
  const touchLocation = e.targetTouches[0];
  let pixelX = touchLocation.clientX;
  let pixelY = touchLocation.clientY;

  draggableDot.style.left = (pixelX / window.innerWidth) * 100 + "%";
  draggableDot.style.top = (pixelY / window.innerHeight) * 100 + "%";
  checkOverlapLine();
});






//cooldown for melody counter Triangle/ball collison
let cooldownTriangle = false;

// Draggable triangle code
const draggableTriangle = document.querySelector(".draggableTriangle");

// Overlapping check code
function calculateDistanceTriangle(triangleSVG, dot) {
  const rect1 = triangleSVG.getBoundingClientRect();
  const rect2 = dot.getBoundingClientRect();

  const dx = rect1.left + rect1.width / 2 - (rect2.left + rect2.width / 2);
  const dy = rect1.top + rect1.height / 2 - (rect2.top + rect2.height / 2);

  return Math.sqrt(dx * dx + dy * dy);
}

function checkOverlapTriangle() {
  const distance = calculateDistanceTriangle(draggableTriangle, indicatorDot);
  const combinedRadius =
    draggableTriangle.getBoundingClientRect().width / 2 +
    indicatorDot.offsetWidth / 2;

  if (distance < combinedRadius) {
    draggableTriangle.style.borderColor = "transparent transparent 		#CCCC00"; // Darker blue
        // Check if audio is paused or not
    
    
     if (!cooldownTriangle) {
      // get the counter element and its current value
      let counter = document.getElementById("counterMelody");
      let currentValue = parseInt(counter.innerText.split('/')[0]);

      // increment the counter if it's less than 6
      if(currentValue < 6) {
        counter.innerText = `${currentValue + 1}/6`;
        cooldownTriangle = true;
        setTimeout(() => {
          cooldownTriangle = false;
        }, 500);
      }
    }
    
    
    if (audioTriangle.paused) {
      // Request user interaction to play the sound
      audioTriangle.play().catch((error) => {
        console.error("Failed to play sound:", error);
      });
       collisionCounts.triangle++;
      if(collisionCounts.triangle === 2) checkAllCollisionCount();
    }
    
  } else {
    draggableTriangle.style.borderColor = "transparent transparent 	#999900"; // Original blue
    
    if (!audioTriangle.paused) {
      audioTriangle.pause();
      audioTriangle.currentTime = 0;
    }
  }

  requestAnimationFrame(checkOverlapTriangle);
}

// Create the audio object
const audioTriangle = new Audio(
  "https://drive.google.com/uc?export=download&id=1n2iV-8O2AxTDgLMJPDgA6NwuHn8IT8l3"
);

let audioUnlockedTriangle = false;


// Listen for touchstart event on the document to initiate the collision detection
document.addEventListener("touchstart", function (e) {
  if (!audioUnlockedTriangle) {
    audioTriangle.play();
    audioTriangle.pause();
    audioUnlockedTriangle = true;
  }

  checkOverlapTriangle();
  checkOverlapLine();
});



draggableTriangle.addEventListener("touchmove", function (e) {
  e.preventDefault();
  const touchLocation = e.targetTouches[0];
  draggableTriangle.style.left = touchLocation.clientX + "px";
  draggableTriangle.style.top = touchLocation.clientY + "px";
  checkOverlapLine();
});





//line collision after the ball has collided with the three moveable obejtcs, toalt of two collision with an object
const line = document.querySelector("#line");

function calculateDistanceLine(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  const dx = rect1.left + rect1.width / 2 - (rect2.left + rect2.width / 2);
  const dy = rect1.top + rect1.height / 2 - (rect2.top + rect2.height / 2);

  return Math.sqrt(dx * dx + dy * dy);
}


function checkOverlapLine() {
  const distance = calculateDistanceLine(indicatorDot, line);
  const combinedRadius = indicatorDot.offsetWidth / 2 + line.offsetWidth / 2;

  // If all three objects have been collided with twice and the ball is touching the line
  if (collisionCounts.rectangle >= 2 && collisionCounts.circle >= 2 && collisionCounts.triangle >= 2 && distance < combinedRadius) {
    shouldMove = false; 
    //document.getElementById('alert').style.display='block';
  alert("The while loop is completed");
  }
  requestAnimationFrame(checkOverlapLine);
}







