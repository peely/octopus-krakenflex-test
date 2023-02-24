import { makeGetRequest, makePostRequest } from "../utils/requestor";
import { KRAKEN_FLEX_KEY, KRAKEN_FLEX_API_BASE_URL } from '../utils/env'
import { debug } from "../utils/logger";
import { DEBUG_LOGS } from '../utils/env'

const defaultHeaders = {
    'Content-type': 'application/json',
    'x-api-key': KRAKEN_FLEX_KEY as string,
}

export type Outage = {
    "id": string,
    "begin": string,
    "end": string,
}

export async function getAllOutages(): Promise<Outage[]> {
    let outageData = [];

    const KRAKEN_FLEXResponse = await makeGetRequest(
        `${KRAKEN_FLEX_API_BASE_URL}/outages`,
        {},
        defaultHeaders
    );

    if (KRAKEN_FLEXResponse.status === 200) {
        // Should absolutely validate the response shape it,
        // as this is where it enters the system
        // But that might be a step too far for this test
        outageData = KRAKEN_FLEXResponse.data;
    }

    if(DEBUG_LOGS) {
        console.log('outageData', outageData)
    }

    return outageData;
}

export type SiteInfo = {
    "id": string,
    "name": string,
    "devices": {
        id: string,
        name: string
    }[]
}

export async function getSiteInfo(siteName: string): Promise<SiteInfo | undefined> {

    let siteInfo = undefined;

    const KRAKEN_FLEXResponse = await makeGetRequest(
        `${KRAKEN_FLEX_API_BASE_URL}/site-info/${siteName}`,
        {},
        defaultHeaders
    );

    if (KRAKEN_FLEXResponse.status === 200) {
        siteInfo = KRAKEN_FLEXResponse.data;
    }

    if(DEBUG_LOGS) {
        console.log('siteInfo', siteInfo)
    }
    
    return siteInfo;
}

export type SiteOutage = {
    "id": string,
    "name": string,
    "begin": string,
    "end": string,
}

export async function postSiteOutages(siteName: string, outageData: SiteOutage[]): Promise<Boolean> {

    const KRAKEN_FLEXResponse = await makePostRequest(
        `${KRAKEN_FLEX_API_BASE_URL}/site-outages/${siteName}`,
        outageData,
        defaultHeaders
    );


    if(DEBUG_LOGS) {
        console.log('outageData', outageData)
    }

    return KRAKEN_FLEXResponse.status === 200;
}