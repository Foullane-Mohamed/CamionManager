# Fleet Management API - Swagger/OpenAPI Documentation

## 📚 Overview

Complete Swagger/OpenAPI documentation has been integrated into the Fleet Management System backend. This documentation provides a comprehensive, interactive reference for all API endpoints, request/response schemas, and authentication requirements.

## 🌐 Access the Documentation

**Local Development:**

- **URL:** `http://localhost:5000/api-docs`
- **Production:** Update the server URL in `config/swagger.js`

## 📁 Documentation Structure

```
backend/
├── config/
│   └── swagger.js              # Swagger configuration
├── docs/
│   ├── schemas/                # Data model schemas (YAML)
│   │   ├── user.schemas.yaml
│   │   ├── truck.schemas.yaml
│   │   ├── trailer.schemas.yaml
│   │   ├── tire.schemas.yaml
│   │   ├── trip.schemas.yaml
│   │   ├── fuel.schemas.yaml
│   │   ├── maintenance.schemas.yaml
│   │   └── maintenanceRule.schemas.yaml
│   └── routes/                 # API endpoint documentation (YAML)
│       ├── auth.routes.yaml
│       ├── users.routes.yaml
│       ├── trucks.routes.yaml
│       ├── trailers.routes.yaml
│       ├── tires.routes.yaml
│       ├── trips.routes.yaml
│       ├── fuels.routes.yaml
│       └── maintenances.routes.yaml
```

## 🔑 Authentication

### JWT Bearer Token

All protected endpoints require JWT authentication:

```http
Authorization: Bearer <your-jwt-token>
```

### How to Get a Token:

1. **Register** a new user: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login`
3. Copy the `token` from the response
4. In Swagger UI:
   - Click the **"Authorize"** button (top right)
   - Enter: `Bearer <your-token>`
   - Click **"Authorize"**

### Role-Based Access:

- **Admin Only:** User management, creating/updating vehicles, maintenance, etc.
- **All Authenticated Users:** Viewing data, trips, fuel records

## 📋 API Endpoints Summary

### Authentication (`/api/auth`)

- `POST /register` - Register new user (no auth required)
- `POST /login` - User login (no auth required)
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout user
- `GET /profile` - Get current user profile

### Users (`/api/users`) - Admin Only

- `GET /` - Get all users
- `GET /pending` - Get pending chauffeur accounts
- `GET /:id` - Get user by ID
- `POST /admin` - Create admin user
- `PUT /:id/approve` - Approve/reject user account
- `DELETE /:id` - Delete user

### Trucks (`/api/trucks`)

- `GET /` - Get all trucks
- `GET /available` - Get available trucks
- `GET /stats` - Get truck statistics (Admin)
- `GET /:id` - Get truck by ID
- `POST /` - Create truck (Admin)
- `PUT /:id` - Update truck (Admin)
- `PATCH /:id/status` - Update truck status (Admin)
- `DELETE /:id` - Delete truck (Admin)

### Trailers (`/api/trailers`)

- `GET /` - Get all trailers
- `GET /available` - Get available trailers
- `GET /stats` - Get trailer statistics (Admin)
- `GET /:id` - Get trailer by ID
- `POST /` - Create trailer (Admin)
- `PUT /:id` - Update trailer (Admin)
- `PATCH /:id/status` - Update trailer status (Admin)
- `DELETE /:id` - Delete trailer (Admin)

### Tires (`/api/tires`)

- `GET /` - Get all tires
- `GET /status/:status` - Get tires by status
- `GET /vehicle/:vehicleType/:vehicleId` - Get tires by vehicle
- `GET /stats` - Get tire statistics (Admin)
- `GET /:id` - Get tire by ID
- `POST /` - Create tire (Admin)
- `PUT /:id` - Update tire (Admin)
- `PATCH /:id/status` - Update tire status (Admin)
- `DELETE /:id` - Delete tire (Admin)

### Trips (`/api/trips`)

- `GET /` - Get all trips
- `GET /status/:status` - Get trips by status
- `GET /driver/:driverId` - Get trips by driver
- `GET /truck/:truckId` - Get trips by truck
- `GET /stats` - Get trip statistics (Admin)
- `GET /:id` - Get trip by ID
- `GET /:id/pdf` - Generate mission order PDF
- `POST /` - Create trip (Admin)
- `PUT /:id` - Update trip (Admin)
- `PATCH /:id/status` - Update trip status (Admin)
- `DELETE /:id` - Delete trip (Admin)

### Fuel (`/api/fuels`)

- `GET /` - Get all fuel records
- `GET /driver/:driverId` - Get fuel records by driver
- `GET /vehicle/:vehicleId` - Get fuel records by vehicle
- `GET /trip/:tripId` - Get fuel records by trip
- `GET /stats` - Get fuel statistics (Admin)
- `GET /:id` - Get fuel record by ID
- `POST /` - Create fuel record (Admin)
- `PUT /:id` - Update fuel record (Admin)
- `DELETE /:id` - Delete fuel record (Admin)

### Maintenance (`/api/maintenances`) - Admin Only

- `GET /` - Get all maintenance records
- `GET /stats` - Get maintenance statistics
- `GET /vehicle/:vehicleId` - Get maintenance by vehicle
- `GET /alerts/all` - Check all maintenance alerts
- `GET /alerts/vehicle/:vehicleId` - Check vehicle maintenance alerts
- `GET /:id` - Get maintenance by ID
- `POST /` - Create maintenance record
- `PUT /:id` - Update maintenance record
- `PATCH /:id/status` - Update maintenance status
- `DELETE /:id` - Delete maintenance record

### Maintenance Rules (`/api/maintenances/rules`) - Admin Only

- `GET /` - Get all maintenance rules
- `GET /:id` - Get maintenance rule by ID
- `POST /` - Create maintenance rule
- `PUT /:id` - Update maintenance rule
- `DELETE /:id` - Delete maintenance rule

## 💡 For Front-End Developers / AI

### Key Features:

1. **Interactive API Testing** - Test all endpoints directly from the browser
2. **Complete Schema Definitions** - All request/response models documented
3. **Example Values** - Pre-filled examples for easy testing
4. **Validation Rules** - Min/max lengths, enums, required fields documented
5. **Authentication Flow** - Complete auth workflow documented

### Using Swagger for Front-End Development:

#### 1. **Generate TypeScript Interfaces**

You can auto-generate TypeScript types from the OpenAPI spec:

```bash
npx openapi-typescript http://localhost:5000/api-docs -o src/types/api.ts
```

#### 2. **Generate API Client**

Auto-generate API client code:

```bash
npx swagger-typescript-api -p http://localhost:5000/api-docs -o src/api -n apiClient.ts
```

#### 3. **Manual Reference**

Use Swagger UI to understand:

- Required vs optional fields
- Data types and formats
- Available enum values
- Response structures
- Error formats

### Example API Call Structure:

```typescript
// Example: Login Request
POST /api/auth/login
Headers: {
  "Content-Type": "application/json"
}
Body: {
  "email": "admin@example.com",
  "password": "password123"
}

