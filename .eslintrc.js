// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    'globals': {
        'log': true,
        'DY': true,
        'DYC': true,
        'DIR': true,
        '$': true,
        'ars': true,
        'UINFO': true,
        'OSINFO': true,
        'DYCONFIG': true,
        'rcpAid': true,
        'moment': true,
        'angular': true
    },
    // add your custom rules here
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        //关 强制在 function的左括号之前使用一致的空格
        'space-before-function-paren': 0,
        // 关 句尾不用写“;”
        'semi': 0,
        // 关 不允许 var a,b 形式
        'one-var': 0,
        'no-unused-vars': 0,
        // 关 不允许obj有多余,
        'comma-dangle': 0,
        // 关 最后一行必须留空
        'eol-last': 0,
        // 关 禁止在条件中使用常量表达式
        'no-constant-condition': 0,
        // 关 禁止在字符串和注释之外不规则的空白
        'no-irregular-whitespace': 0,
        // 关 禁用行尾空格
        'no-trailing-spaces': 0,
        //关 缩进
        'indent': 0
    }
};