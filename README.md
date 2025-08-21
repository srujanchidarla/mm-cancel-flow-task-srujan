# Migrate Mate - Subscription Cancellation Flow

A pixel-perfect implementation of the subscription cancellation flow with deterministic A/B testing and secure data persistence.

## Architecture Overview

This solution implements a multi-step cancellation flow that guides users through job status questions, offers contextual help, and presents variant-based downsell offers. The architecture prioritizes security, user experience, and data integrity.

### Core Components

**Frontend Flow Management**: React-based modal system with TypeScript state management using custom hooks (`useCancellationFlow`, `useDownsellVariant`) that handle progressive disclosure and variant assignment.

**Backend API Design**: Three REST endpoints handle subscription data, A/B variant generation, and cancellation processing with comprehensive validation and error handling.

**Database Schema**: Enhanced the provided schema with proper constraints, relationships, and a deterministic variant generation function using cryptographic hashing.

## Security Implementation

**Row-Level Security (RLS)**: All tables use Postgres RLS policies to ensure users can only access their own data, even in this demo environment.

**Input Validation**: Multi-layer validation including TypeScript interfaces, runtime validation functions, and server-side sanitization to prevent XSS and injection attacks.

**CSRF Protection**: API endpoints validate request structure and sanitize all user inputs before database operations.

**Data Integrity**: Atomic transactions ensure subscription updates and cancellation records are created together or both fail, preventing inconsistent states.

## A/B Testing Approach

**Deterministic Assignment**: Uses SHA-256 hash of user ID + salt to ensure consistent variant assignment across sessions while maintaining true 50/50 distribution.

**Persistence Strategy**: Variant assignment is stored on first cancellation attempt and reused for subsequent visits, ensuring users never see different variants.

**Variant Implementation**:

- **Variant A**: Standard cancellation flow without downsell offer
- **Variant B**: Shows $10 discount offer ($25→$15, $29→$19) with acceptance/decline tracking

**Business Logic**: Accepted downsells update subscription pricing and maintain active status; declined offers proceed to cancellation with proper reason tracking.

## Technical Decisions

**State Management**: Custom React hooks provide clean separation between UI state and business logic, enabling easy testing and maintenance.

**Modal Architecture**: Single modal component with step-based rendering reduces bundle size while maintaining pixel-perfect fidelity to the Figma design.

**API Structure**: RESTful design with proper HTTP status codes and comprehensive error handling ensures reliable client-server communication.

**Database Functions**: Postgres function for variant generation ensures consistency and performance while keeping sensitive logic server-side.

**Responsive Design**: Mobile-first approach with Tailwind CSS utility classes ensures consistent experience across devices without additional frameworks.

## Setup & Usage

```bash
# Install dependencies
npm install

# Set up local database with enhanced schema
npm run db:setup

# Start development server
npm run dev
```

The application loads with a profile page containing subscription management. Click "Cancel Migrate Mate" in the subscription settings to trigger the cancellation flow.

## Data Flow

1. **Entry**: User clicks cancel button, modal opens and fetches A/B variant
2. **Progression**: User answers job-related questions, system tracks responses
3. **Variant Display**: Based on assignment, shows appropriate downsell offer or standard flow
4. **Processing**: User decision triggers API call with validated data
5. **Persistence**: Database atomically updates subscription and records cancellation details
6. **Completion**: User sees confirmation and subscription status updates in real-time

The implementation handles edge cases like existing cancellations, invalid subscriptions, and network failures gracefully while maintaining data consistency.
