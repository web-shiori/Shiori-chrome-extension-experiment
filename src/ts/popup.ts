import request = chrome.permissions.request;

interface MetaData {
    title: string;
    url: string;
    height: number;
    width: number;
    positionX: number;
    positionY: number;
    videoPlayBackPosition: number;
}

function getVideoPlayBackPosition() {
    return new Promise((resolve) => {
        chrome.tabs.getSelected(tab => {
            // @ts-ignore
            chrome.tabs.executeScript(tab.id, {
                code: `
                document.getElementsByTagName('video')[0].currentTime;
            `
            },(result) => {
                console.log(`videoPlayBackPosition: ${result[0]}`)
                const videoPlayBackPosition: number = Number(result[0])
                resolve({ videoPlayBackPosition })
            })
        })
    })
}

function getScrollPositionX(): number {
    chrome.tabs.getSelected(tab => {
        // @ts-ignore
        chrome.tabs.executeScript(tab.id, {
            code: `
                String(Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft));
            `
        }, function (result) {
            return result[0]
        })
    })
    return 0
}

function getScrollPositionY() {
    return new Promise((resolve) => {
        chrome.tabs.getSelected(tab => {
            // @ts-ignore
            chrome.tabs.executeScript(tab.id, {
                code: `
                String(Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop));
            `
            },(result) => {
                console.log(`getScrollPositionY: ${result[0]}`)
                const positionY: number = Number(result[0])
                resolve({ positionY })
            })
        })
    })
}

function getMetaFromSelectedTab() {
    return new Promise((resolve) => {
        chrome.tabs.getSelected(tab => {
            console.log("getSelected")
            const url = tab.url ?? "a"
            const title = tab.title ?? ""
            const height = tab.height ?? 0
            const width = tab.width ?? 0
            console.log(`tab.url: ${tab.url}`)
            console.log(`url: ${url}`)
            resolve({
                url: url,
                title,
                height,
                width
            })
        })
    })


}

async function getMetaData() {
    let title = ""
    let url = ""
    let height = 0
    let width = 0
    let positionX = 0
    let positionY = 0
    let videoPlayBackPosition = 0

    // 実行される順番が最後。だから反映されてない。同期的に書かないといけない。。。
    // 非同期処理むずい、、けど勉強になる
    const a = await getMetaFromSelectedTab()
    // @ts-ignore
    title = a.title
    // @ts-ignore
    url = a.url
    // @ts-ignore
    height = a.height
    // @ts-ignore
    width = a.width
    positionX = getScrollPositionX()
    console.log("getScrollPositionY")
    console.log(getScrollPositionY())
    // @ts-ignore
    const pY = await getScrollPositionY()
    // @ts-ignore
    positionY = pY.positionY
    const vpbp = await getVideoPlayBackPosition()
    // @ts-ignore
    videoPlayBackPosition = vpbp.videoPlayBackPosition
    console.log("getMetaData")
    console.log(`title: ${title}`)
    console.log(`url: ${url}`)
    console.log(`py: ${positionY}`)
    console.log("end getMetaData")
    let metaData: MetaData = {
        title,
        url,
        height,
        width,
        positionX,
        positionY,
        videoPlayBackPosition
    }
    return metaData
}

const StorageKey = 'mylist';
const button_save = document.getElementById('button-save')
button_save?.addEventListener('click', function () {
    getMetaData().then((result) => {
        const content: MetaData = result
        console.log("save button pressed")
        console.log(`title: ${content.title}`)
        setToStorage(StorageKey, content)
        console.log(content.url)
    })

})

const button_load = document.getElementById('button-load')
button_load?.addEventListener('click', async function () {
    const res = await getByStorage(StorageKey);
    console.log('GET', res);
    const url = res?.url ?? ""
    alert(res?.videoPlayBackPosition)
    const sendData = {
        positionX: res?.positionX ?? 0,
        positionY: res?.positionY ?? 0,
        videoPlayBackPosition: res?.videoPlayBackPosition ?? 0,
    }

    chrome.runtime.sendMessage(sendData)
    await chrome.tabs.create({
        url
    }, () => {
        const sendData = {
            positionX: res?.positionX ?? 0,
            positionY: res?.positionY ?? 0,
            videoPlayBackPosition: res?.videoPlayBackPosition ?? 1,
        }

        chrome.runtime.sendMessage(sendData)
    });
})

function getByStorage(key: string): Promise<MetaData|null> {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (value) => {
            resolve(value[key]);
        });
    });
}

function setToStorage(key: string, val: MetaData): Promise<void> {
    let value = Object.create(null);
    value[key] = val;

    return new Promise((resolve) => {
        chrome.storage.local.set(value, () => {
            resolve();
        });
    });
}


