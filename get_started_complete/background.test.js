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
        chrome.declarativeContent.onPageChanged.removeRules = jest.fn().mockImplementation((_, cb) => {
            cb()
        })
        
        chrome.declarativeContent.onPageChanged.addRules = jest.fn()

        /**
         * Please recognize, that we would have to provide a mock for the PageStateMatcher, since 
         * it is used in the code directly. If the code would be structured differently, you might
         * leave out the this implementation. 
         */
        chrome.declarativeContent.PageStateMatcher = jest.fn().mockImplementation((paramObj) => {
            return paramObj
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

        it('should add rules again', () => {
            expect(chrome.declarativeContent.onPageChanged.addRules).toHaveBeenCalled()
        })

        /** 
         * Since most of the implementation of addRules contains api-calls to 
         * chrome, that we only can mock manually, you might be tempted to be
         * satisfied with the simplified test above.
         * But the call contains one specific element, the hostEquals-Entry
         * in the PageStateMatcher. Therefore we should test it anyway.
         */
        it('should ensure to adress host "developer.chrome.com"', () => {
            const rule = chrome.declarativeContent.onPageChanged.addRules.mock.calls[0][0][0]
            expect(rule.conditions[0].pageUrl.hostEquals).toEqual('developer.chrome.com')
        })
    })
})