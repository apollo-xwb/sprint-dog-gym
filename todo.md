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

## Phase 2: Database & Backend Setup (In Progress)
- [ ] Upgrade to web-db-user (database, auth, payment)
- [ ] Resolve Home.tsx conflict after upgrade
- [ ] Create database schema for bookings, subscriptions, dogs
- [ ] Set up Stripe payment integration
- [ ] Implement auth flow with Manus OAuth

## Phase 3: Video & Media
- [ ] Generate dog treadmill video (autoplay)
- [ ] Integrate video into Process section with autoplay
- [ ] Optimize video for web (webm/mp4 formats)

## Phase 4: Quiz Enhancement
- [ ] Expand quiz with all dog sizes (small to large)
- [ ] Add more dog breeds (not just high-drive)
- [ ] Calculate Kinetik Deficit Score
- [ ] Display energy deficit stat (how many dogs reach required daily output)
- [ ] Show behavioral consequences of unmet needs

## Phase 5: Content Sections
- [ ] Add FAQ section with common questions
- [ ] Add behavioral issues section (stemming from unmet energy needs)
- [ ] Add stat: "Only X% of dogs reach their required daily energy output"
- [ ] Add consequences section: "What happens when dogs don't meet their needs"

## Phase 6: Chatbot
- [ ] Implement chatbot component with LLM integration
- [ ] Add chatbot to landing page (floating button or widget)
- [ ] Wire chatbot to answer FAQ questions
- [ ] Train chatbot on SPRINT services and pricing

## Phase 7: Multi-Dog Booking Flow
- [ ] Create booking flow for single dog
- [ ] Extend booking flow to handle multiple dogs
- [ ] Allow users to select different packages for each dog
- [ ] Calculate total pricing with Buddy System discount (15% off 2nd dog)
- [ ] Store multiple dogs in user profile

## Phase 8: Payment Integration
- [ ] Integrate Stripe for all packages
- [ ] Implement Single package payment (R550)
- [ ] Implement 5-Session package payment (R2500)
- [ ] Implement 10-Session package payment (R4800)
- [ ] Implement Monthly subscription payment (R1950/mo)
- [ ] Add payment confirmation and receipt emails

## Phase 9: Yearly Subscription Option
- [ ] Add yearly subscription option for Monthly plan
- [ ] Calculate yearly price (R1950 × 12 = R23,400)
- [ ] Implement yearly payment flow
- [ ] Add toggle/selector for monthly vs yearly billing

## Phase 10: Internal Dashboard
- [ ] Create admin dashboard layout
- [ ] Add bookings management section
  - [ ] View all bookings
  - [ ] Filter by date, status, dog
  - [ ] Edit booking details
  - [ ] Cancel bookings
- [ ] Add subscriptions management section
  - [ ] View active subscriptions
  - [ ] Track subscription status
  - [ ] Handle subscription renewals
  - [ ] Process cancellations
- [ ] Add users/dogs management section
  - [ ] View all registered dogs
  - [ ] View dog profiles
  - [ ] Track dog history
- [ ] Add revenue/analytics dashboard
  - [ ] Total revenue
  - [ ] Active subscriptions count
  - [ ] Bookings this month
  - [ ] Popular packages
- [ ] Add session management
  - [ ] Schedule sessions
  - [ ] Track session completion
  - [ ] Record session data (speed, duration, heart rate)

## Phase 11: Testing & Refinement
- [ ] Test booking flow end-to-end
- [ ] Test payment processing
- [ ] Test multi-dog scenarios
- [ ] Test dashboard functionality
- [ ] Mobile responsiveness testing
- [ ] Browser compatibility testing

## Phase 12: Deployment & Launch
- [ ] Final QA and bug fixes
- [ ] Deploy to production
- [ ] Set up monitoring and analytics
- [ ] Create user documentation
