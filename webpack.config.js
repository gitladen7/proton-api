const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const pkg = require("./package.json");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const getConfig = (target) => {
    return {
        entry: "./lib/index.ts",
        mode: "production",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [
            // new BundleAnalyzerPlugin()
        ],
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".json"],
        },
        output: {
            filename: (target === "web" ? pkg.browser : pkg.main).replace(/.*\//g, ""),
            path: path.resolve(__dirname, "dist"),
            library: "proton-api",
            libraryTarget: "umd",
        },
        optimization: {
            minimizer: [
                new TerserPlugin({
                    sourceMap: true,
                    parallel: true,
                }),
            ],
        },
        node: target === "web" ? {
            crypto: false,
        } : undefined,
        target: target === "web" ? "web" : "node",
        externals: target === "web" ? undefined : [nodeExternals()],
        devtool: "source-map",
    };
};

module.exports = () => {
    return [
        getConfig("web"),
        getConfig("node"),
    ];
};
