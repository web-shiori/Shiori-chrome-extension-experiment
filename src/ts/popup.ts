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

function getScrollPositionY(): number {
    chrome.tabs.getSelected(tab => {
        // @ts-ignore
        chrome.tabs.executeScript(tab.id, {
            code: `
                String(Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop));
            `
        }, function (result) {
            console.log("Y")
            console.log(result[0])
            console.log(typeof result[0])
            const a: number = result[0]
            console.log(a)
            return a
        })
    })
    return 0
}

function blockTime(timeout: number) {
    const startTime = Date.now();
    // `timeout`ミリ秒経過するまで無限ループをする
    while (true) {
        const diffTime = Date.now() - startTime;
        if (diffTime >= timeout) {
            return; // 指定時間経過したら関数の実行を終了
        }
    }
}

function getMetaData(): MetaData {
    let title = ""
    let url = ""
    let height = 0
    let width = 0
    let positionX = 0
    let positionY = 0
    let videoPlayBackPosition = 0

    chrome.tabs.getSelected(tab => {
        url = tab.url ?? "a"
        title = tab.title ?? ""
        height = tab.height ?? 0
        width = tab.width ?? 0
    })

    // blockTime(1000)
    positionX = getScrollPositionX()
    // blockTime(1000)
    positionY = getScrollPositionY()
    // blockTime(1000)
    videoPlayBackPosition = getVideoPlayBackPosition()
    // blockTime(1000)
    console.log("getMetaData")
    console.log(`title: ${title}`)
    console.log(`url: ${url}`)
    console.log(`py: ${positionY}`)
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
    const content: MetaData = getMetaData()
    console.log(`title: ${content.title}`)
    setToStorage(StorageKey, content)
    console.log(content.url)
})

const button_load = document.getElementById('button-load')
button_load?.addEventListener('click', function () {
    const res: Promise<MetaData | null> = getByStorage(StorageKey);
    console.log(res)
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


