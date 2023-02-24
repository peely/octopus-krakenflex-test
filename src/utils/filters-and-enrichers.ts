import { DateTime } from "luxon";
import { Outage, SiteInfo, SiteOutage } from "../comms/kraken-flex";
import { error } from "./logger";

export function filterOutagesSince(allOutages: Outage[], ignoreOutagesBefore: DateTime) {
    return allOutages.filter((outage) => {
        const outageDate = DateTime.fromISO(outage.begin);
        return outageDate >= ignoreOutagesBefore;
    });
}

export function filterOutagesBySite(norwichPearTreeSiteInfo: SiteInfo, recentOutages: Outage[]) {
    const NPTDeviceIDs = norwichPearTreeSiteInfo.devices.map((NPTDevice) => {
        return NPTDevice.id;
    });

    const norwichPearTreeDeviceOutages = recentOutages.filter(potentialNPTOutage => {
        return NPTDeviceIDs.includes(potentialNPTOutage.id);
    })

    return norwichPearTreeDeviceOutages;
}

export function enrichSiteOutageData(norwichPearTreeDeviceOutages: Outage[], norwichPearTreeSiteInfo: SiteInfo) {
    return norwichPearTreeDeviceOutages.map((NPTOutage) => {
        // Find this devices name
        const device = norwichPearTreeSiteInfo.devices.find(NPTDevice => NPTDevice.id === NPTOutage.id)

        let name = 'UNKNOWN';
        if (device) {
            name = device.name
        } else {
            error(`outageID '${NPTOutage.id}' is for a deviceId '${NPTOutage.id}' whos name for cannot be found in ${norwichPearTreeSiteInfo.name} devices list, substituting UNKNOWN`);
        }

        return {
            ...NPTOutage,
            name
        } as SiteOutage;
    });
}