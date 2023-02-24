const { hasAPIKey, defaultConfig } = require('./common')

module.exports = {
    path: '/site-outages/:siteId',
    method: 'POST',
    ...defaultConfig,
    template: (params, query, body, cookies, headers) => {
        let response = null;
        if (!hasAPIKey(headers)) {
            return response;
        }

        // Console.log so the user can see what is posted to the endpoint
        console.log({
            params, query, body, cookies, headers
        })

        return response;
    }
  };