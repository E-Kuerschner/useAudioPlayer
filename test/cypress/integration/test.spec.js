context("Testing", () => {
    let audioContext = null
    beforeEach(() => {
        audioContext = null
        cy.visit("http://localhost:1234", {
            onBeforeLoad: win => {
                const originalAudio = win.AudioContext
                cy.stub(win, "AudioContext", () => {
                    const aud = new originalAudio()
                    audioContext = aud
                    return aud
                })
            }
        })
        cy.contains("Spotify-ish").click()
    })

    it("has something on screen", () => {
        cy.contains("cats")
            .click()
            .then(() => {
                console.log(audioContext)
                expect(audioContext.state).to.equal("running")
                // eslint-disable-next-line cypress/no-unnecessary-waiting
                cy.wait(4000).then(() => {
                    console.log("HERHEH")
                    cy.get(".playBar__playButton")
                        .click()
                        .then(() => {
                            expect(audioContext.currentTime).to.be.greaterThan(
                                4
                            )
                        })
                })
            })
    })
})
