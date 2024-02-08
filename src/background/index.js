// background.js
import secrets from './secrets.json';

function getSecrets() {
    return secrets;
}

// Add listener for messages from content scripts
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrapedData") {
        // Call the function to insert data into Notion
        insertIntoNotion(request.data);
    }
});

// Create context menu item
browser.contextMenus.create({
    id: "scrapePage",
    title: "Scrape Page",
    contexts: ["all"]
});

// Add listener for context menu item click
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "scrapePage") {
        // Execute content script to scrape data from the page
        let config = getSecrets();
        sendMessagetoContentScript({ action: "scrapePage" });
    }
});

function sendMessagetoContentScript(message) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, message);
    });
}
// Function to insert data into the Notion database
async function insertIntoNotion(data) {
    const {
        NOTION_API_KEY,
        NOTION_DATABASE_ID
    } = getSecrets();
    console.log(NOTION_API_KEY, NOTION_DATABASE_ID)
    fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
            'Accept': '"application/json"',
            'Notion-Version': '2022-06-28',
            'Authorization': 'Bearer ' + NOTION_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "parent": {
                "type": "database_id",
                "database_id": NOTION_DATABASE_ID
            },
            "properties": {
                "Name": { "title": [{ "text": { "content": data.description } }] },
                "URL": { "url": data.url },
                "Maps Link": { "url": "https://google.com/maps/place/" + data.address.replace(/ /g, '+') +`,+${data.city},+${data.state}+${data.postalCode}` },
                "Listing ID": { "rich_text": [{ "text": { "content": data.listingID } }] },
                "Address": { "rich_text": [{ "text": { "content": data.address } }] },
            },
            "children": [
                {
                    "object": "block",
                    "type": "embed",
                    "embed": {
                        "url": data.image,
                    }
                }
            ]
        }),
    }).then(response => response.json()).then(data => {
        console.log('data :>> ', data);
        sendMessagetoContentScript({
            action: "insertResult", data: {
                success: data.status !== undefined,
                message: data.message || 'Data successfully inserted into Notion'
            }
        });
    }).catch((error) => {
        alert('Error inserting data into Notion');
        console.error('Error:', error);
    });
}
