import { DateTime } from 'luxon'
import {
    filterOutagesSince,
    filterOutagesBySite,
    enrichSiteOutageData
} from './filters-and-enrichers'

import { error } from './logger'
jest.mock('./logger')


describe('Utils', () => {
    describe('Filters and Enrichers', () => {
        describe('filterOutagesSince', () => {
            test('Given an array of outages and a cutoff date, returns array of outages after and equal to the cutoff date', () => {

                const mockAllOutages = [
                    { "begin": "2021-07-26T17:09:31.036Z", "end": "2021-08-29T00:37:42.253Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2021-12-31T23:59:59.999Z", "end": "2022-01-01T00:00:00.001Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-01-01T00:00:00.000Z", "end": "2022-01-01T00:00:00.001Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-01-01T00:00:00.001Z", "end": "2022-01-01T00:00:00.002Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-05-23T12:21:27.377Z", "end": "2022-11-13T02:16:38.905Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-12-04T09:59:33.628Z", "end": "2022-12-12T22:35:13.815Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-07-12T16:31:47.254Z", "end": "2022-10-13T04:05:10.044Z", "id": "04ccad00-eb8d-4045-8994-b569cb4b64c1" },
                    { "begin": "2022-07-12T16:31:47.254Z", "end": "2022-10-13T04:05:10.044Z", "id": "086b0d53-b311-4441-aaf3-935646f03d4d" },
                    { "begin": "2021-07-12T16:31:47.254Z", "end": "2022-10-13T04:05:10.044Z", "id": "27820d4a-1bc4-4fc1-a5f0-bcb3627e94a1" }
                ]

                const cutOffDate = DateTime.fromISO('2022-01-01T00:00:00.000Z');

                const filteredList = filterOutagesSince(mockAllOutages, cutOffDate)

                expect(filteredList).toEqual([
                    { "begin": "2022-01-01T00:00:00.000Z", "end": "2022-01-01T00:00:00.001Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-01-01T00:00:00.001Z", "end": "2022-01-01T00:00:00.002Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-05-23T12:21:27.377Z", "end": "2022-11-13T02:16:38.905Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-12-04T09:59:33.628Z", "end": "2022-12-12T22:35:13.815Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-07-12T16:31:47.254Z", "end": "2022-10-13T04:05:10.044Z", "id": "04ccad00-eb8d-4045-8994-b569cb4b64c1" },
                    { "begin": "2022-07-12T16:31:47.254Z", "end": "2022-10-13T04:05:10.044Z", "id": "086b0d53-b311-4441-aaf3-935646f03d4d" }
                ])
            })

            test('Given an array empty of outages and a cutoff date, return empty array', () => {
                const cutOffDate = DateTime.fromISO('2022-01-01T00:00:00.000Z');

                const filteredList = filterOutagesSince([], cutOffDate)

                expect(filteredList).toEqual([])
            })
        })

        describe('filterOutagesBySite', () => {
            test('Given a site with an array of devices and an array of outages, returns outages for that site only', () => {

                const siteInfo = {
                    devices: [
                        {
                            id: '002b28fc-283c-47ec-9af2-ea287336dc1b'
                        }
                    ]
                }

                const mockCutoffOutages = [
                    { "begin": "2022-01-01T00:00:00.000Z", "end": "2022-01-01T00:00:00.001Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-01-01T00:00:00.001Z", "end": "2022-01-01T00:00:00.002Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-05-23T12:21:27.377Z", "end": "2022-11-13T02:16:38.905Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-12-04T09:59:33.628Z", "end": "2022-12-12T22:35:13.815Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-07-12T16:31:47.254Z", "end": "2022-10-13T04:05:10.044Z", "id": "04ccad00-eb8d-4045-8994-b569cb4b64c1" },
                    { "begin": "2022-07-12T16:31:47.254Z", "end": "2022-10-13T04:05:10.044Z", "id": "086b0d53-b311-4441-aaf3-935646f03d4d" }
                ]

                const filteredList = filterOutagesBySite(siteInfo, mockCutoffOutages)

                expect(filteredList).toEqual([
                    { "begin": "2022-01-01T00:00:00.000Z", "end": "2022-01-01T00:00:00.001Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-01-01T00:00:00.001Z", "end": "2022-01-01T00:00:00.002Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-05-23T12:21:27.377Z", "end": "2022-11-13T02:16:38.905Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-12-04T09:59:33.628Z", "end": "2022-12-12T22:35:13.815Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                ])
            })

            test('Given a site with no devices and an array of outages, returns no outages', () => {

                const siteInfo = {
                    devices: []
                }

                const mockCutoffOutages = [
                    { "begin": "2022-01-01T00:00:00.000Z", "end": "2022-01-01T00:00:00.001Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-01-01T00:00:00.001Z", "end": "2022-01-01T00:00:00.002Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-05-23T12:21:27.377Z", "end": "2022-11-13T02:16:38.905Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-12-04T09:59:33.628Z", "end": "2022-12-12T22:35:13.815Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-07-12T16:31:47.254Z", "end": "2022-10-13T04:05:10.044Z", "id": "04ccad00-eb8d-4045-8994-b569cb4b64c1" },
                    { "begin": "2022-07-12T16:31:47.254Z", "end": "2022-10-13T04:05:10.044Z", "id": "086b0d53-b311-4441-aaf3-935646f03d4d" }
                ]

                const filteredList = filterOutagesBySite(siteInfo, mockCutoffOutages)

                expect(filteredList).toEqual([])
            })

            test('Given a site with an array of devices and an array of no outages, returns no outages', () => {

                const siteInfo = {
                    devices: [
                        {
                            id: '002b28fc-283c-47ec-9af2-ea287336dc1b'
                        }
                    ]
                }

                const mockCutoffOutages = []

                const filteredList = filterOutagesBySite(siteInfo, mockCutoffOutages)

                expect(filteredList).toEqual([])
            })

        })

        describe('enrichSiteOutageData', () => {
            test('Given a site with an array of devices and an array of outages, returns outages for that site with device names appended', () => {

                const siteInfo = {
                    devices: [
                        {
                            id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
                            name: 'Device 1'
                        }
                    ]
                }

                const mockCutoffSiteOutagesWithAndUnknownDevice = [
                    { "begin": "2022-01-01T00:00:00.000Z", "end": "2022-01-01T00:00:00.001Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-01-01T00:00:00.001Z", "end": "2022-01-01T00:00:00.002Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-05-23T12:21:27.377Z", "end": "2022-11-13T02:16:38.905Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                    { "begin": "2022-12-04T09:59:33.628Z", "end": "2022-12-12T22:35:13.815Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b" },
                ]

                const enrichedList = enrichSiteOutageData(mockCutoffSiteOutagesWithAndUnknownDevice, siteInfo)

                expect(enrichedList).toEqual([
                    { "begin": "2022-01-01T00:00:00.000Z", "end": "2022-01-01T00:00:00.001Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b", "name": "Device 1", },
                    { "begin": "2022-01-01T00:00:00.001Z", "end": "2022-01-01T00:00:00.002Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b", "name": "Device 1", },
                    { "begin": "2022-05-23T12:21:27.377Z", "end": "2022-11-13T02:16:38.905Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b", "name": "Device 1", },
                    { "begin": "2022-12-04T09:59:33.628Z", "end": "2022-12-12T22:35:13.815Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1b", "name": "Device 1", },
                ])
            })

            test('Given a site with an array of devices and an array of outages for an unknown device, returns outages for that site with unknown device names appended', () => {

                const siteInfo = {
                    devices: [
                        {
                            id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
                            name: 'Device 1'
                        }
                    ]
                }

                const mockCutoffSiteOutagesWithAndUnknownDevice = [
                    { "begin": "2022-12-04T09:59:33.628Z", "end": "2022-12-12T22:35:13.815Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1c" },
                ]

                const enrichedList = enrichSiteOutageData(mockCutoffSiteOutagesWithAndUnknownDevice, siteInfo)

                expect(enrichedList).toEqual([
                    { "begin": "2022-12-04T09:59:33.628Z", "end": "2022-12-12T22:35:13.815Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1c", "name": "UNKNOWN", }
                ])

                expect(error).toHaveBeenCalledWith("outageID '002b28fc-283c-47ec-9af2-ea287336dc1c' is for a deviceId '002b28fc-283c-47ec-9af2-ea287336dc1c' whos name for cannot be found in undefined devices list, substituting UNKNOWN");
            })

            test('Given a site with an empty array of devices and an array of outages, returns outages for that site with unknown device names appended', () => {

                const siteInfo = {
                    devices: []
                }

                const mockCutoffSiteOutagesWithAndUnknownDevice = [
                    { "begin": "2022-12-04T09:59:33.628Z", "end": "2022-12-12T22:35:13.815Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1c" },
                ]

                const enrichedList = enrichSiteOutageData(mockCutoffSiteOutagesWithAndUnknownDevice, siteInfo)

                expect(enrichedList).toEqual([
                    { "begin": "2022-12-04T09:59:33.628Z", "end": "2022-12-12T22:35:13.815Z", "id": "002b28fc-283c-47ec-9af2-ea287336dc1c", "name": "UNKNOWN", }
                ])
            })

            test('Given a site with an array of devices and an empty array of outages, returns an empty array', () => {

                const siteInfo = {
                    devices: [
                        {
                            id: '002b28fc-283c-47ec-9af2-ea287336dc1b',
                            name: 'Device 1'
                        }
                    ]
                }

                const mockCutoffSiteOutagesWithAndUnknownDevice = [ ]

                const enrichedList = enrichSiteOutageData(mockCutoffSiteOutagesWithAndUnknownDevice, siteInfo)

                expect(enrichedList).toEqual([])
            })

        })
    })
})