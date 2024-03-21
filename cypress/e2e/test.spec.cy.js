const crypto = require('crypto');

const data = '{ "reference_code": "1706734900099", "final_status": "00", "message": "Yeu cau giao dich - Thanh cong", "partner_trans_id": "HangPTDV_GETBILL57311202457", "billing_code": "PD100000", "service_code": "TV_FPT", "cust_name": "Imedia", "billingAddress": "36 Hoang Cau, P.O Cho Dua, Q.Dong Da, TP.Ha Noi", "partial_payment": false, "packages": { "package_info": [ { "id_package": "1018262", "number_of_month": "12", "amount": 2640000, "promotion": { "value": 3, "description": "đóng trước 12 tháng , tặng cước 3 tháng gói cước Net1plus đến Net5plus" } }, { "id_package": "1017888", "number_of_month": "6", "amount": 1320000, "promotion": { "value": 1, "description": "Đóng trước 6 tháng gói cước Net2plus đến Net5plus ,tặng cước 1 tháng" } }';
const signature = 'V51zW8wcSs4ccoXr6OLDxXBlLm6+3qtfzcwLPHOYY++JgsReAa87JCLks4HWBOn0e7qBL1CrD2hUraQaxw620jeeKmfqvnS8lar1T5vnQZXARu5/l1aPLD996X/iCmhP/ge+l+yqdxBN5Fa08vmYsFUdQZS/8eGjd7+EJ1owZuo=';
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGP+PCw4YRkXx+tS3S/cIHEdPa1eGcNAoeFVnUzrbmx6zE7PbNwixBsmkrzn2FnkCx9MdCXDbUPt72axoKeBDl10ARM8NpWMoj+s2OEy3LsZvNId5uyyg24BL/EXJ9zqqwkJDZr8p1lzQuqWca1dVlMfJRY9Xa7cHtfV9Js/Hl8DAgMBAAE=
-----END PUBLIC KEY-----`;



describe('Verification', () => {
  it('should verify the signature', () => {
    cy.verifySignature(data, signature, publicKey).then(result => {
        expect(result).to.equal('Verify hợp lệ');
      });
  });
});