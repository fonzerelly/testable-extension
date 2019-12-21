const chrome = require('sinon-chrome/extensions')

describe('popup', () => {
    it('should load color from storage', () => {
        document.body.innerHTML = `
            <button id="changeColor"></button>
        `
        // You need to make the mocked chrome api available to 
        // the popup script
        window.chrome = chrome
        require('./popup')
    })
})