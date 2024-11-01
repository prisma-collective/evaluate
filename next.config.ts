import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbo: {
    // Placeholder configuration to acknowledge Turbopack usage
    // Customize as needed for additional loaders, aliases, etc.
    moduleIdStrategy: 'deterministic', // Optional for consistent module IDs in production
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'], // Custom file extensions
  },
  serverExternalPackages: ['grammy']
}

export default nextConfig