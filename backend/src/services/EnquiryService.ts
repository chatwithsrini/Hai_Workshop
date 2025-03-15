import { MongoClient, ObjectId } from 'mongodb';
import { getDB } from '../config/db';
import { IEnquiry } from '../models/IEnquiry';

class EnquiryService {
    // Create a new enquiry
    async createEnquiry(enquiryData: IEnquiry): Promise<IEnquiry> {
        const db = getDB();
        const collection = db.collection('enquiries');

        const result = await collection.insertOne({
            ...enquiryData,
            dateCreated: new Date(),
            dateUpdated: new Date(),
        });

        // Return the full IEnquiry object, including the MongoDB _id converted to string
        return {
            ...enquiryData,
            id: result.insertedId.toString(), // Convert ObjectId to string for the id field
        };
    }

    // Retrieve an enquiry by ID
    async getEnquiryById(enquiryId: string): Promise<IEnquiry | null> {
        const db = getDB();
        const collection = db.collection('enquiries');

        const result = await collection.findOne({ _id: new ObjectId(enquiryId) });
        if (!result) return null;

        // Map the MongoDB document to conform to IEnquiry interface, including all necessary fields
        return {
            id: result._id.toString(), // Convert ObjectId to string for the id field
            enquiryFor: result.enquiryFor,
            name: result.name,
            contact: result.contact,
            dateCreated: result.dateCreated,
            dateUpdated: result.dateUpdated,
        };
    }

    // Retrieve all enquiries
    async getAllEnquiries(): Promise<IEnquiry[]> {
        const db = getDB();
        const collection = db.collection('enquiries');

        const enquiries = await collection.find().toArray();

        // Map the MongoDB documents to conform to IEnquiry interface, including all necessary fields
        return enquiries.map((enquiry) => ({
            id: enquiry._id.toString(), // Convert ObjectId to string for the id field
            enquiryFor: enquiry.enquiryFor,
            name: enquiry.name,
            contact: enquiry.contact,
            dateCreated: enquiry.dateCreated,
            dateUpdated: enquiry.dateUpdated,
        }));
    }
}

export default new EnquiryService();
