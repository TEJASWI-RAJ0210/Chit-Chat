import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = Router();

// POST /api/upload
// Accepts a single file under the field name "file"
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Upload local temp file → Cloudinary
    const result = await uploadToCloudinary(req.file.path);

    if (!result) {
      return res.status(500).json({ message: 'Cloudinary upload failed' });
    }

    return res.status(200).json({
      url:          result.secure_url,   // HTTPS URL to store in DB
      publicId:     result.public_id,    // useful if you want to delete later
      resourceType: result.resource_type, // image / video / raw
      format:       result.format,        // jpg, png, pdf, etc.
      bytes:        result.bytes,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

export default router;