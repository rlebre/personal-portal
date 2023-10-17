
module.exports = {
  'extends': 'next/core-web-vitals',

  'plugins': ['react', 'simple-import-sort'],


  'rules': {
    'quotes': ['error', 'single'],
    'react/no-unescaped-entities': 'off',
  },

  'overrides': [
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      'rules': {
        'simple-import-sort/imports': [
          'error',
          {
            'groups': [
              // Packages `react` related packages come first.
              ['^react', '^@?\\w'],
              // Internal packages.
              ['^(@|components)(/.*|$)'],
              // Side effect imports.
              ['^\\u0000'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // Style imports.
              ['^.+\\.?(css)$']
            ]
          }
        ]
      }
    }
  ]
};