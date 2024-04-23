const forge = require('node-forge');
const crypto = require('crypto');
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
function getRequestId(text){
    // get random 4 characters
    const min = Math.ceil(1);
    const max = Math.floor(10000);
    const randomNumbers = Math.floor(Math.random() * (max - min + 1) + min);
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
    const requestID = text + formattedDate + formattedTime +randomNumbers ;
    return requestID;
}

//Khai báo các thông tin 

const url_base = 'http://222.252.17.162:8080/v1/sandbox/services/paybill';
const username = 'integrate_account';
const password = 'a1ec3b73f427c514ab64ce99c891b73f';


function getbill_gateway(username,password,service_code,billing_code,url_base){
    const rqID = getRequestId('HangPTDV_GETBILL_');
      cy.log("RequestID: "+ rqID);
    const data_getBill = 'get_bill' + '#' + username + '#' + password + '#' + rqID + '#' + billing_code + '#' + service_code; 
    cy.log("DataGenerateSignature: "+ data_getBill);
    const signature = signDataWithRSA(data_getBill,privateKeyData);
      
      cy.log(  'Signature:' + signature);
      cy.getBILL(username,password,service_code,billing_code,rqID,signature,url_base);

}


function paybill_gateway(username,password,service_code,billing_code,amount,url_base){
    // get reference_code from GETBLL
    const reference_code = Cypress.env('reference_code');   
     
    cy.log('reference_code_paybill:'+ reference_code);
    
  
    const rqID = getRequestId('HangPTDV_PAYBILL_')
    cy.log("RequestID: "+ rqID);
    
    const data_payBill = 'pay_bill'+ '#'+ username + '#' + password +'#' + rqID + '#' +billing_code+ '#' + service_code+ '#'+reference_code+ '#'+ amount;
    const signature = signDataWithRSA(data_payBill,privateKeyData);
    cy.log("DataGenerateSignature: "+ data_payBill)
    cy.log(  'Signature:' + signature);
    cy.payBILL(username,password,service_code,billing_code,rqID,reference_code,signature,amount,url_base);

}
function gateway_PAYMENT(username,password,service_code,billing_code,url_base){
    describe('AUTOPAYBILL GETBILL', () => {
        beforeEach(() => {
            // getbill_gateway(username,password,'KPLUS','135220683434',url_base);
            getbill_gateway(username,password,service_code,billing_code,url_base);
    
        });
    
        it.skip('Scenarios: GETBILL', () => {
          getbill_gateway(username,password,service_code,billing_code,url_base);
    
        //GETBILL K+
        //   getbill_gateway(username,password,'KPLUS','135220683434',url_base);
    
        //GET BILL Trả sau VNP
        // getbill_gateway(username,password,'POSTPAID_TELCO_VNP','0914564322',url_base);
    
        // GETBILL Trả sau VMS
        // getbill_gateway(username,password,'POSTPAID_TELCO_VMS','0936225202',url_base);
    
         
      });
    
      it('Scenarios: PAYBILL',()=>{
        const amount = Cypress.env('amount_getbill');  
        cy.log('amount_paybill:'+ amount);
        const amount_TV = Cypress.env('amount_getbill_TV');  
        cy.log('amount_paybill_TV:'+ amount_TV);
        
        if(service_code == 'KPLUS'){
            paybill_gateway(username,password,service_code,billing_code,amount_TV,url_base);
        }else{
            paybill_gateway(username,password,service_code,billing_code,amount,url_base);
      }
        // paybill EVN
        // paybill_gateway(username,password,'EVN','PD100000',amount,url_base);
        // paybill K+
        // paybill_gateway(username,password,'KPLUS','135220683434',amount_TV,url_base);
    
        
    
      });
    
    });
}



// gateway_PAYMENT(username,password,'EVN','PD100000',url_base);
// gateway_PAYMENT(username,password,'KPLUS','135220683434',url_base);
// gateway_PAYMENT(username,password,'POSTPAID_TELCO_VMS','0905675678',url_base);
// gateway_PAYMENT(username,password,'POSTPAID_TELCO_VNP','0914564322',url_base);
gateway_PAYMENT(username,password,'VINAPHONE_COMBO','0949939590',url_base);
