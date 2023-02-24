// Read in any .env files that might exist
const dotenv = require('dotenv');
dotenv.config();

export const KRAKEN_FLEX_KEY = process.env.KRAKEN_FLEX_KEY;
export const KRAKEN_FLEX_API_BASE_URL = process.env.KRAKEN_FLEX_API_BASE_URL || 'https://api.krakenflex.systems/interview-tests-mock-api/v1'
export const OUTAGE_CUTTOFF_DATE = process.env.OUTAGE_CUTTOFF_DATE || '2022-01-01T00:00:00.000Z';
export const SITEID_TO_CHECK = process.env.SITEID_TO_CHECK || 'NORWICH_PEAR_TREE';
export const DEBUG_LOGS = process.env.DEBUG_LOGS || false;
