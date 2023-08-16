import babel from 'rollup-plugin-babel'
export default {
  input: 'src/index.js',
  output: {
    file: './dist/vue.js',
    name: 'Vue',
    format: 'umd',
    sourcemap: true, //可以调试源代码
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}
