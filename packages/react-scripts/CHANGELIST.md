## Change List

### 11.0.0-beta.7

- Switch `hash` to `contenthash` in `webpack.config.ssr.js`

### 11.0.0-beta.6

- Install `crypto-browserify`, `domain-browser`, `path-browserify`, `stream-browserify` and `browserify-zlib` dependencies
- Change `resolve` configuration in `webpack.config.js` and `webpack.config.ssr.js`
  ```javascript
  {
    resolve: {
      fallback: {
        util: false,
        assert: false,
        crypto: require.resolve('crypto-browserify'),
        domain: require.resolve('domain-browser'),
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        zlib: require.resolve('browserify-zlib'),
      }
    }
  }
  ```

### 11.0.0-beta.5

- Uninstall `eslint`, `eslint-config-react-app` and `eslint-webpack-plugin`
