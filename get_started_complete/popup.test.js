const chrome = require('sinon-chrome/extensions')
const sinon = require('sinon')

describe('popup', () => {
    beforeEach(() => {
        // Modules-code evaluated by rerquire only gets evaluated once
        // so we have to reset the module registry of jest
        jest.resetModules()
    })
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

    it('should run backgroundcolor script in tab on click', () => {
        document.body.innerHTML = `
            <button id="changeColor"></button>
        `
        window.chrome = chrome
        chrome.storage.sync.get.yields({'color': '#ff0000'})
        const fakeTab =  {
            id: 42
        }
        chrome.tabs.query.yields([fakeTab]) // be sure to pass an array as the api expects it
        
        require('./popup')
        const changeColor = document.getElementById('changeColor')
        changeColor.click();
        sinon.assert.calledWith(chrome.tabs.executeScript, 42, {code: 'document.body.style.backgroundColor = "#ff0000";'})
    })
})