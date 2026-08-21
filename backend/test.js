const BASE = process.env.TEST_URL || 'http://localhost:8000';

let pass = 0;
let fail = 0;

const check = (name, condition, extra = '') => {
  if (condition) {
    pass++;
    console.log(`  ok   ${name}`);
  } else {
    fail++;
    console.log(`  FAIL ${name} ${extra}`);
  }
};

const call = async (method, path, body, auth) => {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: auth } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15000),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  return { status: res.status, data };
};

const guest = async () =>
  (await call('POST', '/api/auth/signin', { asGuest: true })).data.playerCookie;

(async () => {
  {
  console.log('\n[hanging responses]');
  const a = await guest();
  await call('POST', '/api/spelling-bee/game/create', {}, a);
  const reset = await call('DELETE', '/api/player/progress', null, a);
  check('reset progress replies instead of hanging', reset.status === 200, JSON.stringify(reset));

  console.log('\n[spelling bee scoring]');
  const b = await guest();
  const game = await call('POST', '/api/spelling-bee/game/create', {}, b);
  check('game created', game.status === 200 && !!game.data.id);
  const shortWords = game.data.correctWords.filter((w) => w.word.length < 4);
  check('no words shorter than 4 letters', shortWords.length === 0, JSON.stringify(shortWords.slice(0, 3)));
  const target = game.data.correctWords[0];

  const inflated = await call('POST', '/api/spelling-bee/word/submit',
    { gameId: game.data.id, word: target.word, points: 999999 }, b);
  check('client points ignored', inflated.data.newScore === target.points,
    `got ${inflated.data.newScore}, expected ${target.points}`);

  const dupe = await call('POST', '/api/spelling-bee/word/submit',
    { gameId: game.data.id, word: target.word }, b);
  check('duplicate word rejected', dupe.data.error === 'Word was already found', JSON.stringify(dupe.data));

  const foreign = await call('POST', '/api/spelling-bee/word/submit',
    { gameId: game.data.id, word: 'zebra' }, b);
  check('word outside the puzzle rejected', foreign.data.error === 'Word is incorrect', JSON.stringify(foreign.data));

  console.log('\n[ownership]');
  const c = await guest();
  const steal = await call('POST', '/api/spelling-bee/word/submit',
    { gameId: game.data.id, word: target.word }, c);
  check('stranger cannot submit into a foreign game', steal.status === 403, JSON.stringify(steal));
  const stealDelete = await call('DELETE', `/api/spelling-bee/game/${game.data.id}`, null, c);
  check('stranger cannot delete a foreign game', stealDelete.status === 403);

  console.log('\n[malformed input does not crash the process]');
  const bad = [
    ['letters as broken json', { letters: '[' }],
    ['regex metachars in letters', { letters: ['A','\\','w','(',')','[',']'], centerLetter: 'A' }],
    ['too few letters', { letters: ['A','B'] }],
    ['center letter outside set', { letters: ['A','B','C','D','E','F','G'], centerLetter: 'Z' }],
  ];
  for (const [name, body] of bad) {
    const r = await call('POST', '/api/spelling-bee/game/create', body, b);
    check(name + ' -> 400', r.status === 400, JSON.stringify(r));
  }
  const badId = await call('POST', '/api/spelling-bee/word/submit', { gameId: 'not-an-id', word: 'test' }, b);
  check('non-ObjectId game id -> 400', badId.status === 400);
  const alive = await call('POST', '/api/auth/signin', { asGuest: true });
  check('backend still alive after malformed input', alive.status === 200);

  console.log('\n[settings]');
  const d = await guest();
  await call('PATCH', '/api/player/update', { profanesAllowed: true }, d);
  const off = await call('PATCH', '/api/player/update', { profanesAllowed: false }, d);
  check('profanity can be switched back off', off.data.settings.profanesAllowed === false,
    JSON.stringify(off.data.settings));
  const badSort = await call('PATCH', '/api/player/update', { wordListSortBy: 'GARBAGE' }, d);
  check('invalid sort option ignored', badSort.data.settings.wordListSortBy === 'ALPHABETICAL');

  console.log('\n[signup validation]');
  const e = await guest();
  const cases = [
    ['no password', { username: 'validname' }],
    ['short username', { username: 'ab', password: 'GoodPass1' }],
    ['weak password', { username: 'validname', password: 'weak' }],
    ['username with spaces', { username: 'bad name', password: 'GoodPass1' }],
  ];
  for (const [name, body] of cases) {
    const r = await call('POST', '/api/auth/signup', body, e);
    check(name + ' -> 400', r.status === 400, JSON.stringify(r));
  }
  const uniq = 'user' + Math.floor(Date.now() % 100000);
  const ok = await call('POST', '/api/auth/signup', { username: uniq, password: 'GoodPass1' }, e);
  check('valid signup -> 201', ok.status === 201, JSON.stringify(ok));
  const f = await guest();
  const taken = await call('POST', '/api/auth/signup', { username: uniq, password: 'GoodPass1' }, f);
  check('duplicate username -> 409 not 500', taken.status === 409, JSON.stringify(taken));

  console.log('\n[password change on a guest account]');
  const g = await guest();
  const noPass = await call('PATCH', '/api/player/change-password',
    { oldPassword: 'x', newPassword: 'GoodPass1' }, g);
  check('guest without password -> 400 not 500', noPass.status === 400, JSON.stringify(noPass));

  console.log('\n[wordle is decided by the server]');
  const h = await guest();
  await call('DELETE', '/api/player/progress', null, h);

  const wd = await call('GET', '/api/wordle/game', null, h);
  check('game survives a progress reset', wd.status === 200, JSON.stringify(wd));
  check('answer hidden while the game runs', wd.data.wordToGuess === undefined, JSON.stringify(wd.data));
  check('results array returned', Array.isArray(wd.data.results));

  const gone = await call('PATCH', '/api/wordle/game/stats', { guesses: 1 }, h);
  check('self-reported stats endpoint removed', gone.status === 404, JSON.stringify(gone));

  const unknownWord = await call('POST', '/api/wordle/word/submit', { word: 'zzzzz' }, h);
  check('word outside the list -> 400', unknownWord.status === 400, JSON.stringify(unknownWord));
  const shortWord = await call('POST', '/api/wordle/word/submit', { word: 'abc' }, h);
  check('wrong length -> 400', shortWord.status === 400);

  const wordList = (await call('GET', '/api/wordle/word/list', null, h)).data;
  const guessed = await call('POST', '/api/wordle/word/submit', { word: wordList[0] }, h);
  check('server evaluates the guess', guessed.data.results?.[0]?.length === 5, JSON.stringify(guessed.data.results));
  check('spots are valid values',
    guessed.data.results[0].every((spot) => ['CORRECT', 'PRESENT', 'NOT_IN_WORD'].includes(spot)));

  const midStats = (await call('GET', '/api/wordle/game/stats', null, h)).data;
  check('unfinished game does not count', midStats.gamesPlayed === 0, JSON.stringify(midStats));

  let ended = null;
  for (const candidate of wordList) {
    const attempt = await call('POST', '/api/wordle/word/submit', { word: candidate }, h);
    if (attempt.data?.hasEnded) { ended = attempt.data; break; }
  }
  check('game ends within six guesses', ended !== null);
  check('answer revealed once the game ends', typeof ended?.wordToGuess === 'string', JSON.stringify(ended));
  check('win flag matches the board',
    ended.hasWon === ended.results[ended.results.length - 1].every((s) => s === 'CORRECT'),
    JSON.stringify({ hasWon: ended.hasWon, last: ended.results[ended.results.length - 1] }));

  const afterEnd = await call('POST', '/api/wordle/word/submit', { word: wordList[0] }, h);
  check('submitting into a finished game -> 400', afterEnd.status === 400, JSON.stringify(afterEnd));

  const finalStats = (await call('GET', '/api/wordle/game/stats', null, h)).data;
  check('finished game counted exactly once', finalStats.gamesPlayed === 1, JSON.stringify(finalStats));

  const restarted = await call('POST', '/api/wordle/game', null, h);
  check('new game starts empty', restarted.data.enteredWords.length === 0 && !restarted.data.hasEnded, JSON.stringify(restarted.data));
  check('new game hides its answer', restarted.data.wordToGuess === undefined);
  }

  {
  console.log('\n[guest -> registered account migration]');
  const guestCookie = await guest();
  const name = 'mig' + Math.floor(Date.now() % 1000000);
  const up = await call('POST', '/api/auth/signup', { username: name, password: 'GoodPass1' }, guestCookie);
  check('signup keeps the guest cookie', up.data.playerCookie === guestCookie, JSON.stringify(up.data));

  const throwaway = await guest();
  const login = await call('POST', '/api/auth/signin', { username: name, password: 'GoodPass1', oldPid: throwaway });
  check('login returns the account cookie', login.data.playerCookie === guestCookie, JSON.stringify(login.data));
  check('login returns settings', !!login.data.settings, JSON.stringify(login.data.settings));

  const orphan = await call('GET', '/api/wordle/game/stats', null, throwaway);
  check('throwaway guest was deleted', orphan.status === 403, JSON.stringify(orphan));
  check('its token is reported as invalid', orphan.data.code === 'INVALID_SESSION', JSON.stringify(orphan.data));

  console.log('\n[login edge cases]');
  const wrong = await call('POST', '/api/auth/signin', { username: name, password: 'WrongPass1' });
  check('wrong password -> 400', wrong.status === 400, JSON.stringify(wrong));
  const missing = await call('POST', '/api/auth/signin', { username: 'no_such_user_here' });
  check('unknown user -> 400 not 500', missing.status === 400, JSON.stringify(missing));
  const empty = await call('POST', '/api/auth/signin', {});
  check('empty body -> 400 not 500', empty.status === 400, JSON.stringify(empty));

  console.log('\n[self-deletion is not possible via oldPid]');
  const selfLogin = await call('POST', '/api/auth/signin', { username: name, password: 'GoodPass1', oldPid: guestCookie });
  check('login with own cookie as oldPid -> 200', selfLogin.status === 200);
  const stillThere = await call('POST', '/api/auth/signin', { username: name, password: 'GoodPass1' });
  check('account survived', stillThere.status === 200, JSON.stringify(stillThere));

  console.log('\n[account deletion]');
  const del = await call('DELETE', '/api/player/account', null, guestCookie);
  check('account deleted -> 200 with body', del.status === 200 && !!del.data.message, JSON.stringify(del));
  const gone = await call('POST', '/api/auth/signin', { username: name, password: 'GoodPass1' });
  check('deleted account cannot log in', gone.status === 400);

  console.log('\n[invite flow]');
  const owner = await guest();
  const g = await call('POST', '/api/spelling-bee/game/create', {}, owner);
  const friend = await guest();
  const join = await call('POST', '/api/spelling-bee/game/add-player', { gameId: g.data.id }, friend);
  check('friend joins the game', join.status === 200, JSON.stringify(join));
  const rejoin = await call('POST', '/api/spelling-bee/game/add-player', { gameId: g.data.id }, friend);
  check('joining twice -> 400 not 500', rejoin.status === 400, JSON.stringify(rejoin));
  const friendGames = await call('GET', '/api/spelling-bee/game/all', null, friend);
  check('game visible to the friend', friendGames.data.some((x) => x.id === g.data.id));
  const w = g.data.correctWords[0];
  const sub = await call('POST', '/api/spelling-bee/word/submit', { gameId: g.data.id, word: w.word }, friend);
  check('friend can now submit words', sub.data.newScore === w.points, JSON.stringify(sub.data));
  }

  {
    console.log('\n[bearer tokens are signed]');
    const token = await guest();
    check('signin returns a signed token', token.includes('.'), token);

    const bare = token.split('.')[0];
    const garbage = await call('GET', '/api/spelling-bee/game/all', null, 'totally-made-up-token');
    check('made-up token -> 403', garbage.status === 403, JSON.stringify(garbage));
    check('403 carries a recoverable code', garbage.data.code === 'INVALID_SESSION', JSON.stringify(garbage.data));

    const tampered = await call('GET', '/api/spelling-bee/game/all', null, bare + '.deadbeef');
    check('tampered signature -> 403', tampered.status === 403, JSON.stringify(tampered));

    const unknownUuid = '00000000-1111-4222-8333-444444444444';
    const unknown = await call('GET', '/api/spelling-bee/game/all', null, unknownUuid);
    check('unknown uuid -> 403 instead of creating an account', unknown.status === 403, JSON.stringify(unknown));

    const legacy = await call('GET', '/api/spelling-bee/game/all', null, bare);
    check('legacy unsigned token of a real player still works', legacy.status === 200, JSON.stringify(legacy));

    const signed = await call('GET', '/api/spelling-bee/game/all', null, token);
    check('signed token works', signed.status === 200);
  }

  {
    console.log('\n[oldPid cannot delete a stranger]');
    const victimToken = await guest();
    const victimCookie = victimToken.split('.')[0];
    const name = 'vic' + Math.floor(Date.now() % 1000000);
    await call('POST', '/api/auth/signup', { username: name, password: 'GoodPass1' }, await guest());

    const attack = await call('POST', '/api/auth/signin', {
      username: name,
      password: 'GoodPass1',
      oldPid: victimCookie,
    });
    check('login with an unsigned stranger id -> 200', attack.status === 200, JSON.stringify(attack));

    const victimStillWorks = await call('GET', '/api/spelling-bee/game/all', null, victimToken);
    check('victim account was not deleted', victimStillWorks.status === 200, JSON.stringify(victimStillWorks));
  }

  {
    console.log('\n[rate limiter]');
    const rateLimit = require('./lib/rateLimit');
    const limiter = rateLimit({ windowMs: 500, max: 3 });
    const run = (ip) =>
      new Promise((resolve) => {
        const res = {
          set() { return this; },
          status(code) { this.code = code; return this; },
          json() { resolve(this.code); },
        };
        limiter({ ip }, res, () => resolve(200));
      });

    const codes = [];
    for (let i = 0; i < 5; i++) codes.push(await run('10.0.0.1'));
    check('blocks past the limit', JSON.stringify(codes) === '[200,200,200,429,429]', codes.join(','));
    check('other clients unaffected', (await run('10.0.0.2')) === 200);
    await new Promise((resolve) => setTimeout(resolve, 600));
    check('window resets', (await run('10.0.0.1')) === 200);
  }

  {
    console.log('\n[generated puzzles are playable]');
    const player = await guest();
    const counts = [];
    for (let i = 0; i < 15; i++) {
      const created = await call('POST', '/api/spelling-bee/game/create', {}, player);
      if (created.status === 200) counts.push(created.data.correctWords.length);
    }
    check('every generated game was created', counts.length === 15, `${counts.length}/15`);
    check('no unplayable puzzles', counts.every((count) => count >= 10), JSON.stringify(counts));
  }

  console.log(`\n${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
})();
