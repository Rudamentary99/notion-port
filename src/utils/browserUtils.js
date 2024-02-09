
export function queryTabs(queryInfo) {
    return new Promise((res, rej) => {
        chrome.tabs.query(queryInfo, tabs => {
            if (chrome.runtime.lastError) {
                rej(chrome.runtime.lastError.message)
                return
            }
            res(tabs || [])
        })
    })
}

export async function queryTabsSeveral(queryInfo, attempts = 5, timeout = 100) {
    for (let i = 0; i < Math.max(0, attempts ?? 3); i++) {
        if (i) {
            await new Promise((res) => setTimeout(() => res(true), timeout ?? 100))
        }
        try {
            return await queryTabs(queryInfo)
        } catch (err) { }
    }
}

export async function getActiveTabInfo() {
    let tabs = await queryTabsSeveral({ active: true, currentWindow: true }, 3, 75)
    if (!tabs.length) return
    const [tab] = tabs
    return {
        tabId: tab.id,
        windowId: tab.windowId,
        url: tab.url
    }
}


export function compareFrame(a, b) {
    return a?.tabId === b?.tabId && (a?.frameId ?? null) === (b?.frameId ?? null)
}

export function senderToTabInfo(sender) {
    if (!sender.tab) return
    return { tabId: sender.tab.id, frameId: sender.frameId, windowId: sender.tab.windowId }
}

export function requestTabInfo() {
    return new Promise((res, rej) => {
        chrome.runtime.sendMessage({
            type: "REQUEST_TAB_INFO"
        }, info => {
            if (chrome.runtime.lastError) {
                rej(chrome.runtime.lastError)
                return
            }
            res(info)
        })
    })
}

export function requestCreateTab(url) {
    return new Promise((res, rej) => {
        chrome.runtime.sendMessage({
            type: "REQUEST_CREATE_TAB",
            url
        }, id => {
            res(id)
        })
    })
}

export function getStorage(key) {
    return new Promise((res, rej) => {
        chrome.storage.local.get(key, items => {
            if (chrome.runtime.lastError) {
                rej(chrome.runtime.lastError)
            } else {
                res(items)
            }
            return
        })
    })
}