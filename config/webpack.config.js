/* eslint-disable prefer-spread */
/* eslint-disable prefer-rest-params */
/* eslint-disable global-require */

const webpack = require('webpack');
const path = require('path');

const appRoot = path.resolve(__dirname, '..');

function root() {
    const newArgs = Array.prototype.slice.call(arguments, 0);

    return path.join.apply(path, [appRoot].concat(newArgs));
}

const plugins = {
    // https://github.com/webpack-contrib/mini-css-extract-plugin
    MiniCssExtractPlugin: require('mini-css-extract-plugin'),
    // https://github.com/dividab/tsconfig-paths-webpack-plugin
    TsconfigPathsPlugin: require('tsconfig-paths-webpack-plugin'),
    // https://github.com/aackerman/circular-dependency-plugin
    CircularDependencyPlugin: require('circular-dependency-plugin'),
    // https://github.com/jantimon/html-webpack-plugin
    HtmlWebpackPlugin: require('html-webpack-plugin'),
    // https://webpack.js.org/plugins/terser-webpack-plugin/
    TerserPlugin: require('terser-webpack-plugin'),
    // https://github.com/NMFR/optimize-css-assets-webpack-plugin
    CssMinimizerPlugin: require('css-minimizer-webpack-plugin'),
    // https://webpack.js.org/plugins/eslint-webpack-plugin/
    ESLintPlugin: require('eslint-webpack-plugin'),
    // https://github.com/webpack-contrib/stylelint-webpack-plugin
    StylelintPlugin: require('stylelint-webpack-plugin'),
    // https://www.npmjs.com/package/webpack-bundle-analyzer
    BundleAnalyzerPlugin: require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    // https://github.com/jantimon/favicons-webpack-plugin
    FaviconsWebpackPlugin: require('favicons-webpack-plugin'),
    // https://github.com/GoogleChrome/workbox/tree/master/packages/workbox-webpack-plugin
    GenerateSW: require('workbox-webpack-plugin').GenerateSW,
};

