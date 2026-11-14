import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Keep resized copies for 31 days. Safe because a replaced photo always gets a new file name
    // (and admin uploads get a new id), so a stale copy is never served for a changed image.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
