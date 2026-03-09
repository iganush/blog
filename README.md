# Blogify

Blogify is a full-stack blogging platform built with Node.js, Express, MongoDB, and EJS. It lets users create an account, publish blogs, upload cover images, explore posts by category, search for blogs or users, and interact through likes, comments, and follows.

## Overview

The project uses server-side rendering with EJS and stores data in MongoDB through Mongoose. Authentication is handled with JWT tokens stored in cookies, and blog cover images are uploaded with Multer.

## Features

- User signup, signin, and logout
- Cookie-based authentication with JWT
- Create blog posts with title, body, category, and optional cover image
- View latest blogs on the homepage
- Trending blog section based on likes
- Search blogs and users from the homepage
- Filter blogs by category
- Like and unlike blog posts
- Add comments to blog posts
- Public user profile pages
- Follow and unfollow other users
- Suggested users section
- Delete a blog post if you are the author

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- Cookie Parser
- JSON Web Token
- Multer
- Nodemon

## Project Structure

```text
blog/
|-- index.js
|-- package.json
|-- middlewares/
|   `-- authentication.js
|-- models/
|   |-- blog.js
|   |-- comment.js
|   `-- user.js
|-- routes/
|   |-- blog.js
|   `-- user.js
|-- services/
|   `-- auth.js
|-- public/
|   |-- images/
|   `-- uploads/
`-- views/
    |-- home.ejs
    |-- blog.ejs
    |-- addBlog.ejs
    |-- profile.ejs
    |-- signin.ejs
    `-- Signup.ejs
```

## Main Modules

### User Module

The user module handles account creation, login, logout, profile viewing, and follow or unfollow actions.

### Blog Module

The blog module handles blog creation, blog detail pages, category selection, cover image uploads, likes, comments, and deletion by the author.

### Authentication Module

Authentication is managed through JWT tokens stored in cookies. A middleware reads the token on each request and attaches the logged-in user payload to `req.user`.

## Data Models

### User

Stores:

- full name
- email
- password hash
- salt
- bio
- profile image URL
- role
- followers
- following

### Blog

Stores:

- title
- body
- cover image URL
- category
- likes count
- liked by users
- author reference

### Comment

Stores:

- comment content
- blog reference
- author reference

## Dependencies Used

### Production Dependencies

- `express` - Main backend framework for routes, middleware, and server logic.
- `mongoose` - Connects the app to MongoDB and manages schemas and queries.
- `dotenv` - Loads environment variables from the `.env` file.
- `ejs` - Renders dynamic server-side views.
- `cookie-parser` - Parses cookies so auth tokens can be read from requests.
- `jsonwebtoken` - Creates and verifies JWT tokens for authentication.
- `multer` - Handles cover image uploads and stores files in `public/uploads`.

### Development Dependency

- `nodemon` - Restarts the server automatically during development when files change.

## Prerequisites

Make sure the following are installed on your system:

- Node.js
- npm
- MongoDB

## Environment Variables

Create a `.env` file in the project root and add:

```env
MONGODB_URL=mongodb://127.0.0.1:27017/blogify
PORT=3001
```

### Important Note

The MongoDB connection string is read from `.env`, but the JWT signing secret is currently hardcoded inside `services/auth.js`. For production use, move that secret to an environment variable.

## Installation

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Start in normal mode:

```bash
npm start
```

The app runs on:

```text
http://localhost:3001
```

If `PORT` is set in `.env`, that value will be used instead.

## Available Scripts

- `npm run dev` - Runs the app with Nodemon
- `npm start` - Runs the app with Node.js
- `npm test` - Placeholder script, currently not configured

## How Authentication Works

1. A user signs up or signs in.
2. The server creates a JWT token.
3. The token is stored in a cookie named `token`.
4. The authentication middleware validates the token on future requests.
5. If valid, the user payload is attached to `req.user`.

## Upload Behavior

- Blog cover images are uploaded using Multer.
- Files are stored inside `public/uploads/<userId>/`.
- The uploaded file path is saved with the blog document and used while rendering pages.

## Current Functionality on the Homepage

The homepage currently supports:

- latest blogs
- trending blogs
- category filtering
- search by blogs or users
- suggested users for logged-in users

## Limitations

- No automated tests are configured yet.
- JWT secret is hardcoded and should be moved to `.env`.
- This project uses server-rendered EJS pages instead of a separate frontend client.

## License

This project uses the ISC license.
