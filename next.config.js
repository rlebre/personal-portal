module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/academic',
        destination: 'https://ruilebre.com/academic',
      },
    ];
  },
};
