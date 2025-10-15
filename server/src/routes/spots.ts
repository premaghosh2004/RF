import express from 'express';
import { body } from 'express-validator';
import {
  createSpot,
  getSpots,
  getSpotById,
  toggleLike,
  addComment,
} from '../controllers/spotController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Validation rules
const createSpotValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Description must be between 1 and 500 characters'),
  
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [longitude, latitude]'),
  
  body('category')
    .isIn(['nature', 'urban', 'architecture', 'food', 'events', 'sports', 'art', 'other'])
    .withMessage('Invalid category'),
  
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),
];

const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Comment must be between 1 and 300 characters'),
];

// Routes
router.post('/', authenticate, createSpotValidation, createSpot);
router.get('/', optionalAuth, getSpots);
router.get('/:id', optionalAuth, getSpotById);
router.post('/:id/like', authenticate, toggleLike);
router.post('/:id/comments', authenticate, commentValidation, addComment);

export default router;
