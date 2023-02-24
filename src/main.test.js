import { DateTime } from "luxon";

import { getAllOutages, getSiteInfo, postSiteOutages } from "./comms/kraken-flex";
jest.mock('./comms/kraken-flex');

import { enrichSiteOutageData, filterOutagesBySite, filterOutagesSince } from "./utils/filters-and-enrichers";
jest.mock('./utils/filters-and-enrichers');

import { main } from "./main";

describe('Main', () => {
    describe('Happy Path', () => {

        let mainResult;
        beforeAll(async () => {
            // Setup mocks

            // Those mocks don't need to have the right shape
            // As all the functions using the data are also mocked
            getAllOutages.mockResolvedValue([
                'one item'
            ]);

            filterOutagesSince.mockReturnValue([
                'one item'
            ])

            getSiteInfo.mockResolvedValue({
                any: 'thing'
            })

            filterOutagesBySite.mockReturnValue([
                'one item'
            ])

            enrichSiteOutageData.mockReturnValue([
                'one item with some more data, for fun'
            ])

            postSiteOutages.mockResolvedValue(true);

            // Call the function
            mainResult = await main('twin-pines-mall', DateTime.fromISO('1955-11-05T06:15:00.000Z'));
        })

        afterAll(() => {
            jest.resetAllMocks();
        })

        test('Calling main calls getAllOutages', () => {
            expect(getAllOutages).toHaveBeenCalledTimes(1)
        }) 

        test('Calling main calls filterOutagesSince with correct inputs', () => {
            expect(filterOutagesSince).toHaveBeenCalledTimes(1)
            expect(filterOutagesSince).toHaveBeenCalledWith([
                'one item'
            ], DateTime.fromISO('1955-11-05T06:15:00.000Z'))
        }) 

        test('Calling main calls getSiteInfo with given siteID', () => {
            expect(getSiteInfo).toHaveBeenCalledTimes(1)
            expect(getSiteInfo).toHaveBeenCalledWith('twin-pines-mall')
        }) 

        test('Calling main calls filterOutagesBySite with correct inputs', () => {
            expect(filterOutagesBySite).toHaveBeenCalledTimes(1)
            expect(filterOutagesBySite).toHaveBeenCalledWith({
                any: 'thing'
            }, [
                'one item'
            ])
        }) 

        test('Calling main calls enrichSiteOutageData with correct inputs', () => {
            expect(enrichSiteOutageData).toHaveBeenCalledTimes(1)
            expect(enrichSiteOutageData).toHaveBeenCalledWith([
                'one item'
            ], {
                any: 'thing'
            })
        }) 

        test('Calling main calls postSiteOutages with correct inputs', () => {
            expect(postSiteOutages).toHaveBeenCalledTimes(1)
            expect(postSiteOutages).toHaveBeenCalledWith('twin-pines-mall',[
                'one item with some more data, for fun'
            ])
        }) 

        test('main returns true', () => {
            expect(mainResult).toEqual(true)
        }) 
    })  
})