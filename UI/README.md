# Application use case

Health care application used to search doctors, services offered across hospitals and book appointment.

## Health care application frontend folder structure

	healthcare-frontend
	├── README.md                   # Project overview and setup instructions
	├── package-lock.json           # Dependency lock file for consistent installations
	├── package.json                # Lists project dependencies, scripts, and metadata
	├── postcss.config.js           # Configuration for PostCSS, a tool for transforming CSS
	├── public
	│   ├── favicon.ico             # Icon displayed in the browser tab
	│   ├── index.html              # Main HTML file that serves as the entry point for the application
	│   ├── logo192.png             # 192x192 pixel logo used in Progressive Web App (PWA) contexts
	│   ├── logo512.png             # 512x512 pixel logo used in PWA contexts
	│   ├── manifest.json           # Metadata for the PWA, including icons and theme colors
	│   └── robots.txt              # Instructions for web crawlers about which pages to index
	├── src
	│   ├── App.tsx                 # Main application component
	│   ├── beans
	│   │   └── inquiry.ts          # TypeScript definitions or models related to inquiries
	│   ├── components
	│   │   ├── Footer
	│   │   │   └── Footer.tsx     # Footer component containing footer content
	│   │   ├── Inquiry
	│   │   │   └── Inquiry.tsx    # Inquiry component for handling inquiries
	│   │   └── Navbar
	│   │       └── Navbar.tsx     # Navbar component containing navigation links
	│   ├── constants
	│   │   └── app.constants.ts    # Application-wide constants and configuration values
	│   ├── environments
	│   │   └── environment.dev.ts  # Configuration for the development environment
	│   ├── hooks
	│   │   └── useFetch.ts         # Custom hook for handling data fetching
	│   ├── index.css               # Global styles for the application
	│   ├── index.tsx               # Entry point for the React application
	│   ├── logo.svg                # SVG logo used in the application
	│   ├── pages
	│   │   ├── About
	│   │   │   ├── About.module.css # Styles specific to the About page
	│   │   │   └── About.tsx       # About page component
	│   │   ├── Home
	│   │   │   ├── Home.module.css # Styles specific to the Home page
	│   │   │   └── Home.tsx        # Home page component
	│   │   └── NotFound
	│   │       └── NotFound.tsx    # Component displayed when a page is not found
	│   ├── react-app-env.d.ts       # TypeScript definitions for the React app environment
	│   ├── reportWebVitals.ts       # Utility for measuring and reporting web vitals
	│   ├── services
	│   │   └── userService.ts       # Service for handling user-related API calls
	│   ├── setupTests.ts            # Setup file for configuring testing environment
	│   ├── state
	│   │   ├── features
	│   │   │   └── user
	│   │   │       └── userSlice.ts # Redux slice for managing user state
	│   │   └── store.ts             # Configuration of the Redux store
	│   ├── styles
	│   │   └── global.css           # Global styles applied across the application
	│   └── utils
	│       └── axios.utils.ts       # Utility functions for handling Axios HTTP requests
	├── tailwind.config.js           # Configuration file for Tailwind CSS
	└── tsconfig.json                # TypeScript configuration file


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
