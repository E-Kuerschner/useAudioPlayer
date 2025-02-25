context("useAudioPlayer use cases for Spotify-like application", () => {
    let audioContext = null
    beforeEach(() => {
        audioContext = null
        cy.visit("http://localhost:1234", {
            onBeforeLoad: (win) => {
                const originalAudio = win.AudioContext
                cy.stub(win, "AudioContext", () => {
                    const aud = new originalAudio()
                    audioContext = aud
                    return aud
                })
            }
        })
        cy.contains("Sound Library").click()
    })

    it("can visualize playback time with a seek bar", () => {
        cy.contains("Sound Library").click()
        // eslint-disable-next-line  cypress/unsafe-to-chain-command
        cy.contains("cats")
            .click()
            .then(() => {
                expect(audioContext.state).to.equal("running")
                // eslint-disable-next-line cypress/no-unnecessary-waiting
                cy.wait(4000).then(() => {
                    // eslint-disable-next-line  cypress/unsafe-to-chain-command
                    cy.get("#pauseButton")
                        .click()
                        .then(() => {
                            expect(
                                audioContext.currentTime
                            ).to.be.approximately(4, 0.5)
                        })
                })
            })
    })
})
