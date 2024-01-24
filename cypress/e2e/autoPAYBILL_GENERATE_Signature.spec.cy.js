const forge = require('node-forge');


//Private key của dịch vụ Bill là dạng pkcs8, cho nên cần ký trên private key pkcs8
function signDataWithRSA(data, privateKeyData) {
  const privateKeyPem = forge.pki.privateKeyFromPem(privateKeyData);
  const md = forge.md.sha256.create();
  md.update(data, 'utf8');
  const signature = privateKeyPem.sign(md);

  return forge.util.encode64(signature);
}
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
describe('Example Test', () => {
  it('Generate signature in BILL PAYMENT', () => {
    const data_getBill = 'get_bill#integrate_account#a1ec3b73f427c514ab64ce99c891b73f#HangPTDV_08122023_12122023#0912345678#PHONE_VIETTEL_TS';
    const signature = signDataWithRSA(data_getBill,privateKeyData);
    cy.log(signature)
 
  });
});