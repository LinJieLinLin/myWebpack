module.exports = {
    plugins: [
        require("autoprefixer")({
            browsers: ['chrome > 35', 'ff > 10', 'opera > 10', 'ie > 6']
        })
    ]
}
