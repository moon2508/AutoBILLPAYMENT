// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('getBILL', (username,password,service_code,billing_code,rqID,signature,url_base)=>{
    cy.request({
        method: 'POST',
        url: url_base,
        headers: {
          'Content-Type': 'application/json',
  
         
        },
        body: `
        {"pr_code":"1009",
        "message":
        {"username":"${username}","password":"${password}","service_code":"${service_code}",
        "billing_code":"${billing_code}",
        "partner_trans_id":"${rqID}",
        "authkey":"${signature}"}}
          `,
      }).then((response) => {
        // Kiểm tra phản hồi
        expect(response.status).to.eq(200);
        cy.log('Response body:'+ JSON.stringify(response.body, null, 2));
        cy.log(response.body.data.reference_code)
        
   
    });
})
Cypress.Commands.add('payBILL', (username,password,service_code,billing_code,rqID,reference_code,signature,amount,url_base)=>{
    cy.request({
        method: 'POST',
        url: url_base,
        headers: {
          'Content-Type': 'application/json',
  
         
        },
        body: `
        {
          "pr_code": "1010",
          "message": {
              "username": "${username}",
              "password": "${password}",
              "service_code": "${service_code}",
              "billing_code": "${billing_code}",
              "partner_trans_id": "${rqID}",
              "reference_code": "${reference_code}",
              "authkey": "${signature}",
              "amount": ${amount},
              "contact_id": "0912345678"
          }
      }
          `,
      }).then((response) => {
        // Kiểm tra phản hồi
        expect(response.status).to.eq(200);
        cy.log('Response body:'+ JSON.stringify(response.body, null, 2));
   
    });
})

