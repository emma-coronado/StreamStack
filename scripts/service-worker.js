importScripts('storage.js'); // import storage functions

// let users open the side panel by clicking the extension icon
chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true})

/* 
    Listen for messages from the side panel or content scripts
 
    Sample message:

        chrome.runtime.sendMessage({
            action: "addItem",
            title: "Stranger Things",
            platform: "Netflix",
            isWatched: true
        }, response => {
            console.log(response);
        });

*/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => { 
        switch (message.action) {
            case "getAllItems":
                sendResponse(await getAllItems());
                break;
            case "addItem":
                sendResponse(await addItem(message.title, message.platform, message.isWatched));
                break;
            case "updateWatchStatus":
                sendResponse(await updateWatchStatus(message.title, message.platform, message.isWatched));
                break;
            case "deleteItem":
                sendResponse(await deleteItem(message.title, message.platform));
                break;
            case "clearAllItems":
                sendResponse(await clearAllItems());
                break;
            default:
                console.warn("Unknown message type:", message.type);
                sendResponse({success:false, message: "Unknown message type"});
        }
    })()
    return true; // indicates that we will send a response asynchronously
});
