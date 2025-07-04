export function optimizeCloudinaryUrl(url: string): string {
  return url.includes("res.cloudinary.com")
    ? url.replace("/upload/", "/upload/f_webp,q_auto/")
    : url;
}
