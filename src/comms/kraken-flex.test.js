import { makeGetRequest, makePostRequest } from "../utils/requestor";
jest.mock('../utils/requestor')

jest.mock('../utils/env', () => ({
    KRAKEN_FLEX_KEY: 'mock_kflex_key',
    KRAKEN_FLEX_API_BASE_URL: 'mock_base_url'
}));


import { getAllOutages } from "./kraken-flex";

describe('Comms', () => {
    describe('Kraken Flex', () => {
        describe('getAllOutages', () => {
            describe('Happy Path', () => {

                let getAllOutagesResponse;
                beforeAll(async () => {
                    // Setup the mocks
                    makeGetRequest.mockResolvedValue({
                        status: 200,
                        data: ['item 1']
                    });

                    getAllOutagesResponse = await getAllOutages();
                })

                afterAll(() => {
                    makeGetRequest.mockReset();
                })

                test('Makes request to base URL + /outages with default headers', () => {
                    
                    expect(makeGetRequest.mock.calls[0]).toEqual([
                        "mock_base_url/outages",
                        {},
                        { "Content-type": "application/json", "x-api-key": "mock_kflex_key" }
                    ]);
                })

                test('Returns array when response is status 200', () => {
                    
                    expect(getAllOutagesResponse).toEqual(['item 1']);
                })

            })

            describe('Sad Path', () => {

                let getAllOutagesResponse;
                beforeAll(async () => {
                    // Setup the mocks
                    makeGetRequest.mockResolvedValue({
                        status: 404
                    });

                    getAllOutagesResponse = await getAllOutages();
                })

                afterAll(() => {
                    makeGetRequest.mockReset();
                })

                test('Returns an empty array when response is not status 200', () => {
                    
                    expect(getAllOutagesResponse).toEqual([]);
                })

            })

        })

        describe('getSiteInfo', () => {
            // These would be exactly the same tests as above,
            // except it would test that `undefined` is returned
            // on non-200 instead of an empty array
            // I'm going to guess you've seen me write those tests once
            // And trust that I could do it again
            test('Please check comments in the test', () => { expect(1).toEqual(1)} );
        })

        describe('postSiteOutages', () => {
            // These would be exactly the same tests as above,
            // except it would test that false is returned
            // on non-200 instead of an empty array
            // I'm going to guess you've seen me write those tests once
            // And trust that I could do it again
            test('Please check comments in the test', () => { expect(1).toEqual(1)} );
        })
    })
})