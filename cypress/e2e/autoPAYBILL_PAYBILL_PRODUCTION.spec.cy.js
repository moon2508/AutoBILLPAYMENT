const forge = require('node-forge');
//Private key của dịch vụ Bill là dạng pkcs8, cho nên cần ký trên private key pkcs8
function signDataWithRSA(data, privateKeyData) {
  const privateKeyPem = forge.pki.privateKeyFromPem(privateKeyData);
  const md = forge.md.sha256.create();
  md.update(data, 'utf8');
  const signature = privateKeyPem.sign(md);

  return forge.util.encode64(signature);
}
//khai báo private key pkcs8
const privateKeyData = `-----BEGIN RSA PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAO+N1hxtxzObXrat
KKtplV42JES0WLF1x9gQWxlxfHZvlnswHDuyGJcTGEs1FcKBmsMvB84exuMxC93V
eyq82J4ADZa0IKsQ8pW19+JMz0Z+vVPVgwR2h+KJDPpXCjKw5HSZkbgm2oJ6sBCE
KTy49BjI0Rn0V4Xi52K0MkXX696zAgMBAAECgYEA6XI1Z3rrlzUf9bGFYpYAA9GL
QpDlpfp7h+lYfdEEU36nDOFzghEquX7YO+I9lFEs+mzIlGuVsi1HvSSfZKSoCl6S
msbVUWkZEYPLhSG5ikpsb5DZnMsT5W/yl8N9HcZsO9C1Cyto0EgvZxnNOjdf4Rsw
Zhq63C7cI4lUrO4g4NECQQD8DOMO/5+vYiHZhgiLUdnvEyqYBRXcZ4TJdZReF6yU
Qd8nG70My1zmk5tptELqYCwup2VT2ziNEyqHXLNwp8SPAkEA807R5QXBHKh36gVh
OfrCKBOvou59N8gho6D0m1Ty6uIFB2rUe638Dj15MfHehf5UPzbnbskfj4AdHuBO
KUn9nQJAcBrXPsuJXbta7OIFmNnOAdzXfAf/Ain00JoAZJ1JACQQOdfHjRJCfre2
TxyDCrW90P5ZPiPqEi0tJEmh8gBclwJAN8Ipce3WqqWlDXl8JZhk5GBWkOVMxvrT
UrdxNyPJo7B2bJO77DgcGntWCe8fCuAVGIORmB75X56BjfDjmKy/NQJBAMtS+ib2
pqdRjcVPUuN3Qjtzw9vD9nx5FfhJDOUqqee3Q3uEp+jFPuUk8kSXrL+3wTz55Rly
3PFIBeCC9S9PoXk=
    -----END RSA PRIVATE KEY-----`;

// tạo requestID random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const randomNum = getRandomInt(1, 100);
// get date
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
const day = currentDate.getDate();
const hour = currentDate.getHours();
const minute = currentDate.getMinutes();
const seconds = currentDate.getSeconds();
const formattedDate = `${day}${month}${year}`;
const formattedTime = `${hour}${minute}${seconds}`;

//Khai báo các thông tin 
// const url_base = 'http://192.168.100.151:8080/v1/sandbox/services/paybill';
const url_base = 'https://billpayment.imediatech.com.vn/v1/services/paybill';

const username = 'test_bill';
const password = 'Test123!@#';
const service_code = 'VT_MOBILE_POST_PAID';
const billing_code = '0989859197';

// const service_code = 'KPLUS';
// const billing_code = '135220683434';

// const service_code = 'POSTPAID_TELCO_VMS';
// const billing_code = '0902284696';

// const service_code = 'POSTPAID_TELCO_VNP';
// const billing_code = '0914564322';

describe('AUTOPAYBILL PAYBILL', () => {
  beforeEach(() => {
    const requestID = 'HangPTDV_GETBILL_' +formattedDate+ formattedTime+ randomNum;
    const rqID = requestID;
    cy.log(rqID);
    // const service_code = 'TPB';
    
    const data_getBill = 'get_bill'+ '#'+ username + '#' + password +'#' + rqID + '#' +billing_code+ '#' + service_code;
    const signature = signDataWithRSA(data_getBill,privateKeyData);
    cy.log(data_getBill);
    cy.log(signature)
    // cy.getBILL(username,password,service_code,billing_code,rqID,signature,url_base);
    // cy.getBILL(username,password,service_code,billing_code,rqID,signature,url_base);
    
});

  it('PAYBILL', () => {
    // const reference_code = '1711045779434';
    cy.wait(500);
    const reference_code = Cypress.env('reference_code');
    cy.log('reference_code:'+ reference_code);
    const requestID = 'HangPTDV_PAYBILL_'+formattedDate+ formattedTime+ randomNum*randomNum;
    const rqID = requestID;
    cy.log(rqID);
    // const service_code = 'TPB';
    
    // const amount = Cypress.env('amount_getbill');  
    const amount = '1000';  
    cy.log('amount_paybill:'+ amount);
    const data_getBill = 'pay_bill'+ '#'+ username + '#' + password +'#' + rqID + '#' +billing_code+ '#' + service_code+ '#'+reference_code+ '#'+ amount;
    const signature = signDataWithRSA(data_getBill,privateKeyData);
    cy.log(data_getBill)
    cy.log(signature)
    cy.payBILL(username,password,service_code,billing_code,rqID,reference_code,signature,amount,url_base);
});

});