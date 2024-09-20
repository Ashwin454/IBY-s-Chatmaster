const cloudinary = require("../utils/cloudinary");
exports.uploadImageFile = async (req, res, next) => {
    try {
    const imgURL="https://via.placeholder.com/150/000000/FFFFFF/?text=Profile"
    if(req.files && req.files.photo){
      const file = req.files.photo;
        
      // Upload the file to Cloudinary
      await cloudinary.uploader.upload(file.tempFilePath, { folder: 'profile_pics' }, (err, result) => {
        if (err) {
          console.error("Cloudinary upload error:", err);
          return res.status(500).json({
            success: false,
            message: "Error uploading to Cloudinary"
          });
        }
        // Send success response with the uploaded file details
        const imgURL=result.url;
        req.imgURL=imgURL;
        console.log("aaaaaaaaaaaa: ",req.imgURL);
      });
    }
  
    } catch (error) {
      console.error("Server error during upload:", error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }finally{
        next();
    }
  };
