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
const formattedDate = `${day}${month}${year}`;
const requestID = 'HangPTDV_GETBILL' + randomNum  + formattedDate + randomNum;
//Khai báo các thông tin 
const url_base = 'http://222.252.17.162:8080/v1/sandbox/services/paybill'

const username = 'integrate_account';
const password = 'a1ec3b73f427c514ab64ce99c891b73f';

describe('AUTOPAYBILL GETBILL', () => {
  it('GETBILL', () => {
    const rqID = requestID;
    cy.log(rqID);
    const service_code = 'TV_FPT';
    const billing_code = 'PD100000';
    const data_getBill = 'get_bill'+ '#'+ username + '#' + password +'#' + rqID + '#' +billing_code+ '#' + service_code;
    const signature = signDataWithRSA(data_getBill,privateKeyData);
    cy.log(data_getBill)
    cy.log(signature)
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
});





});