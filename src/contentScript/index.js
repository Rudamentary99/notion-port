// Function to load jQuery dynamically
// Find the image element by its ID using jQuery
// Data to insert into the Notion database (replace with your scraped properties)
function scrapeData() {
    // Extract the source URL of the image
    let description = window.prompt("Enter a description for the property", "Change me");
    if (!description) {
        return;
    }
    let propertyData = {
        description: description,
        image: document.getElementById('gallerypreview_img1').getAttribute('src'),
        listingID: getElementByTextContent('li', 'Listing ID').nextElementSibling.textContent,
        address: getElementByTextContent('li', 'Address').nextElementSibling.textContent,
        city: getElementByTextContent('li', 'City').nextElementSibling.textContent,
        state: getElementByTextContent('li', 'State').nextElementSibling.textContent,
        postalCode: getElementByTextContent('li', 'Postal Code').nextElementSibling.textContent,
        url: window.location.href,
    };
    browser.runtime.sendMessage({ action: "scrapedData", data: propertyData });

};
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "insertResult") {
        alert(request.data.message);
    } else if (request.action === "scrapePage") {
        scrapeData();
    }
}
);

function getElementByTextContent(selector, text) {
    return Array.from(document.querySelectorAll(selector)).find(el => el.textContent.includes(text));
}
