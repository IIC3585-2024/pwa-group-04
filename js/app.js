import { openDB } from 'idb';

const container = document.querySelector(".container")
const buttons = document.querySelectorAll(".card--link")
const title = document.querySelectorAll(".card--title")

const coffees = [
  { name: "Perspiciatis", image: "images/coffee1.jpg" },
  { name: "Voluptatem", image: "images/coffee2.jpg" },
  { name: "Explicabo", image: "images/coffee3.jpg" },
  { name: "Rchitecto", image: "images/coffee4.jpg" },
  { name: " Beatae", image: "images/coffee5.jpg" },
  { name: " Vitae", image: "images/coffee6.jpg" },
  { name: "Inventore", image: "images/coffee7.jpg" },
  { name: "Veritatis", image: "images/coffee8.jpg" },
  { name: "Accusantium", image: "images/coffee9.jpg" },
]

const showCoffees = () => {
    let output = ""
    coffees.forEach(
      ({ name, image }) =>
        (output += `
                <div class="card">
                  <img class="card--avatar" src=${image} />
                  <h1 class="card--title">${name}</h1>
                  <a class="card--link" href="#">Taste</a>
                </div>
                `)
    )
    container.innerHTML = output
}
  
document.addEventListener("DOMContentLoaded", async () => {
  // Set up the database
  const db = await openDB('settings-store', 1, {
    upgrade(db) {
      db.createObjectStore('settings');
    },
  });

  // If a button is clicked, save the value in IndexedDB
  buttons.addEventListener('click', async () => {
    console.log('Button clicked');
    await db.put('settings', 'button', 'content');
  });

  // If a title is clicked, see the 'content' value in the console
  title.addEventListener('click', async () => {
    console.log(await db.get('settings', 'button'));
  });

  showCoffees
})
  
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
}