'use strict';
const { seed } = require('../src/seed');
const { clock, testDatabase } = require('./helpers');

const db = testDatabase('wall');
beforeAll(() => db.start());
afterAll(() => db.stop());

test('starting twice still gives 48 doors, all free', async () => {
  await seed({ settings: db.settings, clock });
  const res = await db.api().get('/towers/A/doors');
  expect(res.status).toBe(200);
  expect(res.body.free).toBe(48);
  expect(res.body.doors).toHaveLength(48);
  expect(res.body.doors[0]).toEqual({ no: 'D01', size: 'S', state: 'free' });
  expect(res.body.doors[47]).toEqual({ no: 'D48', size: 'L', state: 'free' });
});

test('the wall can be filtered by size', async () => {
  const res = await db.api().get('/towers/A/doors?size=L');
  expect(res.status).toBe(200);
  expect(res.body.free).toBe(12);
  expect(res.body.doors.every((d) => d.size === 'L')).toBe(true);
});

test('an unknown size is a 400 validation error', async () => {
  const res = await db.api().get('/towers/A/doors?size=XL');
  expect(res.status).toBe(400);
  expect(res.headers['content-type']).toMatch(/application\/problem\+json/);
  expect(res.body.type).toBe('/errors/validation');
});

test('reading one door and reading a door that is not there', async () => {
  const ok = await db.api().get('/towers/A/doors/D07');
  expect(ok.status).toBe(200);
  expect(ok.body).toEqual({ no: 'D07', size: 'S', state: 'free' });

  const miss = await db.api().get('/towers/A/doors/D99');
  expect(miss.status).toBe(404);
  expect(miss.body.type).toBe('/errors/no-such-door');
});