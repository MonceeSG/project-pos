const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'djeichzdq',
    api_key: '366485648979388',
    api_secret: 'S5q-SKrOQGLsDEwSbDY5wUdWuJc',
});

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        const base64Image = file.buffer.toString('base64');
        const output = cloudinary.uploader.upload(`data:${file.mimetype};base64,${base64Image}`, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}

module.exports = { uploadImage };