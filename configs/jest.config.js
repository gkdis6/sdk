// module.exports = {
// 	rootDir: '../',
// 	preset: 'ts-jest',
// 	testEnvironment: 'node',
// 	transformIgnorePatterns: ["<rootDir>/node_modules/(?!axios-mock-adapter)"],
// 	verbose: true,
// 	transform: {
// 		'^.+\\.ts?$' : ['ts-jest',{tsconfig:'<rootDir>/configs/tsconfig.cjs.json'}],
// 	},
// };

export default {
	rootDir: '../',
	preset: 'ts-jest',
	testEnvironment: 'node',
	transformIgnorePatterns: ["<rootDir>/node_modules"],
	verbose: true,
	transform: {
		'^.+\\.ts?$': ['ts-jest',{tsconfig:'<rootDir>/configs/tsconfig.esm.json'}],
	},
	testMatch:  ["<rootDir>/tests/**/*.spec.[jt]s?(x)"],
};