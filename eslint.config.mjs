import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/scripts/**',
      '**/*.test.ts',
      '**/*.test.js',
      '**/test-*.ts',
      '**/test-*.js',
      '**/check-*.ts',
      '**/check-*.js'
    ]
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off'
    }
  }
];
