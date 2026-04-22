import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

function readEnvValue(name) {
  const value = process.env[name];
  if (!value) return "";
  return value.trim().replace(/^['"]|['"]$/g, "");
}

export function hasCloudinaryCredentials() {
  return Boolean(
    readEnvValue("CLOUDINARY_CLOUD_NAME") &&
      readEnvValue("CLOUDINARY_API_KEY") &&
      readEnvValue("CLOUDINARY_API_SECRET")
  );
}

export function getCloudinaryClient() {
  if (!hasCloudinaryCredentials()) {
    return null;
  }

  if (!isConfigured) {
    cloudinary.config({
      cloud_name: readEnvValue("CLOUDINARY_CLOUD_NAME"),
      api_key: readEnvValue("CLOUDINARY_API_KEY"),
      api_secret: readEnvValue("CLOUDINARY_API_SECRET"),
    });
    isConfigured = true;
  }

  return cloudinary;
}

export async function uploadImageBuffer(buffer, options = {}) {
  const client = getCloudinaryClient();
  if (!client) {
    return null;
  }

  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function deleteCloudinaryAsset(publicId) {
  const client = getCloudinaryClient();
  if (!client || !publicId) {
    return;
  }

  await client.uploader.destroy(publicId, {
    resource_type: "image",
  });
}
