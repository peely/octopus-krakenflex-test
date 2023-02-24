import { DateTime } from "luxon";

jest.mock('./utils/env', () => ({
    OUTAGE_CUTTOFF_DATE: '1985-10-26T01:21:00.000Z',
    SITEID_TO_CHECK: 'LONE_PINE_MALL'
}));

jest.mock('./constants', () => ({
    siteIDs: {
        'LONE_PINE_MALL': 'lone_pine_mall'
    }
}))

jest.mock('./main')

import { main } from "./main";

describe('Index', () => {
    beforeAll(async () => {
        //setup mocks
        main.mockResolvedValue(true)

        // Dynamic import ./index.ts now we are ready
        require('./index.ts');
    })

    test('index calls main with values from env util on require', () => {
        expect(main).toHaveBeenCalledTimes(1)
        
        expect(main).toHaveBeenCalledWith(
            'lone_pine_mall',
            DateTime.fromISO('1985-10-26T01:21:00.000Z')
        )
    })
})