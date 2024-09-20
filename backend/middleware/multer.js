const multer = require('multer');

// Use multer's memory storage so the file isn't saved locally
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
