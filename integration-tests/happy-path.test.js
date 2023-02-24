jest.mock('axios');
import axios from 'axios';

describe('Integration Tets', () => {
    describe('Calls outages, calls site info, filters, enriches, and posts results', () => {

        const axiosRequestMock = jest.fn();
        beforeAll(async () => {
            // setup mocks

            axios.create.mockReturnValue({
                request: axiosRequestMock
            });

            axiosRequestMock.mockResolvedValueOnce({
                status: 200,
                data: [
                    {
                        id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
                        begin: '2021-07-26T17:09:31.036Z',
                        end: '2021-08-29T00:37:42.253Z'
                    },
                    {
                        id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
                        begin: '2022-05-23T12:21:27.377Z',
                        end: '2022-11-13T02:16:38.905Z'
                    },
                    {
                        id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
                        begin: '2022-12-04T09:59:33.628Z',
                        end: '2022-12-12T22:35:13.815Z'
                    },
                    {
                        id: '04ccad00-eb8d-4045-8994-b569cb4b64c1',
                        begin: '2022-07-12T16:31:47.254Z',
                        end: '2022-10-13T04:05:10.044Z'
                    },
                    {
                        id: '086b0d53-b311-4441-aaf3-935646f03d4d',
                        begin: '2022-07-12T16:31:47.254Z',
                        end: '2022-10-13T04:05:10.044Z'
                    },
                    {
                        id: '27820d4a-1bc4-4fc1-a5f0-bcb3627e94a1',
                        begin: '2021-07-12T16:31:47.254Z',
                        end: '2022-10-13T04:05:10.044Z'
                    }
                ]
            })

            axiosRequestMock.mockResolvedValueOnce({
                status: 200,
                data:
                {
                    id: 'norwich-pear-tree',
                    name: 'norwich-pear-tree',
                    devices: [
                        { id: '002b28fc-283c-47ec-9af2-ea287336dc1b', name: 'Battery 1' },
                        { id: '086b0d53-b311-4441-aaf3-935646f03d4d', name: 'Battery 2' }
                    ]
                }
            })

            axiosRequestMock.mockResolvedValueOnce({})

            require('../src/index.ts')
        });

        test('The last call to axios has the correct data', () => {
            expect(axiosRequestMock.mock.calls[2]).toEqual([{
                "data": [
                    { "begin": "2022-05-23T12:21:27.377Z", "end": "2022-11-13T02:16:38.905Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b", "name": "Battery 1" },
                    { "begin": "2022-12-04T09:59:33.628Z", "end": "2022-12-12T22:35:13.815Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b", "name": "Battery 1" },
                    { "begin": "2022-07-12T16:31:47.254Z", "end": "2022-10-13T04:05:10.044Z", "id": "086b0d53-b311-4441-aaf3-935646f03d4d", "name": "Battery 2" }
                ],
                "headers": {
                    "Content-type": "application/json",
                    "x-api-key": "test-key"
                },
                "method": "post",
                "url": "http://localhost:3000/site-outages/norwich-pear-tree"
            }]
            )
        })
    })
})