module.exports = function configure(env) {
    const isProduction = env && env.production;
    const isTests = env && env.target === 'tests';
    const isTestCoverage = env && env.coverage;
    const isAnalyzing = isProduction && env.analyze;

    const config = {
        mode: isProduction ? 'production' : 'development',

        /**
         * Source map for Karma from the help of karma-sourcemap-loader & karma-webpack.
         *
         * See: https://webpack.js.org/configuration/devtool/
         */
        devtool: isProduction ? false : 'inline-source-map',

        /**
         * Options affecting the resolving of modules.
         *
         * See: https://webpack.js.org/configuration/resolve/
         */
        resolve: {
            /**
             * An array of extensions that should be used to resolve modules.
             *
             * See: https://webpack.js.org/configuration/resolve/#resolve-extensions
             */
            extensions: ['.ts', '.tsx', '.js', '.mjs', '.css', '.scss'],
            modules: [
                root('src'),
                root('src', 'style'),
                root('node_modules'),
            ],

            plugins: [
                new plugins.TsconfigPathsPlugin({
                    configFile: 'tsconfig.json',
                }),
            ],

            fallback: {
                'react/jsx-runtime': 'react/jsx-runtime.js',
                'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
            },
        },

        /**
         * Options affecting the normal modules.
         *
         * See: https://webpack.js.org/configuration/module/
         */
        module: {
            /**
             * An array of Rules which are matched to requests when modules are created.
             *
             * See: https://webpack.js.org/configuration/module/#module-rules
             */
            rules: [{
                test: /\.html$/,
                use: [{
                    loader: 'raw-loader',
                }],
            }, {
                test: /\.d\.ts?$/,
                use: [{
                    loader: 'ignore-loader',
                }],
                include: [/node_modules/],
            }, {
                test: /\.(png|jpe?g|gif|svg|ico)(\?.*$|$)/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[contenthash].[ext]',

                        // Store the assets in custom path because of fonts need relative urls.
                        outputPath: 'assets',
                    },
                }],
            }, {
                test: /\.css$/,
                use: [{
                    loader: plugins.MiniCssExtractPlugin.loader,
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'postcss-loader',
                }],
            }],
        },

        plugins: [
            /**
             * Puts each bundle into a file without the hash.
             *
             * See: https://github.com/webpack-contrib/mini-css-extract-plugin
             */
            new plugins.MiniCssExtractPlugin({
                filename: '[name].css',
            }),

            new webpack.LoaderOptionsPlugin({
                options: {
                    htmlLoader: {
                        /**
                         * Define the root for images, so that we can use absolute urls.
                         *
                         * See: https://github.com/webpack/html-loader#Advanced_Options
                         */
                        root: root('src', 'images'),
                    },
                    context: '/',
                },
            }),

            new plugins.FaviconsWebpackPlugin({
                // Favicon source logo
                logo: 'src/images/logo-square.png',
                // Favicon app title
                title: 'CodeSlide',
                favicons: {
                    appName: 'codeslide.net',
                    appDescription: 'Open Source Presentation Animation Editor',
                    developerName: 'Do Duc Quan',
                    developerUrl: 'https://www.dodquan.com',
                    start_url: '/',
                },
            }),

            new plugins.StylelintPlugin({
                files: '**/*.scss',
            }),

            /**
             * Detect circular dependencies in app.
             *
             * See: https://github.com/aackerman/circular-dependency-plugin
             */
            new plugins.CircularDependencyPlugin({
                exclude: /([\\/]node_modules[\\/])/,
                // Add errors to webpack instead of warnings
                failOnError: true,
            }),
        ],

        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            historyApiFallback: true,
        },
    };

    if (!isTests) {
        /**
         * The entry point for the bundle. Our React app.
         *
         * See: https://webpack.js.org/configuration/entry-context/
         */
        config.entry = {
            src: './src/index.tsx',
        };

        if (isProduction) {
            config.output = {
                /**
                 * The output directory as absolute path (required).
                 *
                 * See: https://webpack.js.org/configuration/output/#output-path
                 */
                path: root('/build/'),

                publicPath: './',

                /**
                 * Specifies the name of each output file on disk.
                 *
                 * Do NOT append hash to service worker in development mode, so we can load them directly.
                 *
                 * See: https://webpack.js.org/configuration/output/#output-filename
                 */
                filename: (pathData) => {
                    return pathData.chunk.name === 'src' ? '[name].[contenthash:8].js' : '[name].js';
                },

                /**
                 * The filename of non-entry chunks as relative path inside the output.path directory.
                 *
                 * See: https://webpack.js.org/configuration/output/#output-chunkfilename
                 */
                chunkFilename: '[id].[contenthash].chunk.js',
            };
        } else {
            config.output = {
                filename: '[name].[contenthash].js',

                /**
                 * Set the public path, because we are running the website from another port (5000).
                 */
                publicPath: 'https://localhost:3002/',

                /*
                 * Fix a bug with webpack dev server.
                 *
                 * See: https://github.com/webpack-contrib/worker-loader/issues/174
                 */
                globalObject: 'this',
            };
        }

        config.plugins.push(
            new plugins.HtmlWebpackPlugin({
                hash: true,
                chunks: ['src'],
                chunksSortMode: 'manual',
                template: 'src/index.html',
            }),
            new plugins.HtmlWebpackPlugin({
                hash: true,
                chunks: ['src'],
                chunksSortMode: 'manual',
                template: 'src/index.html',
                filename: '404.html',
            }),
        );

        config.plugins.push(
            new plugins.ESLintPlugin({
                files: [
                    './src/**/*.ts',
                ],
            }),
        );
    }

    if (isProduction) {
        config.optimization = {
            minimizer: [
                new plugins.TerserPlugin({
                    terserOptions: {
                        compress: true,
                        ecma: 5,
                        mangle: true,
                        output: {
                            comments: false,
                        },
                        safari10: true,
                    },
                    extractComments: true,
                }),

                new plugins.CssMinimizerPlugin({}),
            ],
        };

        config.performance = {
            hints: false,
        };
    }

    if (isTestCoverage) {
        // Do not instrument tests.
        config.module.rules.push({
            test: /\.ts[x]?$/,
            use: [{
                loader: 'ts-loader',
            }],
            include: [/\.(e2e|spec)\.ts$/],
        });

        // Use instrument loader for all normal files.
        config.module.rules.push({
            test: /\.ts[x]?$/,
            use: [{
                loader: '@jsdevtools/coverage-istanbul-loader?esModules=true',
            }, {
                loader: 'ts-loader',
            }],
            exclude: [/\.(e2e|spec)\.ts$/],
        });
    } else {
        config.module.rules.push({
            test: /\.ts[x]?$/,
            use: [{
                loader: 'ts-loader',
            }],
        });
    }

    if (isProduction) {
        config.plugins.push(new plugins.GenerateSW({
            swDest: 'service-worker2.js',

            // Do not wait for activation
            skipWaiting: true,

            // Cache until 5MB
            maximumFileSizeToCacheInBytes: 5000000000,
        }));
    }

    if (isProduction) {
        config.module.rules.push({
            test: /\.scss$/,
            /*
             * Extract the content from a bundle to a file.
             *
             * See: https://github.com/webpack-contrib/extract-text-webpack-plugin
             */
            use: [
                plugins.MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                }, {
                    loader: 'postcss-loader',
                }, {
                    loader: 'sass-loader',
                }],
        });
    } else {
        config.module.rules.push({
            test: /\.scss$/,
            use: [{
                loader: 'style-loader',
            }, {
                loader: 'css-loader',
            }, {
                loader: 'postcss-loader',
            }, {
                loader: 'sass-loader',
                options: {
                    sourceMap: true,
                },
            }],
        });
    }

    if (isAnalyzing) {
        config.plugins.push(new plugins.BundleAnalyzerPlugin());
    }

    return config;
};
