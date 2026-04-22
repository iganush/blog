# Blogify

Blogify is an Express + EJS blogging platform with authentication, social follow features, comments, likes, and Cloudinary-powered cover image uploads.

## What's Included

- Cloudinary integration for blog cover images
- Demo seed script for 5 users and 25 posts
- Production-friendly image deletion support
- JWT secret support through environment variables

## Environment Variables

Create a `.env` file in the project root with values like these:

```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=choose_a_strong_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Cloudinary is used automatically when all three Cloudinary variables are present. If they are missing, the app falls back to local uploads inside `public/uploads`.

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

## Seed Demo Data

This command creates:

- 5 demo user accounts
- 25 sample blog posts
- likes, follows, and a few comments for a fuller homepage

Run:

```bash
npm run seed:demo
```

The seed is safe to re-run for the demo accounts listed below. It recreates only those demo users and their related demo content.

## Demo Login Credentials

Use these demo accounts to sign in after running the seed script:

| Name | Email / Login ID | Password |
| --- | --- | --- |
| Aarav Kapoor | `aarav.writer@blogify.demo` | `Aarav@123` |
| Siya Mehta | `siya.codes@blogify.demo` | `Siya@123` |
| Kabir Malhotra | `kabir.growth@blogify.demo` | `Kabir@123` |
| Mira Sen | `mira.life@blogify.demo` | `Mira@123` |
| Rohan Iyer | `rohan.notes@blogify.demo` | `Rohan@123` |

## Scripts

- `npm run dev` starts the app with Nodemon
- `npm start` starts the app normally
- `npm run seed:demo` creates demo users and posts

## Notes

- Cover images uploaded from the app are stored on Cloudinary when configured.
- Demo posts also try to upload generated SVG cover images to Cloudinary during seeding.
- If Cloudinary upload fails while seeding, the posts are still created without remote cover images.
