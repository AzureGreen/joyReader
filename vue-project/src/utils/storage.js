
// const fetch = (storageKey) => {
//     return JSON.parse(window.localStorage.getItem(storageKey) || '');
// }

// const save = (storageKey, items) => {
//     window.localStorage.setItem(storageKey, JSON.stringify(items));
// }

// export default { fetch, save }

export default { 
    fetch (storageKey) {
        return window.localStorage.getItem(storageKey);
    },

    save (storageKey, items) {
        window.localStorage.setItem(storageKey, items);
    }
}

