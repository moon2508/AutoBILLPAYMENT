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
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGP+PCw4YRkXx+tS3S/cIHEdPa1eGcNAoeFVnUzrbmx6zE7PbNwixBsmkrzn2FnkCx9MdCXDbUPt72axoKeBDl10ARM8NpWMoj+s2OEy3LsZvNId5uyyg24BL/EXJ9zqqwkJDZr8p1lzQuqWca1dVlMfJRY9Xa7cHtfV9Js/Hl8DAgMBAAE=
-----END PUBLIC KEY-----`;
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
        const data = cy.log(response.body.data);
        const signature = cy.log(response.body.signature);
        Cypress.env('reference_code', response.body.data.reference_code);
        
        
    
   
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

const crypto = require('crypto');

Cypress.Commands.add('verifySignature', (data, signature, publicKey) => {
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(data);
  const signatureBuffer = Buffer.from(signature, 'base64');
  const publicKeyBuffer = Buffer.from(publicKey, 'utf8');
  const isValid = verifier.verify(publicKeyBuffer, signatureBuffer);
  return isValid ? 'Verify hợp lệ' : 'Verify sai';
});


