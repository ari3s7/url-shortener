# URL Shortener API

A backend URL shortening service built with TypeScript, Express.js, PostgreSQL, Prisma, and Neon.

## Features

* Create short URLs
* Redirect to original URLs
* Track click analytics
* Update existing URLs
* Delete URLs
* Rate limiting on URL creation
* PostgreSQL database with Prisma ORM

## Tech Stack

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* Neon Database

## API Endpoints

### Create Short URL

```http
POST /api/urls
```

Request:

```json
{
  "originalUrl": "https://google.com"
}
```

Response:

```json
{
  "shortCode": "abc123",
  "shortUrl": "http://localhost:3000/abc123"
}
```

### Redirect URL

```http
GET /:shortCode
```

### Get URL Statistics

```http
GET /api/urls/:shortCode/stats
```

### Update URL

```http
PUT /api/urls/:shortCode
```

Request:

```json
{
  "originalUrl": "https://github.com"
}
```

### Delete URL

```http
DELETE /api/urls/:shortCode
```

