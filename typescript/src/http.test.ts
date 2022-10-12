import { getMillisToSleep } from './http';

test('getMillisToSleep', async () => {
  const seconds_format = getMillisToSleep('4');
  const date_format = getMillisToSleep('Mon, 29 Mar 2021 04:58:00 GMT');

  expect(seconds_format).toEqual(4000);
  expect(date_format).toEqual(0);
});
