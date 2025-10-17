/*
Storage structure:

savedMedia = {
			title: String, 
			platform: String
			watched: bool
		  } [ ]
*/

const STORAGE_KEY = 'savedMedia';

// -- helper functions  -- //

async function getSavedMedia() { 
    return new Promise(resolve => {
        chrome.storage.sync.get([STORAGE_KEY], result => {
            resolve(result[STORAGE_KEY] || []);
        });
    });
}

async function setStorageData(data) {
    return new Promise(resolve => {
        chrome.storage.sync.set({[STORAGE_KEY]: data}, resolve);
    });
}

// -- CRUD operations -- //

async function getAllItems() {
    return await getSavedMedia();
}

async function addItem(title, platform, isWatched) {
    const savedMedia = await getSavedMedia();
    savedMedia.push({title, platform, watched: isWatched});
    await setStorageData(savedMedia);
    return {sucess:true};
}

async function updateWatchStatus(title, platform, isWatched) {
    const savedMedia = await getSavedMedia();
    const itemIndex = savedMedia.findIndex(cur => cur.title === title && cur.platform === platform);
    
    if (itemIndex == -1) { // item not found
        return {success:false, message: "Item not found"};
    }
    
    savedMedia[itemIndex].watched = isWatched; // update watch status

    await setStorageData(savedMedia);
    return {success:true};
}

async function deleteItem(title, platform) {
    const savedMedia = await getSavedMedia();
    const updatedMedia = savedMedia.filter(cur => !(cur.title === title && cur.platform === platform));
    await setStorageData(updatedMedia);
    return {success:true};
}

async function clearAllItems() {
    await setStorageData([]);
    return {success:true};
}
