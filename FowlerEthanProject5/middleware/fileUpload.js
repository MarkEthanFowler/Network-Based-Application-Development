const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')//specify where the file will go in the file structure
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)//used to create a unique name
      cb(null, uniqueSuffix + path.extname(file.originalname))//creates the unique name with the variable above
    }
  });

  const fileFilter = (req, file, cb) =>{
    const mimeTypes = ['image/png', 'image/jpeg'];
    if(mimeTypes.includes(file.mimetype))
    {
        return cb(null, true);
    }
    else
    {
        return cb(new Error('Invalid file type. Only png and jpeg image files are allowed.'), false);
    }
  };

exports.upload = multer({storage, fileFilter}).single('image');