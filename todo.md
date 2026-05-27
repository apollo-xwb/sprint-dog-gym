# SPRINT Project TODO

## Phase 1: Core Landing Page (Completed)
- [x] Hero section with pre-workout athlete metaphor
- [x] Navbar with sticky nav and cyan quiz button
- [x] WhySprint section with stats
- [x] Process/Riley Method section with three glass cards
- [x] Testimonials section
- [x] Pricing grid with 4 packages
- [x] Buddy System banner (15% off second dog)
- [x] Footer with Cape Town branding
- [x] KineticPulse sine wave separators
- [x] Premium dog image with transparent background
- [x] Brabus-style widebody van with cyan branding

## Phase 2: Database & Backend Setup (Completed)
- [x] Upgrade to web-db-user (database, auth, payment)
- [x] Resolve Home.tsx conflict after upgrade
- [x] Create database schema for bookings, subscriptions, dogs
- [x] Set up Stripe payment integration (mock)
- [x] Implement auth flow with Manus OAuth

## Phase 3: Video & Media (Pending - Requires Upgrade)
- [ ] Generate dog treadmill video (autoplay) - requires video generation upgrade
- [ ] Integrate video into Process section with autoplay
- [ ] Optimize video for web (webm/mp4 formats)

## Phase 4: Quiz Enhancement (Completed)
- [x] Expand quiz with all dog sizes (small to large)
- [x] Add more dog breeds (not just high-drive)
- [x] Calculate Kinetik Deficit Score
- [x] Display energy deficit stat (how many dogs reach required daily output)
- [x] Show behavioral consequences of unmet needs

## Phase 5: Content Sections (Completed)
- [x] Add FAQ section with common questions
- [x] Add behavioral issues section (stemming from unmet energy needs)
- [x] Add stat: "Only X% of dogs reach their required daily energy output"
- [x] Add consequences section: "What happens when dogs don't meet their needs"

## Phase 6: Chatbot (Completed)
- [x] Implement chatbot component with LLM integration
- [x] Add chatbot to landing page (floating button or widget)
- [x] Wire chatbot to answer FAQ questions
- [x] Train chatbot on SPRINT services and pricing

## Phase 7: Multi-Dog Booking Flow (Completed)
- [x] Create booking flow for single dog
- [x] Extend booking flow to handle multiple dogs
- [x] Allow users to select different packages for each dog
- [x] Calculate total pricing with Buddy System discount (15% off 2nd dog)
- [x] Store multiple dogs in user profile

## Phase 8: Payment Integration (Completed - Mock)
- [x] Integrate Stripe for all packages (mock)
- [x] Implement Single package payment (R550)
- [x] Implement 5-Session package payment (R2500)
- [x] Implement 10-Session package payment (R4800)
- [x] Implement Monthly subscription payment (R1950/mo)
- [ ] Add payment confirmation and receipt emails (pending Stripe keys)

## Phase 9: Yearly Subscription Option (Completed)
- [x] Add yearly subscription option for Monthly plan
- [x] Calculate yearly price (R1950 × 12 = R23,400)
- [x] Implement yearly payment flow
- [x] Add toggle/selector for monthly vs yearly billing

## Phase 10: Internal Dashboard (Completed - Enhanced)
- [x] Create admin dashboard layout
- [x] Add bookings management section
  - [x] View all bookings
  - [x] Filter by date, status, dog
  - [ ] Edit booking details
  - [ ] Cancel bookings
- [x] Add subscriptions management section
  - [x] View active subscriptions
  - [x] Track subscription status
  - [ ] Handle subscription renewals
  - [x] Process cancellations
- [x] Add users/dogs management section
  - [x] View all registered dogs
  - [x] View dog profiles
  - [ ] Track dog history
- [x] Add revenue/analytics dashboard
  - [x] Total revenue
  - [x] Active subscriptions count
  - [x] Bookings this month
  - [ ] Popular packages
- [ ] Add session management
  - [ ] Schedule sessions
  - [ ] Track session completion
  - [ ] Record session data (speed, duration, heart rate)

## Phase 11: Testing & Refinement (Partial)
- [x] Test booking flow end-to-end (manual)
- [ ] Test payment processing (requires Stripe keys)
- [x] Test multi-dog scenarios (manual)
- [x] Test dashboard functionality (manual)
- [x] Mobile responsiveness testing (manual)
- [ ] Browser compatibility testing

## Phase 12: Deployment & Launch (Pending)
- [ ] Final QA and bug fixes
- [ ] Deploy to production
- [ ] Set up monitoring and analytics
- [ ] Create user documentation

## Additional Features Implemented
- [x] Enhanced Booking Modal with per-dog packages and Buddy System discount
- [x] Monthly/yearly billing toggle for subscriptions
- [x] Enhanced Chatbot with SPRINT FAQ/pricing knowledge
- [x] Chat router for LLM integration
- [x] Enhanced Admin Dashboard with 5 tabs and KPIs
- [x] Booking filtering and subscription cancellation UI
- [x] Real-time price calculation with discounts

## Phase 13: App Experience Transformation (Completed)
- [x] Build floating bottom nav bar (fixed, centered, not full-width)
  - [x] Home, Quiz, Bookings, Chat, Profile tabs
  - [x] Icons from Lucide React
  - [x] App-like styling with glassmorphism
- [x] Create app-like side menu (mobile)
  - [x] Big, square, curved buttons (not traditional list)
  - [x] Grid layout for navigation items
  - [x] Card-based design with icons + labels
- [x] Add "What to Bring" free value section
  - [x] Checklist: water bowl, treats, leash, collar, ID tag, etc.
  - [x] Pre-session preparation guide
  - [x] Glassmorphism card styling
- [x] Add cool facts section
  - [x] Energy deficit statistics
  - [x] Behavioral science insights
  - [x] Dog athlete performance metrics
  - [x] Animated counters for impact
- [x] Refactor Home page for app layout
  - [x] Integrate floating nav into layout
  - [x] Adjust padding/spacing for bottom nav
  - [x] Mobile-first responsive design
- [ ] Test app experience on mobile
  - [ ] Bottom nav functionality
  - [ ] Side menu interactions
  - [ ] Responsive layout
  - [ ] Touch-friendly spacing

## Phase 14: Bug Fixes & Polish Features
- [ ] Fix mobile side menu scroll (prevent body scroll when menu open)
- [ ] Add behavioral issues videos (5-6 autoplaying, no controls)
- [ ] Create SPRINT logo Easter egg (transforms to dog SVG on scroll)
- [ ] Add footer dog treadmill hero (Belgian Malinois/Border Collie with dark fade overlay)
