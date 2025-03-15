import express from 'express';
import EnquiryController from '../controllers/EnquiryController';

const router = express.Router();

// Route to create a new enquiry
router.post('/enquiries/create', EnquiryController.createEnquiry);

// Route to retrieve an enquiry by ID
router.get('/enquiries/:id', EnquiryController.getEnquiryById);

// Route to retrieve all enquiries
router.get('/enquiries', EnquiryController.getAllEnquiries);

export default router;
