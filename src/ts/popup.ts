interface MetaData {
    title: string;
    url: string;
    height: number;
    width: number;
    positionX: number;
    positionY: number;
    videoPlayBackPosition: number;
}


let data = {
    title: "",
    url: ""
}



function a() {
    console.log("a")
    chrome.tabs.getSelected(tab => {
        console.log("selected tab")
        console.log(tab.url)
        data.title = tab?.title ?? "hoge"
        data.url = tab?.url ?? "hoge"
        // alert(`tab.id: ${tab.id}`)
        // @ts-ignore
        chrome.tabs.executeScript(tab.id, {
            code: `
                document.getElementsByTagName('video')[0].currentTime;
            `
        }, function (result) {
            alert(result[0])
        })
        // alert(`tab.id: ${tab.id}`)
        console.log("end")
    })

}
            // var positionTop = String(Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop));
            // var positionLeft = String(Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft));


function i() {
    chrome.tabs.getSelected(tab => {
        console.log("selected tab")
        console.log(`url: ${tab.url}`)
        console.log(`title: ${tab.title}`)
        console.log(`height: ${tab.height}`)
        console.log(`width: ${tab.width}`)
        console.log("i(): end")
    })
}



//
const button = document.getElementById('button-get-currentTime')
button?.addEventListener('click', function () {
    a()
    i()
    console.log("unko")
})

const button_px = document.getElementById('button-get-positionX')
button_px?.addEventListener('click', function () {
    chrome.tabs.getSelected(tab => {
        // @ts-ignore
        chrome.tabs.executeScript(tab.id, {
            code: `
                String(Math.max(window.pageXOffset, document.documentElement.scrollLeft, document.body.scrollLeft));
            `
        }, function (result) {
            alert(result[0])
        })
    })
})

const button_py = document.getElementById('button-get-positionY')
button_py?.addEventListener('click', function () {
    chrome.tabs.getSelected(tab => {
        // @ts-ignore
        chrome.tabs.executeScript(tab.id, {
            code: `
                String(Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop));
            `
        }, function (result) {
            alert(result[0])
        })
    })
})

function getVideoPlayBackPosition(): number {
    chrome.tabs.getSelected(tab => {
        // @ts-ignore
        chrome.tabs.executeScript(tab.id, {
            code: `
                document.getElementsByTagName('video')[0].currentTime;
            `
        }, function (result) {
            return result[0]
        })
    })
    return 0
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
    // let a: number = 0
    // // a = await unko()
    // chrome.tabs.getSelected(tab => {
    //     // @ts-ignore
    //     chrome.tabs.executeScript(tab.id, {
    //         code: `
    //             String(Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop));
    //         `
    //     }, async (result) => {
    //         a = result[0]
    //     })
    // })
    // console.log(`a: ${a}`)
    // // blockTime(1000)
    // return a
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
    videoPlayBackPosition = getVideoPlayBackPosition()
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


