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
let timerHasReachedZero = false; // Flag to indicate when timer reaches zero
let startTimer = false;

//timer
const countdownElement = document.getElementById("countdown");
let countdownValue = 10;

// Timer function
function updateCountdown() {
  // Only update the timer if the button has been clicked
  if (startTimer) {
    countdownElement.innerHTML = countdownValue;
    if (countdownValue > 0) {
      countdownValue--;
    } else {
      timerHasReachedZero = true;
    }
  }
}

// Start the timer
setInterval(updateCountdown, 1000);

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
          clippedPx === 0 ||
          clippedPx === 98 ||
          clippedPy === 0 ||
          clippedPy === 98;

        // Update position if not colliding with the borders
        if (!isCollidingWithBorders) {
          px = clippedPx;
          py = clippedPy;
        }

        dot = document.getElementsByClassName("indicatorDot")[0];
        dot.setAttribute("style", "left:" + px + "%;" + "top:" + py + "%;");

        //Converts balls perctange position into coordinates
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const pixelX = (px / 100) * viewportWidth;
        const pixelY = (py / 100) * viewportHeight;

        const targetDot = document.querySelector(".targetDot");
        const targetRect = targetDot.getBoundingClientRect();
        const targetX = targetRect.left + targetRect.width / 2;
        const targetY = targetRect.top + targetRect.height / 2;

        const radius = 15; // Both circles have a radius of 15px

        //collision between the ball and the hallow circle
        const hollowCircle = document.querySelector(".hollowCircle");
        const circleRect = hollowCircle.getBoundingClientRect();
        const circleX = circleRect.left + circleRect.width / 2;
        const circleY = circleRect.top + circleRect.height / 2;
        const circleRadius = circleRect.width / 2;

        const dx = pixelX - circleX;
        const dy = pixelY - circleY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const ballRadius = 50; // Both circles have a radius of 15px

        if (distance + ballRadius > circleRadius) {
          // Calculate the angle between the ball and the center of the circle
          const angle = Math.atan2(dy, dx);

          // Set the ball's position to the edge of the circle (minus the ball's radius)
          const constrainedX =
            circleX + (circleRadius - ballRadius) * Math.cos(angle);
          const constrainedY =
            circleY + (circleRadius - ballRadius) * Math.sin(angle);

          // Update px and py based on the new constrained position
          px = (constrainedX / viewportWidth) * 100;
          py = (constrainedY / viewportHeight) * 100;

          // Update the ball's position on screen
          dot.setAttribute("style", "left:" + px + "%;" + "top:" + py + "%;");
        }

        // Check collision with the targetDot
        const targetRadius = targetRect.width / 2;
        if (
          checkCollision(pixelX, pixelY, radius, targetX, targetY, targetRadius)
        ) {
          // Calculate the angle between the ball and the center of the targetDot
          const angle = Math.atan2(dy, dx);

          // Set the ball's position to the edge of the targetDot (minus the ball's radius)
          const constrainedX =
            targetX + (radius + targetRadius) * Math.cos(angle);
          const constrainedY =
            targetY + (radius + targetRadius) * Math.sin(angle);

          // Update px and py based on the new constrained position
          px = (constrainedX / viewportWidth) * 100;
          py = (constrainedY / viewportHeight) * 100;

          // Update the ball's position on screen
          dot.setAttribute("style", "left:" + px + "%;" + "top:" + py + "%;");
        }

        // Check for collision with the line
        const line = document.getElementById("line");
        const lineRect = line.getBoundingClientRect();
        const dotRect = dot.getBoundingClientRect();

        //starts timer
        startTimer = true;

        if (
          lineRect.left < dotRect.right &&
          lineRect.right > dotRect.left &&
          lineRect.top < dotRect.bottom &&
          lineRect.bottom > dotRect.top &&
          timerHasReachedZero &&
          !alertShown
        ) {
          alertShown = true;
          shouldMove = false;
          alert("the while loop has successfully executed");
        }
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

// The draggable circle code
const draggableDot = document.querySelector(".draggableDot");

draggableDot.addEventListener("touchmove", function (e) {
  e.preventDefault();
  const touchLocation = e.targetTouches[0];
  let pixelX = touchLocation.clientX;
  let pixelY = touchLocation.clientY;

  draggableDot.style.left = (pixelX / window.innerWidth) * 100 + "%";
  draggableDot.style.top = (pixelY / window.innerHeight) * 100 + "%";
});

function calculateDistanceCircle(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  const dx = rect1.left + rect1.width / 2 - (rect2.left + rect2.width / 2);
  const dy = rect1.top + rect1.height / 2 - (rect2.top + rect2.height / 2);

  return Math.sqrt(dx * dx + dy * dy);
}

function checkOverlapCircle() {
  const distance = calculateDistanceCircle(draggableDot, indicatorDot);
  const combinedRadius =
    draggableDot.offsetWidth / 2 + indicatorDot.offsetWidth / 2;

  if (distance < combinedRadius) {
    draggableDot.style.backgroundColor = "#00abff"; // Darker blue
  } else {
    draggableDot.style.backgroundColor = "#005780"; // Original blue
  }

  requestAnimationFrame(checkOverlapCircle);
}

checkOverlapCircle();

//draggableRectangle

// The draggable rectangle code
const draggableRectangle = document.querySelector(".draggableRectangle");

draggableRectangle.addEventListener("touchmove", function (e) {
  e.preventDefault();
  const touchLocation = e.targetTouches[0];
  let pixelX = touchLocation.clientX;
  let pixelY = touchLocation.clientY;

  draggableRectangle.style.left = (pixelX / window.innerWidth) * 100 + "%";
  draggableRectangle.style.top = (pixelY / window.innerHeight) * 100 + "%";
});

function calculateDistanceRectangle(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  const dx = rect1.left + rect1.width / 2 - (rect2.left + rect2.width / 2);
  const dy = rect1.top + rect1.height / 2 - (rect2.top + rect2.height / 2);

  return Math.sqrt(dx * dx + dy * dy);
}

function checkOverlapRectangle() {
  const distance = calculateDistanceRectangle(draggableRectangle, indicatorDot);
  const combinedRadius =
    draggableRectangle.offsetWidth / 2 + indicatorDot.offsetWidth / 2;

  if (distance < combinedRadius) {
    draggableRectangle.style.backgroundColor = "#ED2939"; // light red
  } else {
    draggableRectangle.style.backgroundColor = "#7C0A02"; // dark red
  }

  requestAnimationFrame(checkOverlapRectangle);
}

checkOverlapRectangle();

// Draggable triangle code
const draggableTriangle = document.querySelector(".draggableTriangle");

draggableTriangle.addEventListener("touchmove", function (e) {
  e.preventDefault();
  const touchLocation = e.targetTouches[0];
  draggableTriangle.style.left = touchLocation.clientX + "px";
  draggableTriangle.style.top = touchLocation.clientY + "px";
});

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
    draggableTriangle.style.borderColor = "transparent transparent #CCCC00"; // Darker blue
  } else {
    draggableTriangle.style.borderColor = "transparent transparent #999900"; // Original blue
  }

  requestAnimationFrame(checkOverlapTriangle);
}

checkOverlapTriangle();
