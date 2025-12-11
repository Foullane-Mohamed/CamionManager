import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fleet Management API",
      version: "1.0.0",
      description:
        "API documentation for Fleet Management System - CamionManager",
      contact: {
        name: "API Support",
        email: "support@fleetmanagement.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token obtained from /auth/login endpoint",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            stack: {
              type: "string",
              description: "Stack trace (only in development)",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Authentication and authorization endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints (Admin only)",
      },
      {
        name: "Trucks",
        description: "Truck management endpoints",
      },
      {
        name: "Trailers",
        description: "Trailer management endpoints",
      },
      {
        name: "Tires",
        description: "Tire management endpoints",
      },
      {
        name: "Trips",
        description: "Trip management endpoints",
      },
      {
        name: "Fuel",
        description: "Fuel consumption tracking endpoints",
      },
      {
        name: "Maintenance",
        description: "Maintenance records and rules management endpoints",
      },
    ],
  },
  apis: ["./docs/routes/*.yaml", "./docs/schemas/*.yaml"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
