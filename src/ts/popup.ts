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


