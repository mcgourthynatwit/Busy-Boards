import CryptoJS from "crypto-js";
const secretKey = process.env.REACT_APP_SECRET_KEY


const encryptData = (pat) => {
    console.log('orginal', pat)
    const secretKey = process.env.REACT_APP_SECRET_KEY
    console.log('key', secretKey)
    const data = CryptoJS.AES.encrypt(
        JSON.stringify(pat),
        secretKey
      ).toString();
    console.log('encrypted', data)
    
    return data;
}


const decryptData = (encryptedPat) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPat, secretKey);
    let decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    console.log(secretKey)
    console.log('Decrypted:', decryptedData);
    decryptedData = decryptedData.replace(/"([^"]+)"/, '$1');
    console.log('Decrypted:', decryptedData);
    return decryptedData;
}

export {encryptData, decryptData}