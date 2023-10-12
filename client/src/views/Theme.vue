<template>
  
  <h1>Themes</h1>
  <h3>Base</h3>
  <p>This is Pico default light them with added secondary, error buttons and alerts.</p>
  <hr>
  <h4>Buttons</h4>
  <div class="grid">
    <button>Primary</button>
    <button disabled>Primary</button>
    <button class="outline">Primary</button>
    <button class="outline" disabled>Primary</button>
  </div>
  <br>
  <div class="grid">
    <button class="secondary">Secondary</button>
    <button class="secondary" disabled>Secondary</button>
    <button class="secondary outline">Secondary</button>
    <button class="secondary outline" disabled>Secondary</button>
  </div>
  <br>
  <div class="grid">
    <button class="contrast">Contrast</button>
    <button class="contrast" disabled>Contrast</button>
    <button class="contrast outline">Contrast</button>
    <button class="contrast outline" disabled>Contrast</button>
  </div>
  <br>
  <div class="grid">
    <button class="error">error</button>
    <button class="error" disabled>error</button>
    <button class="error outline">error</button>
    <button class="error outline" disabled>error</button>
  </div>
  <br>
  <h3>Alerts</h3>
  <div role="alert">This is an alert.</div>
  <div role="alert" class="info">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M7.9 8.548h-.001a5.528 5.528 0 0 1 3.1 4.659.75.75 0 1 1-1.498.086A4.01 4.01 0 0 0 5.5 9.5a4.01 4.01 0 0 0-4.001 3.793.75.75 0 1 1-1.498-.085 5.527 5.527 0 0 1 3.1-4.66 3.5 3.5 0 1 1 4.799 0ZM13.25 0a.75.75 0 0 1 .75.75V2h1.25a.75.75 0 0 1 0 1.5H14v1.25a.75.75 0 0 1-1.5 0V3.5h-1.25a.75.75 0 0 1 0-1.5h1.25V.75a.75.75 0 0 1 .75-.75ZM5.5 4a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 4Z"></path></svg>
    This is an info alert</div>
  <div role="alert" class="success">This is success</div>
  <div role="alert" class="warn">This is a warning</div>
  <div role="alert" class="error">This is an error</div>
  <br>
  <h3>Tooltip</h3>
  <p>Tooltip on a <a href="#" data-tooltip="Tooltip">link</a></p>


</template>
