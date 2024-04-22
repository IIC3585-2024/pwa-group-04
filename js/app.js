const container = document.querySelector(".container");
const coffees = [
  {
    name: "Perspiciatis",
    image: "images/coffee1.jpg"
  },
  {
    name: "Voluptatem",
    image: "images/coffee2.jpg"
  },
  {
    name: "Explicabo",
    image: "images/coffee3.jpg"
  },
  {
    name: "Rchitecto",
    image: "images/coffee4.jpg"
  },
  {
    name: " Beatae",
    image: "images/coffee5.jpg"
  },
  {
    name: " Vitae",
    image: "images/coffee6.jpg"
  },
  {
    name: "Inventore",
    image: "images/coffee7.jpg"
  },
  {
    name: "Veritatis",
    image: "images/coffee8.jpg"
  },
  {
    name: "Accusantium",
    image: "images/coffee9.jpg"
  }
];
const showCoffees = () => {
  let output = "";
  coffees.forEach(
    ({ name, image }) =>
      (output += `
              <div class="card">
                <img class="card--avatar" src=${image} />
                <h1 class="card--title">${name}</h1>
                <a class="card--link" href="#">Taste</a>
              </div>
              `)
  );
  container.innerHTML = output;
};

document.addEventListener("DOMContentLoaded", async () => {

    // This is what our customer data looks like.
  const customerData = [
    { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
    { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" },
  ];

  const db = "store";

  const request = indexedDB.open(db, 3);
  
  request.onerror = (event) => {
    // Handle errors.
  };
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
  
    // Create an objectStore to hold information about our customers. We're
    // going to use "ssn" as our key path because it's guaranteed to be
    // unique - or at least that's what I was told during the kickoff meeting.
    const objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
  
    // Create an index to search customers by name. We may have duplicates
    // so we can't use a unique index.
    objectStore.createIndex("name", "name", { unique: false });
  
    // Create an index to search customers by email. We want to ensure that
    // no two customers have the same email, so use a unique index.
    objectStore.createIndex("email", "email", { unique: true });
  
    // Use transaction oncomplete to make sure the objectStore creation is
    // finished before adding data into it.
    objectStore.transaction.oncomplete = (event) => {
      // Store values in the newly created objectStore.
      const customerObjectStore = db
        .transaction("customers", "readwrite")
        .objectStore("customers");
      customerData.forEach((customer) => {
        customerObjectStore.add(customer);
      });
    };
  };

  const transaction = db.transaction(["customers"]);
  const objectStore = transaction.objectStore("customers");
  const request_2 = objectStore.get("444-44-4444");
  request_2.onerror = (event) => {
    // Handle errors!
  };
  request_2.onsuccess = (event) => {
    // Do something with the request.result!
    console.log(`Name for SSN 444-44-4444 is ${request_2.result.name}`);
  };

  showCoffees

  const buttons = document.querySelectorAll('a');

  buttons.forEach(button => {
    button.addEventListener('click', async () => {
      const key = button.getAttribute('data-key');
      const value = button.getAttribute('data-value');
      await db.put('settings', value, key);
      console.log('value added to db', key, value);
    });
  });
}); 

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/pwa-group-04/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}
