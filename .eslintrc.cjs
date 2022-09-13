module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        "sourceType": "module"
    },
    extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        'plugin:react-hooks/recommended',
    ],
    rules: {
        "no-unused-vars": "off",    //->关闭eslint内置的,因为它不懂ts
        "@typescript-eslint/no-unused-vars": "warn"  //->开启ts的no-unused-vars
    },
    plugins: [
        //加入这个👇不然找不到插件
        '@typescript-eslint'
    ]
};
