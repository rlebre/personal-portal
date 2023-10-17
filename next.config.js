/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: () => [
        {
            source: '/academic',
            destination: 'https://ruilebre.com/academic',
        },

    ]
};


module.exports = nextConfig
