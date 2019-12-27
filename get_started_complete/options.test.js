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

        /** 
         * Here it is a bit unclear what to test. The buttons depend
         * on the kButtonColors-Array, which could have been passed
         * directly into the contructOptions call like this:
         * constructOptions(['#ff0000', '#00ff00', '#0000ff'])
         * 
         * So the colors could be changed very easily and therefore
         * should be seen as configuration. This  means, it does not
         * make sense to test for the four passed in colors exactly.
         * On behalf of this, I decided to test for a property that
         * should be true for any configuration - that each occuring color
         * only occurse once.
         */
         it('should have 4 different colors', () => {
            const colors = buttons.map((btn) => btn.style.backgroundColor)
            colors.forEach((color, index) => {
                expect(colors.slice(0, index).indexOf(color)).toBe(-1)
                expect(colors.slice(index + 1, colors.length).indexOf(color)).toBe(-1)
            })
        })
    })

})