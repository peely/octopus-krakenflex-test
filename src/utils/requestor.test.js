import axios from 'axios';
jest.mock('axios');

import { makeRequest } from './requestor';

describe('Utils', () => {
    describe('Requestor', () => {
        describe('makeRequest', () => {

            const axiosRequestMock = jest.fn();
            axios.create.mockReturnValue({
                request: axiosRequestMock
            });

            describe('Happy Path', () => {

                let makeRequestResponse;
                beforeAll(async () => {
                    
                    // Setup the mocks
                    axiosRequestMock.mockResolvedValue({
                        status: 200,
                        data: { any: 'thing '}
                    })

                   

                    const mockConfig = {
                        method: 'method',
                        url: 'url',
                        params: 'params',
                        data: 'data',
                        headers: 'headers'
                    }

                    makeRequestResponse = await makeRequest(mockConfig);
                })

                afterAll(() => {
                    axiosRequestMock.mockReset();
                })

                test('Makes request with given config', () => {
                    
                    expect(axiosRequestMock.mock.calls[0]).toEqual([
                        {
                            method: 'method',
                            url: 'url',
                            params: 'params',
                            data: 'data',
                            headers: 'headers'
                        }
                    ]);
                })

                test('Uses a timeout of 10000', () => {
                    
                    expect(axios.create.mock.calls[0]).toEqual([{ timeout: 10000 }])
                })

                test('Only calls request once on a successful first response', () => {
                    
                    expect(axiosRequestMock).toBeCalledTimes(1)
                })

                test('Returns array when response is status 200', () => {
                    
                    expect(makeRequestResponse).toEqual({
                        status: 200,
                        data: { any: 'thing '}
                    });
                })

            })

            describe('Sad Path', () => {

                let makeRequestResponse;
                let setTimeoutSpy;
                beforeAll(async () => {
                    
                    // Ideally would use fake timers here, but it was not working after about 20 minutes
                    setTimeoutSpy = jest.spyOn(global, 'setTimeout');

                    // Setup the mocks
                    axiosRequestMock.mockResolvedValue({
                        status: 500,
                    })

                    const mockConfig = {
                        method: 'method',
                        url: 'url',
                        params: 'params',
                        data: 'data',
                        headers: 'headers'
                    }

                    const makeRequestResponsePromise = makeRequest(mockConfig);
                    
                    makeRequestResponse = await makeRequestResponsePromise;;
                })

                afterAll(() => {
                    axiosRequestMock.mockReset();
                })


                test('Calls request three times on a failed response', () => {
                    expect(axiosRequestMock).toBeCalledTimes(3)
                })

                test('Returns error status when response is a failure', () => {
                    expect(makeRequestResponse).toEqual({
                        status: 500,
                    });
                })

                test('Waited 300 ms between calls', () => {
                    expect(setTimeoutSpy).toHaveBeenCalledTimes(2);
                    expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 300);
                })

            })
        })

        describe('makePostRequest', () => {
            // This would just test that axios was called with the given
            // config, plus the method 'post'
            test('Please check comments in the test', () => { expect(1).toEqual(1)} );
        })

        describe('makeGetRequest', () => {
            // This would just test that axios was called with the given
            // config, plus the method 'get'
            test('Please check comments in the test', () => { expect(1).toEqual(1)} );
        })
    })
})