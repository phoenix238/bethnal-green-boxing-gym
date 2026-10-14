// Unit tests for the Google Sheet timetable parser. Run with: npm test
import assert from 'node:assert/strict';
import { parseCSV, csvToClasses, normaliseTime, normaliseDay, fetchTimetable, loadTimetable, DEFAULT_CLASSES, CACHE_KEY } from '../src/timetable.js';

let passed = 0;
const tests = [];
const test = (name, fn) => tests.push([name, fn]);

test('parses quoted fields, escaped quotes, commas and CRLF', () => {
  const rows = parseCSV('﻿a,b,c\r\n"x, y","say ""hi""",z\r\n"multi\nline",2,\r\n');
  assert.deepEqual(rows, [['a', 'b', 'c'], ['x, y', 'say "hi"', 'z'], ['multi\nline', '2', '']]);
});

test('skips blank lines and handles no trailing newline', () => {
  assert.deepEqual(parseCSV('a,b\n\n,\n1,2'), [['a', 'b'], ['1', '2']]);
});

test('maps columns by header name, case-insensitive and in any order', () => {
  const csv = 'Title,DAY,Time,Price,Reduced Price,Notes\n"Open level boxing, all welcome",tue,7pm,£10,5,"Bring water"';
  const [c] = csvToClasses(csv);
  assert.equal(c.title, 'Open level boxing, all welcome');
  assert.equal(c.day, 'Tuesday');
  assert.equal(c.time, '7:00 PM');
  assert.equal(c.price, 10);
  assert.equal(c.communityPrice, 5);
  assert.equal(c.notes, 'Bring water');
});

test('missing optional columns become null', () => {
  const [c] = csvToClasses('day,time,title\nThursday,19:00,Open level boxing');
  assert.equal(c.level, null);
  assert.equal(c.capacity, null);
  assert.equal(c.duration, null);
  assert.equal(c.price, null);
  assert.equal(c.coach, null);
  assert.equal(typeof c.id, 'string');
});

test('show = no hides a row; blank show = yes', () => {
  const csv = 'day,time,title,show\nMonday,6pm,Hidden,no\nMonday,7pm,Shown,\nMonday,8pm,Also shown,Yes';
  assert.deepEqual(csvToClasses(csv).map(c => c.title), ['Shown', 'Also shown']);
});

test('drops rows missing day, time or title', () => {
  const csv = 'day,time,title\n,7pm,No day\nTuesday,,No time\nTuesday,7pm,\nTuesday,7pm,Good';
  assert.deepEqual(csvToClasses(csv).map(c => c.title), ['Good']);
});

test('orders by weekday then time', () => {
  const csv = 'day,time,title\nThursday,7pm,C\nMonday,8:30pm,B\nTuesday,7pm,D\nMonday,6.15pm,A\nSunday,10am,E';
  assert.deepEqual(csvToClasses(csv).map(c => `${c.title} ${c.day} ${c.time}`), ['A Monday 6:15 PM', 'B Monday 8:30 PM', 'D Tuesday 7:00 PM', 'C Thursday 7:00 PM', 'E Sunday 10:00 AM']);
});

test('header only or empty sheet gives no classes', () => {
  assert.deepEqual(csvToClasses('day,time,title\n'), []);
  assert.deepEqual(csvToClasses(''), []);
});

test('duplicate sessions get unique ids', () => {
  const ids = csvToClasses('day,time,title\nTuesday,7pm,Boxing\nTuesday,7pm,Boxing').map(c => c.id);
  assert.equal(new Set(ids).size, 2);
});

test('time and day helpers', () => {
  assert.equal(normaliseTime('12pm').label, '12:00 PM');
  assert.equal(normaliseTime('12am').label, '12:00 AM');
  assert.equal(normaliseTime('7:30 p.m.').label, '7:30 PM');
  assert.equal(normaliseTime('evening').label, 'evening');
  assert.equal(normaliseDay('THURS'), 'Thursday');
  assert.equal(normaliseDay('Weekends'), 'Weekends');
});

const memoryStorage = () => { const map = new Map(); return { getItem: k => map.get(k) ?? null, setItem: (k, v) => map.set(k, String(v)) }; };
const fakeFetch = (body, ok = true) => async () => ({ ok, status: ok ? 200 : 500, text: async () => body });

test('fetchTimetable rejects on zero valid rows and bad status', async () => {
  await assert.rejects(fetchTimetable('x', { fetchImpl: fakeFetch('day,time,title\n') }));
  await assert.rejects(fetchTimetable('x', { fetchImpl: fakeFetch('day,time,title\nMon,7pm,A', false) }));
});

test('fetchTimetable times out', async () => {
  const hang = (_url, { signal }) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(new Error('aborted'))));
  await assert.rejects(fetchTimetable('x', { fetchImpl: hang, timeoutMs: 20 }));
});

test('loadTimetable: sheet, then cache on failure, then defaults', async () => {
  const storage = memoryStorage();
  const empty = await loadTimetable('', { storage });
  assert.equal(empty.source, 'default');
  assert.deepEqual(empty.classes, DEFAULT_CLASSES);
  const live = await loadTimetable('x', { storage, fetchImpl: fakeFetch('day,time,title\nWed,6pm,Pads') });
  assert.equal(live.source, 'sheet');
  assert.ok(storage.getItem(CACHE_KEY));
  const failed = await loadTimetable('x', { storage, fetchImpl: fakeFetch('', false) });
  assert.equal(failed.source, 'cache');
  assert.equal(failed.classes[0].title, 'Pads');
  storage.setItem(CACHE_KEY, '{not json');
  const corrupt = await loadTimetable('x', { storage, fetchImpl: fakeFetch('', false) });
  assert.equal(corrupt.source, 'default');
});

for (const [name, fn] of tests) {
  try { await fn(); passed += 1; console.log(`ok  ${name}`); }
  catch (error) { console.error(`FAIL ${name}\n  ${error.message}`); process.exitCode = 1; }
}
console.log(`\n${passed}/${tests.length} timetable tests passed`);
