const chrome = require('sinon-chrome/extensions')
const sinon = require('sinon')

describe('background', () => {
    beforeEach(() => {
        jest.resetModules()
    })
    beforeEach(() => {
        window.chrome = chrome
        require('./background')
        chrome.runtime.onInstalled.addListener.yield() // by this trick we can mock the onInstalled-Event
    })
    describe('onInstalled', () => {
        it('should store default color', () => {
            sinon.assert.calledWith(chrome.storage.sync.set, {color: '#3aa757'}, sinon.match.func)
        })

    })
})