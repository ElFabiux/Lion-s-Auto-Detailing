# Lion's Auto Detailing

Professional web application for an automotive detailing business in Santiago, Chile. The project combines a modern marketing landing page with a complete appointment booking flow, allowing users to explore services, compare detailing packages, view previous work, and schedule an appointment online.

## Overview

Lion's Auto Detailing was built to provide a premium digital experience for a local automotive detailing service. The application focuses on visual presentation, responsive design, and a smooth booking process supported by a Notion-based backend.

The platform includes a public landing page for service discovery and a dedicated booking funnel where users can enter their information, select a date and time, choose a service package, and confirm their appointment.

## Key Features

- Responsive landing page with premium visual design
- Service and package presentation for automotive detailing
- Gallery section to showcase completed work
- Multi-step appointment booking funnel
- Dynamic date, time, service, vehicle, and pricing selection
- Notion integration for managing appointment availability
- API routes for booking, slot retrieval, and appointment management
- Rate limiting and reservation locking to reduce spam and prevent double-booking
- Clean route separation between the marketing site and booking experience

## Tech Stack

- **Next.js 15**
- **React 19**
- **Tailwind CSS 4**
- **JavaScript**
- **Notion API / Notion SDK**
- **Lucide React**
- **Framer Motion**

## Architecture Highlights

The project uses the Next.js App Router architecture with separate route groups for the main landing page and the booking form. The landing page is organized into reusable UI sections such as Hero, Services, Packages, Gallery, and Contact.

The booking system works as a multi-step state-driven flow, keeping user data across the scheduling process. On the backend, API routes connect the frontend with Notion, which acts as the database for available and booked appointment slots.

To improve reliability, the backend includes request limits and a reservation locking mechanism that helps prevent multiple users from booking the same time slot at the same time.

## Main Sections

- **Landing Page:** Presents the business, services, packages, gallery, and contact information.
- **Booking Funnel:** Guides the user through personal information, date and time selection, service selection, and confirmation.
- **Backend API:** Handles appointment creation, available slot retrieval, booked slot management, and basic protection rules.
- **Notion Integration:** Uses a Notion database as the source of truth for appointment availability and booking status.

## Getting Started

Clone the repository and install dependencies:

```bash
npm install
