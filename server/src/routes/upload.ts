import express from 'express';
import { CloudinaryService } from '../services/cloudinaryService';
import { authenticate } from '../middleware/auth';
import { uploadMultiple, uploadSingle } from '../middleware/upload';

const router = express.Router();

// Upload multiple images
router.post('/images', authenticate, uploadMultiple, async (req, res) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided',
      });
    }

    const files = req.files as Express.Multer.File[];
    const uploadResults = await CloudinaryService.uploadMultipleImages(files);

    const imageUrls = uploadResults.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: { images: imageUrls },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message,
    });
  }
});

// Upload single image (for avatar)
router.post('/avatar', authenticate, uploadSingle, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image provided',
      });
    }

    const uploadResult = await CloudinaryService.uploadImage(
      req.file.buffer,
      req.file.originalname,
      'avatars'
    );

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        image: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error uploading avatar',
      error: error.message,
    });
  }
});

export default router;
