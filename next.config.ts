/** @type {import("next").NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false, // Чтобы не было 2 рендеров в dev режиме
    transpilePackages: ["antd"],
    experimental: {
        serverActions: {
            allowedOrigins: ["*"],
        },
    },
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    // { key: "Access-Control-Allow-Credentials", value: "true" },
                    // { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                    {
                        key: "Access-Control-Allow-Origin",
                        value: `${process.env.NEXT_PUBLIC_PATH}`,
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,DELETE,PATCH,POST,PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
