const chrome = require('sinon-chrome/extensions')
const sinon = require('sinon')

describe('options', () => {

    beforeEach(() => {
        jest.resetModules()
    })

    describe('buttons', () => {
        let buttons
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="buttonDiv"></div>
            `
            window.chrome = chrome
            require('./options')
            const buttonDiv = document.getElementById('buttonDiv')
            buttons = Array.from(buttonDiv.querySelectorAll('button'))
        })
        it('should create 4 buttons with four colors', () => {
            expect(buttons.length).toEqual(4)
        })
    })

})