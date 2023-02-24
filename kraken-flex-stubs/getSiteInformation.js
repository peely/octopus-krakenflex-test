const { hasAPIKey, defaultConfig } = require('./common')

module.exports = {
    path: '/site-info/:siteId',
    method: 'GET',
    ...defaultConfig,
    template: (params, query, body, cookies, headers) => {

        let response = null;
        if (!hasAPIKey(headers)) {
            return response;
        }

        if (params.siteId === 'norwich-pear-tree') {
            response = {
                "id": "norwich-pear-tree",
                "name": "norwich-pear-tree",
                "devices": [
                    {
                        "id": "002b28fc-283c-47ec-9af2-ea287336dc1b",
                        "name": "Battery 1"
                    },
                    {
                        "id": "086b0d53-b311-4441-aaf3-935646f03d4d",
                        "name": "Battery 2"
                    }
                ]
            }
        }

        return response;
    }
};