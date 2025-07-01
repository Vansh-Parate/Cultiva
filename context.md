# GreenThumb - Plant Care Assistant

Build a comprehensive plant care management platform where users can track their plants, get care reminders, identify unknown plants, and connect with a plant care community.

## Core Features to Implement

### 1. User Authentication & Profiles
- User registration/login with email validation
- User profile with location and plant care experience level
- Password reset functionality
- Profile avatar upload

### 2. Plant Management Dashboard
- **My Plants Grid**: Display user's plants in a responsive card grid
- **Plant Cards** showing: plant photo, name, species, health status, next care due
- **Add Plant Form** with fields:
  - Plant name (custom)
  - Species (dropdown with search)
  - Variety/cultivar
  - Date acquired
  - Location (Indoor/Outdoor/Balcony)
  - Upload plant photo
  - Care notes
- **Plant Detail Page** with:
  - Large plant photo gallery
  - Complete plant information
  - Care schedule timeline
  - Health history chart
  - Quick care action buttons (Water, Fertilize, Prune)

### 3. Care Scheduling System
- **Care Calendar View**: Monthly calendar showing all care tasks
- **Today's Tasks**: Dashboard widget showing plants needing care today
- **Care Types**: Water, Fertilize, Repot, Prune, Pest Check
- **Custom Care Schedules**: Set frequency for each care type per plant
- **Care Completion**: Mark tasks complete with optional notes/photos
- **Care History**: Timeline view of all completed care activities

### 4. Plant Health Journal
- **Health Log Entries** with:
  - Date and time
  - Health status (Excellent/Good/Fair/Poor/Critical)
  - Growth measurements (height, width)
  - Issues noted (yellowing, pests, wilting)
  - Progress photos
  - Care notes
- **Health Trends**: Visual charts showing plant growth and health over time
- **Issue Tracking**: Tag and track specific problems (pests, diseases, nutrient deficiency)

### 5. Plant Identification Feature
- **Photo Upload Interface**: Camera access or file upload
- **Identification Results**: Show top 3 plant species matches with confidence scores
- **Species Information**: Display care requirements, difficulty level, common issues
- **Add to Collection**: Option to add identified plant to user's collection
- **Identification History**: Track all previous plant identification requests

### 6. Smart Care Reminders
- **Notification System**: Browser notifications for care tasks
- **Email Reminders**: Daily digest of plants needing care
- **Weather Integration**: Adjust watering frequency based on local weather
- **Seasonal Adjustments**: Modify care schedules based on growing seasons
- **Reminder Preferences**: Customize notification timing and methods

### 7. Plant Species Database
- **Species Catalog**: Comprehensive database of common houseplants and garden plants
- **Care Requirements**: Light, water frequency, humidity, temperature, soil type
- **Difficulty Rating**: Beginner/Intermediate/Advanced
- **Common Issues**: Typical problems and solutions
- **Growing Tips**: Seasonal care advice and propagation methods

### 8. Community Features
- **Q&A Section**: Ask plant care questions and get community answers
- **Plant Showcase**: Share photos of thriving plants for inspiration
- **Care Tips Exchange**: Community-contributed care tips and tricks
- **Local Plant Groups**: Connect with plant enthusiasts in your area
- **Plant Trading**: Marketplace for plant swaps and sales

### 9. Local Plant Services Directory
- **Plant Shops**: Directory of local nurseries and plant stores
- **Services**: Plant sitters, landscapers, plant doctors
- **Shop Ratings**: User reviews and ratings
- **Contact Information**: Address, phone, website, hours
- **Service Booking**: Schedule appointments with plant care professionals

## Technical Requirements

### Frontend (React + TypeScript + Tailwind CSS)
- **Responsive Design**: Mobile-first approach, works on all devices
- **Modern UI Components**: Clean, nature-inspired design with green color palette
- **Image Handling**: Efficient image upload, compression, and display
- **Charts & Visualizations**: Health trends and care statistics
- **Calendar Integration**: Interactive calendar for care scheduling
- **Camera Integration**: Access device camera for plant photos
- **Progressive Web App**: Installable on mobile devices
- **Dark/Light Mode**: Toggle between themes

