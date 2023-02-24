module.exports = {
    hasAPIKey: (headers) => {
        const hasAPIKey = !!headers['x-api-key'];
        if(!hasAPIKey) {
            console.log('Request is missing the API key!')
        }

        return hasAPIKey
    },
    defaultConfig: {
        cache: false,
    }
}