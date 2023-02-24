import { siteIDs } from "./constants";
import { DateTime } from "luxon";
import { OUTAGE_CUTTOFF_DATE, SITEID_TO_CHECK } from './utils/env';
import { main } from "./main";


// Run the program
(async () => {
    const ignoreOutagesBefore = DateTime.fromISO(OUTAGE_CUTTOFF_DATE);
    await main(siteIDs[SITEID_TO_CHECK], ignoreOutagesBefore)
})()

// Could put a loop around this with a delay and run it every minute, hour, day etc.
// Or run it as-is the cloud on a schedule for more IaC control
// Plus these params could be env vars