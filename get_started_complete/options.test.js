const chrome = require('sinon-chrome/extensions')
const sinon = require('sinon')
const rgbHex = require('rgb-hex')

describe('options', () => {

    beforeEach(() => {
        jest.resetModules()
    })

    describe('buttons', () => {
        let buttons, consoleLogSpy
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="buttonDiv"></div>
            `
            window.chrome = chrome
            consoleLogSpy = jest.spyOn(console, 'log')
            require('./options')
            const buttonDiv = document.getElementById('buttonDiv')
            buttons = Array.from(buttonDiv.querySelectorAll('button'))
        })

        afterEach(() => {
            consoleLogSpy.mockRestore();
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

        it('should trigger chrome.storage.sync.set with color', () => {
            buttons.forEach((button) => {
                const color = button.style.backgroundColor
                button.click()
                /**
                 * Please recognize, that we are only interested in the color to be stored
                 * by chrome.storage.sync.set. 
                 * Since the stub for chrome.storage.sync.set seems to convert the hex color of form
                 * 
                 * #ff0000
                 * to
                 * rgb (255,0,0)
                 * we have to do this calculation the otherway round with rgbHex from 
                 * https://www.npmjs.com/package/rgb-hex
                 * to check the equality of the colors
                 * 
                 * The callback, that will be evaluated afterwards
                 * we can represent with a kind of function placeholder for any kind of function
                 * realized by a matcher from sinon
                */
                sinon.assert.calledWith(
                    chrome.storage.sync.set, 
                    { color: '#'+rgbHex(color) },
                    sinon.match.func
                )
            })
        })

        /**
         * It would have been a nice test, to check if the callback of chrome.storage.syn.set does
         * what was expected in its call back (to call console.log)
         * But as it turns out, the callback does not seem to be called in the same event loop iteration
         * as the click for the button. Additionally, since it is a simple callback and no promise or
         * similar accessable "event in the future", you can not tell when it will be processed and
         * take measures to implement it accordingly. Therefore it seems to me to be impossible to test
         * without changing the original code. Also the call to console.log might be something that
         * can be omitted for tests, since there is nothing else this callback does.
         * If the callback would do more, I would highly recommend it to refactor it to be accessable as
         * regular function or method and test that instead, without the callback burdon of chrome.
         * 
         * PS: There is a possibility to test the callback of chrome.storage.sync.set: By calling sinons yield function on it.
         * chrome.storage.syn.set.yield()
         * But when you have a look at the current implementiation, you will see, that the color value used byconsole.log
         * is not passed in the callback (or at least it is not used from there). Instead the "item" from  the outer 
         * button creation loop, from the closure, is used. So we can not pass in the color value by yielding
         */
        xit('should trigger chrome.storage.sync.set with color', () => {
            buttons.forEach((button, index) => {
                const color = button.style.backgroundColor
                button.click()
          
                expect(consoleLogSpy.mock.calls).toBe(`color is ${color}`)
            })
        })
    })

})