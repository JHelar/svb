module.exports = {
    chainWebpack: config => {
        config.optimization.delete('splitChunks');
        // Safari bug fix
        if (process.env.NODE_ENV === 'development') {
            config
            .output
            .filename('[name].[hash].js') 
            .end() 
        }
    },
    productionSourceMap: true
}