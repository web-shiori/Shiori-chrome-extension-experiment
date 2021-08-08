chrome.runtime.onMessage.addListener((request) => {
    console.log(`呼び出されたンゴ: ${request.data}`)
    console.log(`呼び出されたンゴ: ${request.videoPlayBackPosition}`)
    setVideoPlayBackPosition(request.videoPlayBackPosition)
    setScrollPosition(request.positionX, request.positionY)
    console.log(`呼び出されたンゴ: ${request.positionY}`)
})

function setVideoPlayBackPosition(videoPlayBackPosition: number) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        // @ts-ignore
        chrome.tabs.executeScript(tabs[0].id, {
            code: `const videoPlayBackPosition = ` + videoPlayBackPosition
        },() => {
            // alert(`videoPlayBackPositio: ${videoPlayBackPosition}`)
            // @ts-ignore
            chrome.tabs.executeScript(tabs[0].id, {
                code: `
                    document.getElementsByTagName('video')[0].currentTime = videoPlayBackPosition;
                `
            }, () => {
                // alert("done setVideoPlayBackPosition")
            })
        })
    })
}

function setScrollPosition(scrollPositionX: number, scrollPositionY: number) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        // @ts-ignore
        chrome.tabs.executeScript(tabs[0].id, {
            code: `
                const scrollPositionX = ${scrollPositionX}
                const scrollPositionY = ${scrollPositionY}
            `
        },() => {
            // @ts-ignore
            chrome.tabs.executeScript(tabs[0].id, {
                code: `
                    window.scrollTo(scrollPositionX, scrollPositionY);
                `
            }, () => {
                // alert("done setScrollPositionY")
            })
        })
    })
}
