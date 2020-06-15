/**
 * Event to publish when a
 * mouse pointer is moved
 * inside the app
 * @param {MouseEvent} event
 */
function MouseMoveEvent(event) {
  this.event = event;
}

/**
 * Event to publish when a
 * mouse button is released
 * inside the app

 */
function MouseUpEvent() {}

export { MouseMoveEvent, MouseUpEvent };