// Response:
{
  "_id": "...",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "accountStatus": "approved",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

// Example: Create Truck (Authenticated)
POST /api/trucks
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}
Body: {
  "matricule": "TRK-001",
  "brand": "Volvo",
  "model": "FH16",
  "yearOfManufacture": 2020,
  "fuelType": "Diesel",
  "currentMileage": 150000
}
```

## 🎨 Data Models Reference

### Key Enums:

**User Roles:**

- `admin` - Full system access
- `chauffeur` - Driver with limited access

**Account Status:**

- `pending` - Awaiting approval
- `approved` - Account active
- `rejected` - Account rejected

**Vehicle Status:**

- `Disponible` - Available
- `En Mission` - On mission
- `En Maintenance` - Under maintenance

**Trip Status:**

- `À faire` - To do
- `En cours` - In progress
- `Terminé` - Completed

**Maintenance Types:**

- `Tire Replacement`
- `Oil Change`
- `Vehicle Revision`
- `Other`

**Maintenance Status:**

- `Scheduled`
- `In Progress`
- `Completed`
- `Cancelled`

**License Types:**

- `B`, `C`, `D`, `EC`

**Fuel Types:**

- `Diesel`, `Gasoline`, `Other`

**Trailer Types:**

- `Frigo`, `Plateau`, `Fourgon`, `Citerne`, `Benne`, `Porte-conteneur`

**Tire Status:**

- `Bon` - Good
- `À remplacer` - To replace
- `Usé` - Worn out

## 🔧 Updating Documentation

### Adding New Endpoints:

1. Create/update YAML file in `docs/routes/`
2. Follow existing structure
3. Server auto-reloads documentation

### Adding New Models:

1. Create/update YAML file in `docs/schemas/`
2. Define all properties with types and examples
3. Reference in routes using `$ref: '#/components/schemas/ModelName'`

### Example Schema Definition:

```yaml
components:
  schemas:
    YourModel:
      type: object
      required:
        - field1
        - field2
      properties:
        field1:
          type: string
          example: "example value"
        field2:
          type: number
          minimum: 0
          example: 100
```

### Example Route Definition:

```yaml
/your-endpoint:
  post:
    tags:
      - YourTag
    summary: Short description
    description: Detailed description
    security:
      - bearerAuth: []
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/YourModel"
    responses:
      "201":
        description: Success
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/YourModel"
```

## 📝 Notes for Front-End AI / Copilot

**IMPORTANT:**

- ✅ **DO:** Use this documentation to understand API structure
- ✅ **DO:** Generate front-end services, hooks, and types based on these schemas
- ✅ **DO:** Respect authentication requirements and role-based access
- ✅ **DO:** Handle all documented error responses
- ❌ **DON'T:** Modify any backend code or endpoints
- ❌ **DON'T:** Generate backend logic or controllers
- ❌ **DON'T:** Change authentication mechanisms

**Recommended Front-End Implementation:**

1. Create API service layer matching Swagger endpoints
2. Generate TypeScript interfaces from schemas
3. Implement JWT token management (storage, refresh, expiry)
4. Create route guards for role-based access
5. Handle error responses consistently
6. Implement loading states for all API calls
7. Add proper form validation matching schema requirements

## 🚀 Testing the API

### Using Swagger UI:

1. Navigate to `http://localhost:5000/api-docs`
2. Click "Authorize" and enter your JWT token
3. Expand any endpoint
4. Click "Try it out"
5. Fill in parameters/body
6. Click "Execute"
7. View response

### Using Postman:

1. Import OpenAPI spec: `http://localhost:5000/api-docs`
2. Configure environment variables for base URL and token
3. Test all endpoints

## 📧 Support

For questions about the API or documentation:

- Review Swagger UI at `/api-docs`
- Check schema definitions in `docs/schemas/`
- Check route documentation in `docs/routes/`

---

**Last Updated:** December 11, 2025
**API Version:** 1.0.0
**Documentation Format:** OpenAPI 3.0.0
