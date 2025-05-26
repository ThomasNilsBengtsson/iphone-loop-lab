# Tilt-Loops (iPhone Edition)

**Tilt-Loops** is a motion-controlled, browser-based mini-app that lets learners *feel* how programming loops work.  
Open the CodePen demo on an iPhone, grant motion-sensor access, and tilt the phone to roll a virtual ball around a colourful track:

| Loop | What you do | What it shows |
|------|-------------|---------------|
| **For-loop** | Tilt until the ball completes *N* laps. | Fixed-iteration loops (`for (i = 0; i < N; i++)`). |
| **While-loop** | Keep tilting until you level the phone. | Condition-controlled loops (`while (!isLevel)`). |

---

## What it actually is

| Aspect | Details |
|--------|---------|
| **Platform** | Pure HTML + CSS + JavaScript hosted on **[CodePen.io](https://codepen.io)**. No installs, no Xcode, no backend. |
| **Target device** | iPhone (iOS 13+). Any modern mobile browser that supports the *DeviceOrientation* API should work, but Safari on iOS is the reference. |
| **Interaction model** | Reads the phone’s gyroscope/accelerometer (γ = left/right tilt) at ≈ 60 Hz. Tilt is mapped to angular force; a simple physics loop updates the ball’s position on a `<canvas>`. |
| **Educational goal** | Make abstract loop constructs tangible by coupling each iteration to a physical action (tilting). |

---

## Quick start on iPhone

1. **Open the demo**
   The code can can be accessed through the following links. Create an account on CodePen.io then go to debug mode to start the demo.
   
   *For-loop* → <https://codepen.io/IdxThomas/pen/BaqvxWV>
   
   *While-loop - inner condition* → <https://codepen.io/IdxThomas/pen/abQbXLG>
   
   *While-loop - outer condition* → <https://codepen.io/IdxThomas/pen/rNqRBxx>

3. **Allow motion access**  
   When Safari pops up *“This site wants to access motion & orientation”*, tap **Allow**.

4. **Tilt and explore**  
   - Left/right = accelerate/decelerate the ball.  
   - Keep the phone level to stop (while-loop) or wait for the counter to hit zero (for-loop).

