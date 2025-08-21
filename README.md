Migrate Mate - Subscription Cancellation Flow
A pixel-perfect implementation of the subscription cancellation flow with deterministic A/B testing and comprehensive security measures.
Architecture Overview
This solution implements a multi-step cancellation flow that guides users through job status questions, offers contextual help, and presents variant-based downsell offers. The architecture prioritizes user experience, data integrity, and security best practices.
Core Components
Frontend Flow Management: React-based modal system with TypeScript state management using custom hooks (useCancellationFlow, useDownsellVariant) that handle progressive disclosure and variant assignment.
API Design: Three REST endpoints handle subscription data, A/B variant generation, and cancellation processing with comprehensive validation and security measures.
State Management: Custom React hooks provide clean separation between UI state and business logic, enabling maintainable and testable code.
Security Implementation
Input Validation: Multi-layer validation including TypeScript interfaces, runtime validation functions, and server-side sanitization to prevent XSS and injection attacks.
CSRF Protection: API endpoints validate request structure and sanitize all user inputs before processing.
Data Integrity: Atomic operations ensure subscription updates and cancellation records maintain consistency.
Access Control: Proper validation of user permissions and data ownership throughout the flow.
A/B Testing Approach
Deterministic Assignment: Uses SHA-256 hash of user ID + salt to ensure consistent variant assignment across sessions while maintaining true 50/50 distribution.
Persistence Strategy: Variant assignment is computed deterministically, ensuring users never see different variants across sessions.
Variant Implementation:

Variant A: Standard cancellation flow without downsell offer
Variant B: Shows $10 discount offer ($25→$15, $29→$19) with acceptance/decline tracking

Business Logic: Accepted downsells update subscription pricing and maintain active status; declined offers proceed to cancellation with proper reason tracking.
Technical Decisions
Modal Architecture: Single modal component with step-based rendering reduces bundle size while maintaining pixel-perfect fidelity to the Figma design.
API Structure: RESTful design with proper HTTP status codes and comprehensive error handling ensures reliable client-server communication.
Responsive Design: Mobile-first approach with Tailwind CSS utility classes ensures consistent experience across devices.
Security-First: All user inputs are validated and sanitized, with proper error handling to prevent information leakage.
Setup & Usage
bash# Install dependencies
npm install

# Start development server

npm run dev
The application loads with a profile page containing subscription management. Click "Cancel Migrate Mate" in the subscription settings to trigger the cancellation flow.
Data Flow

Entry: User clicks cancel button, modal opens and fetches A/B variant
Progression: User answers job-related questions, system tracks responses
Variant Display: Based on assignment, shows appropriate downsell offer or standard flow
Processing: User decision triggers API call with validated data
Completion: User sees confirmation and flow completes successfully

The implementation handles edge cases like network failures and invalid inputs gracefully while maintaining a smooth user experience.
Key Features Implemented
✅ Progressive flow - Exact Figma journey with pixel-perfect mobile/desktop design
✅ Deterministic A/B testing - 50/50 split with consistent variant assignment
✅ Security measures - Input validation, sanitization, and CSRF protection
✅ Responsive design - Works seamlessly on mobile and desktop
✅ Error handling - Graceful degradation and user feedback
✅ TypeScript safety - Full type coverage for maintainability
