const crypto = require('crypto');

Cypress.Commands.add('verifySignature', (data, signature, publicKey) => {
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(data);
  const signatureBuffer = Buffer.from(signature, 'base64');
  const publicKeyBuffer = Buffer.from(publicKey, 'utf8');
  const isValid = verifier.verify(publicKeyBuffer, signatureBuffer);
  return isValid ? 'Verify hợp lệ' : 'Verify sai';
});

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
        
        
          cy.log("Amount_getbill_TV: "+ response.body.data.billingDetail[1].billAmount);
          Cypress.env('amount_getbill_TV', response.body.data.billingDetail[1].billAmount);
       
          cy.log('Response body:'+ JSON.stringify(response.body, null, 2));
          cy.log("Reference_code_getbill: "+ response.body.data.reference_code);
          cy.log("Amount_getbill: "+ response.body.data.amount);
         
          Cypress.env('reference_code', response.body.data.reference_code);
        Cypress.env('amount_getbill', response.body.data.amount);
        

        
        
        // const data = cy.log(response.body.data);
        // const signature = cy.log(response.body.signature);
        
        
        // export CYPRESS_reference_code_getbill=response.body.data.reference_code;
        
        
    
   
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

Cypress.Commands.add('getBILL_VNP_Combo', (username,password,service_code,billing_code,rqID,signature,url_base)=>{
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
      const datacombo = response.body.data.payment_info[1];
      
        cy.log('Response body:'+ JSON.stringify(response.body, null, 2));
        cy.log("Reference_code_getbill: "+ response.body.data.reference_code);
        cy.log("Amount_getbill: "+ response.body.data.amount);
        cy.log("ProductID_getbill: "+ datacombo.productId);
        cy.log("ProductCode_getbill: "+ datacombo.productCode);
        cy.log("ProductValue_getbill: "+ datacombo.productValue);
        Cypress.env('reference_code', response.body.data.reference_code);
      Cypress.env('amount_getbill', response.body.data.amount);
      Cypress.env('productId', datacombo.productId);
      Cypress.env('productCode', datacombo.productCode);
      Cypress.env('productValue', datacombo.productValue);

 
  });
})
Cypress.Commands.add('orderVNP_Combo', (username,password,service_code,billing_code,rqID,reference_code,signature,amount,url_base, productCode, productId, productValue)=>{
  cy.request({
      method: 'POST',
      url: url_base,
      headers: {
        'Content-Type': 'application/json',

       
      },
      body: `
      {
        "pr_code": "1015",
        "message": {
            "username": "${username}",
            "password": "${password}",
            "service_code": "${service_code}",
            "billing_code": "${billing_code}",
            "partner_trans_id": "${rqID}",
            "reference_code": "${reference_code}",
            "authkey": "${signature}",
            "amount": ${amount},
            "contact_id": "0912345678",
            "selectedItems":[{"productId":"${productId}","productCode":"${productCode}","productValue":${productValue}}]
        }
    }
        `,
    }).then((response) => {
      // Kiểm tra phản hồi
      expect(response.status).to.eq(200);
      cy.log('Response body:'+ JSON.stringify(response.body, null, 2));
 
  });
})
Cypress.Commands.add('paybillVNP_Combo', (username,password,service_code,billing_code,rqID,reference_code,signature,amount,url_base, productCode, productId, productValue, otp)=>{
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
            "contact_id": "0912345678",
            "selectedItems":[{"productId":"${productId}","productCode":"${productCode}","productValue":${productValue}}],
            "otp":"${otp}"
        }
    }
        `,
    }).then((response) => {
      // Kiểm tra phản hồi
      expect(response.status).to.eq(200);
      cy.log('Response body:'+ JSON.stringify(response.body, null, 2));
 
  });
})


