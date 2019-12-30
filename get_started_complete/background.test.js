const chrome = require('sinon-chrome/extensions')
const sinon = require('sinon')

describe('background', () => {
    beforeEach(() => {
        jest.resetModules()
    })
    beforeEach(() => {
        window.chrome = chrome

        /**
         * I would have expected, that this function is also part of sinon-chrome,
         * but I could not find it. Therefore I have to mock onPageChanged.removeRules
         * myself.
         * Please recognize the minimalistic reimplementation, that calls the passed 
         * in callback. 
         */
        chrome.declarativeContent.onPageChanged.removeRules = jest.fn().mockImplementation((_, cb)=> {
            cb()
        })
        
        require('./background')
        chrome.runtime.onInstalled.addListener.yield() // by this trick we can mock the onInstalled-Event
    })
    describe('onInstalled', () => {
        it('should store default color', () => {
            sinon.assert.calledWith(chrome.storage.sync.set, { color: '#3aa757' }, sinon.match.func)
        })

        /** 
         * as described in options the test for console.log of chrome.storage.syn.set 
         * seems to be unnecessary
         * 
        */

        it('should remove rules', () => {
            expect(chrome.declarativeContent.onPageChanged.removeRules).toHaveBeenCalled()
        })
    })
})