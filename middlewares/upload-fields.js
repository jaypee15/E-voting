const multer = require('multer');
const path = require('path');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define your upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Dynamic field handler for multer
const dynamicUpload = (req, res, next) => {
  console.log(req.body)
  const uploadFields = [];
  const contestantKeys = Object.keys(req.body).filter(key => key.startsWith('contestants'));

  contestantKeys.forEach(key => {
    const [, index] = key.match(/contestants\[(\d+)]\./);
    if (!uploadFields.some(field => field.name === `contestants[${index}].avatar`)) {
      uploadFields.push({ name: `contestants[${index}].avatar` });
    }
  });

  const uploadDynamic = upload.fields(uploadFields);
  uploadDynamic(req, res, next);
};

module.exports = dynamicUpload;
