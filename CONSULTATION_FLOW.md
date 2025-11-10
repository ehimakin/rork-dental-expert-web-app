# Consultation Request Flow

## Overview
The consultation flow allows clients to submit consultation requests that are saved to the backend server. Admins (dentists) can view, schedule, and manage these requests from their dashboard.

## How It Works

### Client Flow
1. **Navigate to Consultations** - Client navigates to `/consultations`
2. **Create New Request** - Click "New Request" button to go to `/consultations/new`
3. **Fill Form** - Client fills out:
   - Contact Information (name, email, phone)
   - Case Details (detailed description)
   - Upload Documents (optional PDFs, images)
4. **Submit** - Form data is sent to backend via tRPC mutation
5. **View Status** - Client can view their consultation requests at `/consultations`

### Admin Flow
1. **Navigate to Dashboard** - Admin navigates to `/admin/dashboard`
2. **View All Requests** - See all consultation requests with status indicators
3. **Review Request** - See client details, case information, and attached documents
4. **Take Action**:
   - **Schedule** - Set a date/time for the consultation
   - **Decline** - Mark as cancelled
   - **Complete** - Mark as completed after consultation

## Backend API Routes

### Create Consultation
- **Route**: `trpc.consultations.create`
- **Type**: Mutation
- **Input**: 
  - clientId
  - clientName
  - clientEmail
  - clientPhone (optional)
  - caseDetails
  - documents[]
- **Returns**: Created consultation object

### List Consultations
- **Route**: `trpc.consultations.list`
- **Type**: Query
- **Input** (optional):
  - clientId (filter by client)
  - status (filter by status)
- **Returns**: Array of consultations
- **Auto-refresh**: Polls every 5 seconds

### Update Status
- **Route**: `trpc.consultations.updateStatus`
- **Type**: Mutation
- **Input**:
  - id (consultation ID)
  - status (pending/scheduled/completed/cancelled)
  - scheduledDate (optional, for scheduled status)
- **Returns**: Updated consultation object

## Data Storage
- Consultations are stored in-memory on the backend server
- Data persists as long as the server is running
- To persist data permanently, connect a database (MySQL recommended)

## Testing

### Test Users
1. **Client Account**
   - Email: `client@test.com`
   - Can create and view own consultations

2. **Admin Account**
   - Email: `admin@test.com`
   - Can view and manage all consultations

### Test Flow
1. Login as client
2. Create a new consultation request
3. Logout
4. Login as admin
5. View the consultation in admin dashboard
6. Schedule or update the consultation
7. Logout and login as client again
8. See the updated status

## Next Steps

To add database persistence:
1. Set up MySQL database
2. Update backend routes to use database queries
3. Add proper authentication/authorization
4. Implement file upload to cloud storage for documents
