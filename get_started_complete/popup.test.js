const chrome = require('sinon-chrome/extensions')

describe('popup', () => {
    it('should load color from storage', () => {
        document.body.innerHTML = `
            <button id="changeColor"></button>
        `
        // You need to make the mocked chrome api available to 
        // the popup script
        window.chrome = chrome
        // Stub the behaviour of chrome.storage.sync.get
        chrome.storage.sync.get.yields({'color': '#ff0000'})
        
        require('./popup')
        const changeColor = document.getElementById('changeColor')
        expect(changeColor.style.backgroundColor).toEqual('rgb(255, 0, 0)')
        expect(changeColor.value).toEqual('#ff0000')
    })
})