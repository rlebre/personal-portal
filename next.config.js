module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/academic',
        destination: 'https://ruilebre.com/academic',
      },
      {
        source: '/homarr',
        destination: 'https://ruilebre.com/homarr',
      },
    ];
  },
};
