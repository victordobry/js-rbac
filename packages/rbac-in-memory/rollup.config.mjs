import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'rbac-in-memory',
    globals: {
      '@brainstaff/rbac': 'rbac'
    }
  },
  plugins: [typescript()],
  external: [
    '@brainstaff/rbac'
  ]
};
