# Rahma-Junior-Education-Center
# Rahma Junior Education Center

A modern school management system designed to support the day-to-day academic, administrative, financial, attendance, examination, communication, and student management needs of Rahma Junior Education Center.

## Overview

The Rahma Junior Education Center Management System provides a centralized platform for managing school operations.

The system is designed to support:

* Student admission and management
* Parent and student information
* Student photographs
* Academic records
* Attendance management
* Examination management
* Report cards
* Teacher management
* Subject and teacher assignments
* Timetables
* School settings
* Finance and family discounts
* Inventory management
* School documents
* SMS automation
* Audit logs
* Parent login and access
* Administrative operations

## Main Technologies

This project uses a modern web application stack including:

* React
* TypeScript
* Vite
* Supabase
* JavaScript / TypeScript
* CSS
* Node.js
* npm

## Project Structure

```text
Rahma-Junior-Education-Center/
├── public/             # Public assets
├── scripts/            # Project scripts
├── src/                # Main application source code
├── supabase/           # Supabase configuration and database resources
├── package.json        # Project dependencies and scripts
├── package-lock.json   # Locked dependency versions
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
├── .env.example        # Example environment variables
└── README.md           # Project documentation
```

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project directory:

```bash
cd Rahma-Junior-Education-Center
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a local `.env` file based on `.env.example`.

Do not upload `.env` to GitHub.

Your `.env` file should contain the environment variables required by the application, such as your Supabase configuration.

Never publish private API keys, service-role keys, passwords, or other sensitive credentials in the repository.

## Running the Project

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL in the terminal.

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Database

The project uses Supabase for backend services and database functionality.

Supabase-related files are located in:

```text
supabase/
```

Before deploying the application, ensure that the required database tables, policies, functions, and configuration are correctly configured in the Supabase project.

## Documentation

Additional project documentation is available in the repository, including documentation for:

* Academic records
* Attendance
* Audit logs
* Parent login
* Examinations
* Finance
* Inventory
* Report cards
* School documents
* School settings
* SMS automation
* Student photographs
* Subjects and teacher assignments
* Timetables

## Security

Sensitive files and credentials should never be committed to GitHub.

In particular:

```text
.env
.env.local
```

should remain local and must not be committed.

## Development

Before committing changes, check the Git status:

```bash
git status
```

Review the files that will be committed before running:

```bash
git add .
```

## License

This project is proprietary software developed for Rahma Junior Education Center.

All rights reserved.
