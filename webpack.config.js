const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader",
						options: { minimize: true }
					}
				]
			},
			{
				test: /\.s[ac]ss$/i,
				use: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: "url-loader",
					options: {
						limit: 50000,
						mimetype: "application/font-woff",
						name: "./fonts/[name].[ext]"
					}
				}
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: "url-loader",
					options: {
						limit: 50000,
						name: "./fonts/[name].[ext]"
					}
				}
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: ["file-loader"]
			}
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filename: "./index.html"
		}),
		new HtmlWebPackPlugin({
			template: "./src/404.html",
			filename: "./404.html"
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery"
		})
	]
};
