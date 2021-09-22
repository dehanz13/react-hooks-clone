import { render } from "./MyReact.js";
import Component from "./Component.js";

// To make the props change
let propCount = 0;
document.getElementById("btn-prop").addEventListener("click", () => {
  propCount++;
  renderComponent();
});

// get the element we want and render it out to the screen.
function renderComponent() {
  // render the component, pass in some props, and the parent component.
  render(
    Component,
    { propCount, buttonElm: document.getElementById("btn-count") },
    document.getElementById("root")
  );
  render(
    Component,
    { propCount, buttonElm: document.getElementById("btn-count-2") },
    document.getElementById("root-2")
  );
}

renderComponent();
