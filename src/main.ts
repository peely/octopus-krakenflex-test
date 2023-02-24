import { getAllOutages, getSiteInfo, postSiteOutages } from "./comms/kraken-flex";
import { info, error } from './utils/logger'
import { enrichSiteOutageData, filterOutagesBySite, filterOutagesSince } from "./utils/filters-and-enrichers";
import { DateTime } from "luxon";


export async function main(siteIDToUpdate: string, outagesSinceDateTime: DateTime) {
    // Get all outages
    const allOutages = await getAllOutages();

    if (allOutages.length == 0) {
        info(`There have been no outages, bit strange, but well done!`);
    }

    // Filter out outages from before our cutoff date
    const recentOutages = filterOutagesSince(allOutages, outagesSinceDateTime);

    // Get site info for norwich-pear-tree
    const norwichPearTreeSiteInfo = await getSiteInfo(siteIDToUpdate);

    if (norwichPearTreeSiteInfo) {
        // Filter remaining outages down to be for norwich-pear-tree only
        const norwichPearTreeDeviceOutages = filterOutagesBySite(norwichPearTreeSiteInfo, recentOutages)

        // Add device name to outage data
        const enrichedNorwichPearTreeDeviceOutages = enrichSiteOutageData(norwichPearTreeDeviceOutages, norwichPearTreeSiteInfo)

        // Post to site-outages
        const postOutagesResponse = await postSiteOutages(siteIDToUpdate, enrichedNorwichPearTreeDeviceOutages);
        console.log(postOutagesResponse ? 'Success!' : 'Failure');
        return postOutagesResponse;
    } else {
        error(`SiteInfo for ${siteIDToUpdate} could not be found`)
    }

}