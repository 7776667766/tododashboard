const forge = require('node-forge');
const Card = require('../models/CardModel');

const encryptData = (data, encryptionKey) => {
    const keyBuffer = forge.util.createBuffer(forge.util.hexToBytes(encryptionKey));

    const cipher = forge.cipher.createCipher('AES-CBC', keyBuffer);

    const iv = forge.random.getBytesSync(16);

    cipher.start({ iv });

    cipher.update(forge.util.createBuffer(data, 'utf-8'));

    cipher.finish();

    return forge.util.encode64(cipher.output.getBytes());
};

const encryptionKey = 'aabbccddeeff00112233445566778899';
const encryptedData = encryptData('mySensitiveData', encryptionKey);
console.log('Encrypted Data:', encryptedData);


const addCardApi = async (req, res, next) => {
    try {
        const { name, credit, days, cvv } = req.body;
        console.log(req.body)

        if (!name) {
            return res.status(400).json(
                { status: "error", message: "Invalid CardHolderName" }
            );
        }
        

        const encodedCardNumber = encryptData(credit, encryptionKey);
        const encodedCVV = encryptData(cvv, encryptionKey);

        console.log("ENCODED CARD && ENCODED CVV", "", encodedCardNumber, encodedCVV)

        const newCard = await Card.create({
            name,
            credit: encodedCardNumber,
            days,
            cvv: encodedCVV,
        });

        res.status(201).json({ status: 'success', data: newCard });
    } catch (error) {
        console.error('Error in Adding Card Details', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

module.exports = {
    addCardApi,
};
