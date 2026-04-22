import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { deleteCloudinaryAsset, hasCloudinaryCredentials, uploadImageBuffer } from "./cloudinary.js";

function normalizeExtension(file) {
  const originalExt = path.extname(file?.originalname || "").toLowerCase();
  if (originalExt) {
    return originalExt;
  }

  if (file?.mimetype === "image/png") return ".png";
  if (file?.mimetype === "image/webp") return ".webp";
  if (file?.mimetype === "image/gif") return ".gif";
  return ".jpg";
}

function buildLocalFileName(file) {
  return `${Date.now()}-${randomUUID().slice(0, 8)}${normalizeExtension(file)}`;
}

export async function saveBlogCoverImage({ file, userId }) {
  if (!file) {
    return {
      coverImageURL: null,
      coverImagePublicId: null,
    };
  }

  const fileName = buildLocalFileName(file);

  if (hasCloudinaryCredentials()) {
    const uploaded = await uploadImageBuffer(file.buffer, {
      folder: `blogify/blog-covers/${userId}`,
      public_id: path.parse(fileName).name,
      transformation: [
        { width: 1600, height: 900, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    return {
      coverImageURL: uploaded?.secure_url || null,
      coverImagePublicId: uploaded?.public_id || null,
    };
  }

  const uploadDir = path.resolve(`./public/uploads/${userId}`);
  await mkdir(uploadDir, { recursive: true });

  const fullPath = path.join(uploadDir, fileName);
  await writeFile(fullPath, file.buffer);

  return {
    coverImageURL: `/uploads/${userId}/${fileName}`,
    coverImagePublicId: null,
  };
}

export async function removeBlogCoverImage({ coverImageURL, coverImagePublicId }) {
  if (coverImagePublicId) {
    await deleteCloudinaryAsset(coverImagePublicId);
    return;
  }

  if (!coverImageURL || !coverImageURL.startsWith("/uploads/")) {
    return;
  }

  const imagePath = path.resolve(`./public${coverImageURL}`);

  try {
    await unlink(imagePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}
