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
MIICXQIBAAKBgQDT2VtPTnzt9gOQ+uSYphPkSjSv6+3+Ubys0KQlcEfo6BFIbP5Z
nbCSxY/lpQ2AHnrZGB1eGq1fYF9J/w+op3ouJW4f5XGAfJa/8sKYZ3tmjAWpdj0y
KqJFc7MA/rMpNVctpmX3DJ70jHmkXICdLeGbsCwAdWrWjWQ55aZNBus1gwIDAQAB
AoGBAI9qs10SJpM2HB33K/CHZioDbn22O+0Syqc3rBhIVfY/vQuJ9fsXPOVv58Ww
ol4cxE/Z+m+tobdS18+RY7lqf9Qn0zQOZ4DSbHsaGN4eLDDJW4VJivsKHCHsfPiV
2ANM3hmTwBvI9XFAcT8E5CvXjekMynjgWvgmnwTBkKnXlmbBAkEA90Y02msgFxas
4NDyCRt64r7VmjFl1bdQMS6ExlJzdp60afPT0ZOH8K8XUJTnlW2wcGE6BkIrQx+Q
579Ur5SbowJBANtTIXlomVAOmPpp8Va3Tuof4br7bNex8aZkWfPz+PGZP87Azyka
rdb10t6D3IiOx+RbVwndz68oGJ8mVZ/KnKECQClowWsea3ZSXssbUp0B1Bdqu9yh
jxs2IqDJ2IRZxGpF85KWuY8sNKSyvaXJ+epFPzninlPz+si33Y1hti3dJh8CQBtI
3zw0WAZOmpdkgKKSEV4s8y8IwkSfHXneuBYSPuEHeJmnAN6TNBcu47nM262dXZ66
Ajz2/DRFH7ME2NgVI6ECQQCVt4OZODPtJfN49n/ouLERvZNVN4BxFm+UGkomwoc+
EXp8Ry6TYHTInCYUurwT+dDguMG1IWsheT2xDNTKGaNh
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
// const service_code = 'TPB';
// const billing_code = 'PD100000';

// const service_code = 'KPLUS';
// const billing_code = '135220683434';

const service_code = 'POSTPAID_TELCO_VMS';
const billing_code = '0902284696';

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
    cy.getBILL(username,password,service_code,billing_code,rqID,signature,url_base);
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
    
    const amount = Cypress.env('amount_getbill');  
    cy.log('amount_paybill:'+ amount);
    const data_getBill = 'pay_bill'+ '#'+ username + '#' + password +'#' + rqID + '#' +billing_code+ '#' + service_code+ '#'+reference_code+ '#'+ amount;
    const signature = signDataWithRSA(data_getBill,privateKeyData);
    cy.log(data_getBill)
    cy.log(signature)
    // cy.payBILL(username,password,service_code,billing_code,rqID,reference_code,signature,amount,url_base);
});

});