### Backend (Node.js + Express + PostgreSQL)
- **RESTful API**: Well-structured endpoints for all features
- **Authentication**: JWT-based auth with refresh tokens
- **File Storage**: Image upload and storage system
- **Database Design**: Optimized schema with proper relationships
- **Email Service**: Automated reminder emails
- **Cron Jobs**: Automated reminder generation and cleanup
- **External APIs**: Weather API integration
- **Input Validation**: Comprehensive data validation and sanitization

### Database Schema
```sql
Users: id, email, password_hash, username, full_name, location, experience_level, avatar_url, created_at, updated_at

Plants: id, user_id, name, species_id, variety, date_acquired, location_type, primary_image_url, notes, is_active, created_at, updated_at

Plant_Species: id, common_name, scientific_name, care_difficulty, light_requirements, water_frequency_days, humidity_needs, temperature_range, soil_type, growth_season

Plant_Images: id, plant_id, image_url, caption, is_primary, uploaded_at

Care_Schedules: id, plant_id, care_type, frequency_days, last_completed_at, next_due_date, is_active

Care_Logs: id, plant_id, care_type, completed_at, notes, image_url

Health_Logs: id, plant_id, logged_at, health_status, height_cm, width_cm, issues_noted, notes, image_url

Plant_Identifications: id, user_id, image_url, top_species_suggestions, confidence_scores, status, created_at

Community_Posts: id, user_id, post_type, title, content, image_urls, tags, created_at

Plant_Shops: id, name, address, phone, website, services_offered, rating, created_at
```

## User Experience Flow

### Onboarding
1. User signs up and completes profile
2. Welcome tutorial explaining key features
3. Guided flow to add first plant
4. Setup initial care reminders

### Daily Usage
1. Dashboard shows today's care tasks
2. Quick care completion with photo option
3. Add health journal entries
4. Check community Q&A for tips

### Plant Identification
1. Upload photo of unknown plant
2. Receive species suggestions
3. View detailed care information
4. Add plant to collection with pre-filled care schedule

## Design Guidelines

### Visual Design
- **Color Palette**: Primary greens (#10B981, #059669), earth tones (#92400E, #78350F)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Icons**: Nature-themed icons (leaves, water drops, sun)
- **Images**: High-quality plant photography, consistent aspect ratios
- **Cards**: Rounded corners, subtle shadows, hover effects

### User Interface
- **Navigation**: Bottom tab navigation for mobile, sidebar for desktop
- **Forms**: Step-by-step forms for complex data entry
- **Feedback**: Loading states, success messages, error handling
- **Accessibility**: Proper contrast ratios, keyboard navigation, screen reader support

### Mobile Optimization
- **Touch-Friendly**: Large buttons, swipe gestures
- **Camera Integration**: Easy photo capture for plant logging
- **Offline Capability**: Cache essential data for offline viewing
- **Push Notifications**: Care reminders and community updates

## Success Metrics

### User Engagement
- Daily active users returning to check care tasks
- Average plants per user (target: 3-5)
- Care task completion rate (target: >80%)
- Health log entry frequency

### Feature Usage
- Plant identification requests per week
- Community post engagement rates
- Local plant shop directory usage
- Care reminder effectiveness

## Development Priorities

### Phase 1 (MVP - 4 weeks)
- User authentication
- Basic plant management (CRUD)
- Simple care scheduling
- Plant photo uploads

### Phase 2 (Enhanced Features - 3 weeks)
- Health logging with charts
- Care reminders system
- Basic plant identification
- Community Q&A

### Phase 3 (Advanced Features - 3 weeks)
- Weather integration
- Advanced plant species database
- Local plant shop directory
- Mobile PWA features

### Phase 4 (Polish & Launch - 2 weeks)
- Performance optimization
- Advanced UI/UX improvements
- Comprehensive testing
- Deployment and monitoring

Build this as a production-ready application with clean, maintainable code, comprehensive error handling, and a delightful user experience that makes plant care enjoyable and successful.