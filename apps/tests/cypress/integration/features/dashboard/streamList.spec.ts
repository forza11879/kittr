/// <reference types="cypress" />

import user from "../../../fixtures/login.json"
import newChannel from "../../../fixtures/mongoose/newChannel.json"

describe("Channel List View", () => {
	beforeEach(() => {
		cy.visit("/dashboard")
		cy.viewport("macbook-16")
	})

	it("Renders", () => {
		cy.login(user.email, user.password)
		cy.contains("thetestchannel")
	})

	it("Opens a channel", () => {
		cy.get("[data-cy=thetestchannel-channel-button]").click()
		cy.contains("SUBSCRIPTION SETTINGS")
	})

	it("Disallow similar named channels", () => {
		cy.get("[data-cy=create-new-channel]").click()
		cy.get("[name=displayNameInput").type("anthonysheww")
		cy.get("[data-cy=create-channel-button]").click()
		cy.contains("That name is too similar to another channel")
	})

	it("Creates a new channel", () => {
		cy.get("[data-cy=create-new-channel]").click()
		cy.get("[name=displayNameInput").type(newChannel.displayName)
		cy.get("[data-cy=create-channel-button]").click()
		cy.get(`[data-cy=${newChannel.displayName}-channel-button]`)
	})

	it("Reloads the channel list", () => {
		cy.get("[data-cy=anthonysheww-channel-button]")
		cy.get("[data-cy=renew-svg]").click()
		cy.get("[data-cy=anthonysheww-channel-button]")
	})
})
