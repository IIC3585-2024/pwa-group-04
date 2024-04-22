import { db, addCoffeeToDB } from './db.js';
import { coffees } from '../assets/coffees.js';

const basePath = '/pwa-group-04';

const container = document.querySelector(".container");

const showCoffees = () => {
  let output = "";
  coffees.forEach(
    ({ name, image }) =>
      (output += `
              <div class="card">
                <img class="card--avatar" src=${image} />
                <h1 class="card--title">${name}</h1>
                <a class="card--link" href="#" data-key=${name} data-value=${image}>Taste</a>
              </div>
              `)
  );
  container.innerHTML = output;
};

document.addEventListener("DOMContentLoaded", async () => {
  
  showCoffees();

  const buttons = document.querySelectorAll('a');

  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const key = button.getAttribute('data-key');
      const value = button.getAttribute('data-value');
      console.log(key, value);
      await addCoffeeToDB(key, value);
    });
  });
}); 

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register(`serviceWorker.js`)
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}
