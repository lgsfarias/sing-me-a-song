/* eslint-disable no-undef */
/// <reference types="cypress" />

const URL = 'http://localhost:3000/';

describe('app test', () => {
  beforeEach(() => {
    cy.visit(URL);
  });

  it('should go to top home page', () => {
    cy.get('.sc-gsnTZi > :nth-child(1)').click();
    cy.url().should('eq', URL);
  });

  it('should go to top recommendations page', () => {
    cy.get('.sc-gsnTZi > :nth-child(2)').click();
    cy.url().should('eq', `${URL}top`);
  });

  it('should go to top random page', () => {
    cy.get('.sc-gsnTZi > :nth-child(3)').click();
    cy.url().should('eq', `${URL}random`);
  });

  it('should add a recommendation', () => {
    cy.get('input[placeholder="Name"]').type('Michael Jackson');
    cy.get('[placeholder="https://youtu.be/..."]').type(
      'https://www.youtube.com/watch?v=Hxgo-Qu-ZZE',
    );

    cy.intercept('POST', '/recommendations').as('postRecommendation');
    cy.get('.sc-jSMfEi').click();
    cy.wait('@postRecommendation');
    cy.get('div.sc-iBkjds.dSsckR').should('contain', 'Michael Jackson');
  });

  it('should upvote a recommendation', () => {
    cy.intercept('POST', '/recommendations/1/upvote').as(
      'upvoteRecommendation',
    );
    cy.get('div.sc-iBkjds.dSsckR svg:first').click();
    cy.wait('@upvoteRecommendation');
    cy.get('div.sc-iBkjds.dSsckR').should('contain', '1');
  });

  it('should downvote a recommendation', () => {
    cy.intercept('POST', '/recommendations/1/downvote').as(
      'downvoteRecommendation',
    );
    cy.get('div.sc-iBkjds.dSsckR svg:last').click();
    cy.wait('@downvoteRecommendation');
    cy.get('div.sc-iBkjds.dSsckR').should('contain', '0');
  });
});
