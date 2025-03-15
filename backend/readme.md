health-care-api/
│
├── src/
│   ├── config/
│   │   └── db.ts
│   │
│   ├── models/
│   │   ├── IUser.ts         # Interface for the User model
│   │   ├── IEnquiry.ts      # Interface for the Enquiry model
│   │
│   ├── services/
│   │   ├── UserService.ts     # Handles business logic for user operations
│   │   ├── EnquiryService.ts  # Handles business logic for enquiries
│   │
│   ├── controllers/
│   │   ├── UserController.ts   # Controller for user-related endpoints
│   │   ├── EnquiryController.ts # Controller for handling enquiries
│   │
│   ├── routes/
│   │   ├── userRoutes.ts       # Routes for user-related API endpoints
│   │   ├── enquiryRoutes.ts    # Routes for enquiry-related API endpoints
│   │
│   ├── app.ts                 # Express app setup, integrates all routes
│   └── index.ts               # Application entry point
│
├── .env                       # Environment variables
├── package.json               # Node.js dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation

