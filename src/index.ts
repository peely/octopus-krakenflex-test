import { siteIDs } from "./constants";
import { DateTime } from "luxon";
import { OUTAGE_CUTTOFF_DATE, SITEID_TO_CHECK } from './utils/env';
import { main } from "./main";


// Run the program
(async () => {
    const ignoreOutagesBefore = DateTime.fromISO(OUTAGE_CUTTOFF_DATE);
    await main(siteIDs[SITEID_TO_CHECK], ignoreOutagesBefore)
})()