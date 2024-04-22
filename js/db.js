let db;

const openOrCreateDB = window.indexedDB.open('coffee_db', 1);

openOrCreateDB.addEventListener('error', () => console.error('Error opening DB'));

openOrCreateDB.addEventListener('success', () => {
    console.log('Successfully opened DB');
    db = openOrCreateDB.result;
});

openOrCreateDB.addEventListener('upgradeneeded', init => {
    db = init.target.result;

    db.onerror = () => {
        console.error('Error loading database.');
    };

    const table = db.createObjectStore('coffee_db', { keyPath: 'id', autoIncrement:true });

    table.createIndex('title', 'title', { unique: false });
    table.createIndex('desc', 'desc', { unique: false });
});

const addCoffeeToDB = async (key, value) => {
    const newCoffee = { title: key, body: value };
    const transaction = db.transaction(['coffee_db'], 'readwrite');
    const objectStore = transaction.objectStore('coffee_db');
    const query = objectStore.add(newCoffee);
    query.addEventListener('success', () => {
        console.log("success")
      });

      transaction.addEventListener('complete', () => {
        console.log("Loaded")
      });
      
      transaction.addEventListener('error', () => console.log('Transaction error'));
};


export { db, addCoffeeToDB };
