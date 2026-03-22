const path = require('path')

module.exports = {
	mode: 'development',
	entry: './src/index.ts',
	devtool: 'source-map',
	devServer: {
		port: 9000,
		static: {
			serveIndex: true,
			directory: __dirname
		}
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: ['style-loader', 'css-loader'],
			},
		]
	},
	watchOptions: {
		ignored: [
			'**/node_modules/**',
			'**/_working/**',
			'**/*.afphoto'
		]
	}
}
