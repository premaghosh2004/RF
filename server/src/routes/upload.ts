import express, { Request, Response } from 'express';
import { CloudinaryService } from '../services/cloudinaryService';
import { authenticate } from '../middleware/auth';
import { uploadMultiple, uploadSingle } from '../middleware/upload';

const router = express.Router();

// --------------------------
// Upload multiple images
// --------------------------
router.post('/images', authenticate, uploadMultiple, async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided',
      });
    }

    const uploadResults = await CloudinaryService.uploadMultipleImages(files);

    const imageUrls = uploadResults.map(result => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    return res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: { images: imageUrls },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message,
    });
  }
});

// --------------------------
// Upload single image (avatar)
// --------------------------
router.post('/avatar', authenticate, uploadSingle, async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image provided',
      });
    }

    const uploadResult = await CloudinaryService.uploadImage(
      file.buffer,
      file.originalname,
      'avatars'
    );

    return res.status(200).json({
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
    return res.status(500).json({
      success: false,
      message: 'Error uploading avatar',
      error: error.message,
    });
  }
});

// --------------------------
// Upload single image (room photo)
// --------------------------
router.post('/room-photo', authenticate, uploadSingle, async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image provided',
      });
    }

    const uploadResult = await CloudinaryService.uploadImage(
      file.buffer,
      file.originalname,
      'images'
    );

    return res.status(200).json({
      success: true,
      message: 'Room photo uploaded successfully',
      data: {
        image: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error uploading room photo',
      error: error.message,
    });
  }
});

export default router;
