import { Request, Response } from 'express';
import EnquiryService from '../services/EnquiryService';

class EnquiryController {
    // POST: /enquiries/create
    // Creates a new enquiry
    async createEnquiry(req: Request, res: Response) {
        try {
            const enquiryData = req.body;
            // Ensure all required fields are present
            if (!enquiryData.enquiryFor || !enquiryData.name || !enquiryData.contact) {
                res.status(400).send("Missing required fields.");
                return;
            }
            const newEnquiry = await EnquiryService.createEnquiry(enquiryData);
            res.status(201).json(newEnquiry);
        } catch (error) {
            console.error('Error creating enquiry:', error);
            res.status(500).send("Failed to create enquiry.");
        }
    }

    // GET: /enquiries/:id
    // Retrieves an enquiry by ID
    async getEnquiryById(req: Request, res: Response) {
        try {
            const enquiryId = req.params.id;
            const enquiry = await EnquiryService.getEnquiryById(enquiryId);
            if (enquiry) {
                res.status(200).json(enquiry);
            } else {
                res.status(404).send("Enquiry not found.");
            }
        } catch (error) {
            console.error('Error retrieving enquiry:', error);
            res.status(500).send("Failed to retrieve enquiry.");
        }
    }

    async getAllEnquiries(req: Request, res: Response) {
        try {
            const enquiries = await EnquiryService.getAllEnquiries();
            res.status(200).json(enquiries);
        } catch (error) {
            console.error('Error retrieving all enquiries:', error);
            res.status(500).send("Failed to retrieve enquiries.");
        }
    }
}

export default new EnquiryController();
