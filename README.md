# Lion's Auto Detailing

Professional web application for an automotive detailing business. The project combines a modern landing page with a complete appointment booking flow, allowing users to explore services, view packages, check previous work, and schedule detailing appointments online.

## Overview

Lion's Auto Detailing was built to provide a clean, responsive, and professional digital presence for an automotive detailing service. The application focuses on user experience, visual presentation, and a smooth booking process connected to Notion as a lightweight backend database.

The project includes a public marketing website and a dedicated booking funnel where users can enter their information, select a date and time, choose a service package, and confirm their appointment.

## Key Features

* Responsive landing page with modern visual design
* Service and package presentation
* Gallery section to showcase completed work
* Multi-step appointment booking flow
* Date, time, vehicle, package, and pricing selection
* API routes for booking and slot management
* Notion integration for appointment availability
* Rate limiting to reduce spam or excessive requests
* Reservation locking to help prevent duplicate bookings
* Separate layouts for the public website and booking experience

## Tech Stack

* Next.js
* React
* Tailwind CSS
* JavaScript
* Notion API
* Framer Motion
* Lucide React

## Architecture

The project uses the Next.js App Router architecture with separate route groups for the main website and the booking form.

The landing page is organized into reusable sections such as Hero, Services, Packages, Gallery, and Contact. The booking system works as a multi-step flow that keeps the user's information across the scheduling process.

On the backend, the application uses API routes to connect the frontend with Notion, which stores and manages appointment availability. The booking logic includes validation, slot verification, rate limiting, and reservation locking to improve reliability.

## Main Sections

### Landing Page

The landing page presents the business, services, packages, gallery, and contact information in a professional and responsive layout.

### Booking Funnel

The booking funnel guides users through the appointment process using four main steps:

1. Personal information
2. Date and time selection
3. Service and package selection
4. Confirmation and submission

### Backend API

The backend handles appointment creation, available slot retrieval, booked slot management, and basic protection rules.

### Notion Integration

Notion is used as the main data source for appointment availability and booking status. Available slots can be updated and managed from a Notion database.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the project locally:

```bash
http://localhost:3000
```

## Environment Variables

Create a `.env.local` file and configure the required Notion variables:

```env
NOTION_TOKEN=
NOTION_DATABASE_AVAILABILITY_ID=
```

## Project Purpose

This project demonstrates the development of a real-world business website with a strong focus on responsive design, frontend architecture, API integration, booking logic, and practical data management using Notion as a lightweight backend solution.
