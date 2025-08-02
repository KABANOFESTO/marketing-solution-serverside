const uploader = require('../config/cloudinary');

const productImage = async (req) => {

    const tmp = req.files.imageUrl.tempFilePath;
    const Result = await uploader.upload(tmp, { folder: 'My-Brand' });
    return Result;
};



module.exports = productImage;