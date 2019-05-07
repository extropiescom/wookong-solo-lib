import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-cpy';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;

const plugins = targets => ([
  resolve(),
  babel({
    exclude: 'node_modules/**',
    runtimeHelpers: true,
    babelrc: false,
    presets: [
      ['env', { modules: false, targets }],
      'stage-0',
    ],
    plugins: ['babel-plugin-transform-object-rest-spread'],
    comments: false,
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(env),
  }),
  commonjs(),
  copy({
    files: ['src/core/dll/*.*'],
    dest: 'lib/dll',
  }),
  (process.env.NODE_ENV === 'production' && uglify()),
]);

const external = ['fastcall', 'usb', 'mutexify', 'bluebird'];

export default [{
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    sourcemap: false,
  },
  external,
  plugins: plugins({ node: '8' }),
}];
