(() => {
  'use strict';
  const VERSION = '1.0-clownz';

  const isGamePage = () => /nzp\.gay$/.test(location.hostname) || typeof globalThis.FTEC === 'object'
    || (typeof globalThis.Module === 'object' && globalThis.Module !== null && typeof globalThis.Module.files === 'object');

  if (globalThis.ClownzMenu?.__direct) {
    globalThis.ClownzMenu.open();
    return;
  }
  if (globalThis.ClownzMenu || globalThis.ClownzNZP || globalThis.ClownzGSC || globalThis.Clownz) {
    console.error('[CLOWNZ] Another menu script is already loaded on this page.');
    return;
  }
  if (!isGamePage()) {
    console.error('[CLOWNZ] Open https://nzp.gay/ and paste the loader there.');
    return;
  }

  let active = true;
  const queue = [];
  let engineReady = false;
  let panel = null;
  let message = null;
  let statusDot = null;
  let toastBox = null;

  const engine = () => globalThis.FTEC || null;
  const ready = () => { const f = engine(); return Boolean(f && f.evcb && f.evcb.cbufaddtext != 0); };
  const cbuf = (command) => {
    const f = engine();
    if (f && typeof f.cbufadd === 'function') {
      try {
        f.cbufadd(command);
      } catch (_) {}
    }
  };

  function say(value, error = false) {
    if (error) console.error('[CLOWNZ]', value);
    if (message) {
      message.textContent = value;
      message.style.color = error ? '#ffadad' : '#e7e7e7';
    }
    if (statusDot) statusDot.style.background = error ? '#ef2929' : '#ffd400';
  }

  function toast(text) {
    if (!document.body) return;
    if (!toastBox) {
      toastBox = document.createElement('div');
      toastBox.id = 'cz-toasts';
      toastBox.style.cssText = 'position:fixed;bottom:26px;left:50%;transform:translateX(-50%);' +
        'z-index:2147483000;display:grid;gap:6px;justify-items:center;pointer-events:none;';
      document.body.append(toastBox);
    }
    const item = document.createElement('div');
    item.textContent = 'CLOWNZ  ' + text;
    item.style.cssText = 'background:#0d0d0df2;border:1px solid #3a3a3a;border-left:3px solid #ffd400;' +
      'border-radius:6px;padding:5px 12px;color:#ffe9a8;font:600 11px/1.4 "Segoe UI",sans-serif;' +
      'box-shadow:0 4px 16px #000a,0 0 10px #ffd4001f;white-space:pre;';
    toastBox.append(item);
    setTimeout(() => { item.style.transition = 'opacity .5s'; item.style.opacity = '0'; }, 1800);
    setTimeout(() => item.remove(), 2400);
  }

  function run(command, quiet = false) {
    if (!active) return;
    if (!command) return;
    if (!ready()) {
      queue.push(command);
      say('Queued until the game engine starts…');
      if (!quiet) toast('queued: ' + command);
      poll();
      return;
    }
    cbuf(command + '\n');
    if (!quiet) toast('-> ' + command);
  }

  let pollTimer = null;
  function poll() {
    if (pollTimer || engineReady) return;
    pollTimer = setInterval(() => {
      if (!active) { clearInterval(pollTimer); pollTimer = null; return; }
      if (!ready()) return;
      engineReady = true;
      clearInterval(pollTimer);
      pollTimer = null;
      if (queue.length) {
        say('Engine connected. Sending ' + queue.length + ' queued command(s)…');
        for (const command of queue) cbuf(command + '\n');
        queue.length = 0;
      }
      say('Ready to play');
    }, 500);
  }

  function install() {
    run('sv_cheats 1', true);
    run('echo CLOWNZ Menu loaded', true);
    say('Ready. Cheats unlocked (sv_cheats 1).');
    poll();
  }

  const WEAPONS_WALL = [
    [1, 'Colt M1911'], [2, 'Kar98k'], [3, 'Thompson'], [4, '.357 Magnum'], [5, 'BAR'],
    [6, 'Ballistic Knife'], [7, 'M1919 Browning'], [8, 'Double-Barrel'], [9, 'FG42'],
    [10, 'Gewehr 43'], [11, 'Scoped Kar98k'], [12, 'M1 Garand'], [13, 'M1A1 Carbine'],
    [14, 'M2 Flamethrower'], [15, 'MP40'], [16, 'MG42'], [17, 'Panzerschreck'], [18, 'PPSh-41'],
    [19, 'PTRS-41'], [21, 'Sawed-Off'], [22, 'STG-44'], [23, 'Trench Gun'], [24, 'Type 100'],
    [25, 'Bowie Knife'], [26, 'Grenades'], [27, 'Bouncing Betty'], [54, 'MP5K'],
  ];
  const WEAPONS_WONDER = [
    [20, 'Ray Gun'], [56, 'Wunderwaffe DG-1'], [57, 'DG-3 (upgraded Wunderwaffe)'],
    [60, 'Ray Gun Mark 2'], [61, "Porter's Mark 2"], [32, 'Kollider'], [59, 'Pulverizer'],
  ];
  const WEAPONS_PAP = [
    [28, 'Biatch (Ballistic)'], [29, 'Kill You (Magnum)'], [30, 'Compressor (Gewehr)'],
    [31, 'M1000 (Garand)'], [33, "Porter's X2 (Ray Gun)"], [34, 'Widder (M1A1)'],
    [35, 'FIW (Flamethrower)'], [36, 'Armageddon (Kar98k)'], [38, 'Gibs (Thompson)'],
    [39, 'Samurai (Type 100)'], [40, 'Afterburner (MP40)'], [41, 'Spatz (STG-44)'],
    [42, 'Snuff (Sawed-Off)'], [43, 'Bore (Double-Barrel)'], [44, 'Impeller (FG42)'],
    [45, 'Barracuda (MG42)'], [46, 'Accelerator (Browning)'], [47, 'Gut (Trench Gun)'],
    [48, 'Reaper (PPSh-41)'], [49, 'Headcracker (Scoped Kar)'], [50, 'Longinus (Panzerschreck)'],
    [51, 'Penetrator (PTRS-41)'], [52, 'Widow (BAR)'], [53, 'Kraus (Ballistic)'],
  ];
  const POWERUPS = [
    [0, 'Nuke'], [1, 'Insta-Kill'], [2, 'Double Points'], [3, 'Carpenter'], [4, 'Max Ammo'],
    [5, 'Free Perk'], [6, 'Upgrade Weapon'], [7, 'Bonus Points'], [-1, 'Random Power-Up'],
  ];
  const MAPS = [
    ['ndu', 'Nacht der Untoten'], ['nzp_warehouse', 'NZ:P Warehouse'], ['nzp_warehouse2', 'Warehouse 2'],
    ['nzp_xmas2', 'XMAS 2'], ['christmas_special', 'Christmas Special'], ['lexi_house', "Lexi's House"],
    ['lexi_temple', "Lexi's Temple"], ['lexi_overlook', "Lexi's Overlook"], ['hangar', 'Hangar'],
    ['4all', '4All'], ['b1oodv3', 'BLOOD v3'], ['b1oodv4', 'BLOOD v4'], ['boxxer', 'Boxxer'],
    ['bunker-defense', 'Bunker Defense'], ['dung3on', 'Dungeon'], ['fegefeuer', 'Fegefeuer'],
    ['loop', 'Loop'], ['wahnsinn', 'Wahnsinn'],
  ];
  const GAMEMODES = [
    [0, 'Classic'], [1, 'Grief'], [2, 'Gun Game'], [3, 'Hardcore'], [4, 'Wild West'],
    [5, 'Sticks & Stones'], [6, 'Festive'],
  ];

  function node(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.textContent = content;
    return el;
  }

  let themeAdded = false;

  function hidePanel() {
    panel?.remove();
    panel = null;
    message = null;
    statusDot = null;
  }

  function showPanel() {
    if (!active || !document.body || panel) return;
    if (!themeAdded) {
      const css = node('style', '', `
        #cz-nzp, #cz-nzp * { box-sizing: border-box; }
        #cz-nzp { position: fixed; z-index: 2147483647; right: 14px; bottom: 14px;
          width: min(310px, calc(100vw - 20px)); max-height: calc(100vh - 28px); overflow-y: auto;
          color: #f2f2f2; pointer-events: auto; font: 12px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(180deg, #171717 0%, #0b0b0b 140px); border: 1px solid #2c2c2c; border-radius: 12px;
          box-shadow: 0 12px 48px #000d, 0 0 0 1px #000 inset, 0 0 24px #ffd4000f; }
        #cz-nzp::-webkit-scrollbar { width: 7px; }
        #cz-nzp::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 4px; }
        #cz-nzp::-webkit-scrollbar-thumb:hover { background: #6b5c00; }
        #cz-nzp button { font: inherit; cursor: pointer; min-height: 27px; padding: 5px 6px;
          border-radius: 6px; font-size: 10.5px; font-weight: 650; white-space: nowrap;
          transition: background .12s, border-color .12s, color .12s, box-shadow .12s; }
        #cz-nzp button:focus-visible { outline: 2px solid #ffd400; outline-offset: 2px; }
        #cz-nzp .cz-accent { height: 3px; position: sticky; top: 0;
          background: linear-gradient(90deg, #7a6100, #ffd400 30%, #fff0a0 50%, #ffd400 70%, #7a6100);
          box-shadow: 0 2px 10px #ffd40040; }
        #cz-nzp .cz-main { padding: 11px 11px 10px; }
        #cz-nzp .cz-head { display: flex; align-items: center; gap: 9px; position: relative; }
        #cz-nzp .cz-mark { width: 30px; height: 30px; flex: none; display: grid; place-items: center;
          border: 1px solid #ffe066; border-radius: 8px; color: #111;
          background: linear-gradient(145deg, #ffe45c, #e6a800); font-size: 16px; font-weight: 900;
          letter-spacing: -.07em; box-shadow: 0 0 14px #ffd40033; }
        #cz-nzp .cz-brand { font-weight: 850; font-size: 14px; letter-spacing: .12em; line-height: 1.05; color: #fff; }
        #cz-nzp .cz-brand .cz-y { color: #ffd400; }
        #cz-nzp .cz-small { font-size: 9px; letter-spacing: .12em; color: #8f8f8f; margin-top: 3px; }
        #cz-nzp .cz-small b { color: #d9b800; font-weight: 700; }
        #cz-nzp .cz-close { position: absolute; right: -4px; top: -4px; border: 0; border-radius: 6px;
          width: 22px; height: 22px; background: transparent; color: #9a9a9a; cursor: pointer;
          font-size: 17px; line-height: 1; min-height: 0; padding: 0; }
        #cz-nzp .cz-close:hover { color: #ffd400; background: #262626; }
        #cz-nzp .cz-status { margin: 10px 0 8px; padding: 7px 8px; border: 1px solid #2c2c2c;
          background: #161616; border-radius: 8px; }
        #cz-nzp .cz-status-top { display: flex; align-items: center; gap: 7px; font-size: 10px;
          font-weight: 700; letter-spacing: .045em; }
        #cz-nzp .cz-dot { display: inline-block; flex: none; width: 6px; height: 6px;
          background: #6b6b6b; border-radius: 50%; box-shadow: 0 0 0 3px #262626; transition: background .2s; }
        #cz-nzp .cz-map { margin-left: auto; font-weight: 600; color: #a9a9a9; font-size: 9px; }
        #cz-nzp .cz-message { margin-top: 6px; color: #e7e7e7; font-size: 11px; }
        #cz-nzp .cz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
        #cz-nzp .cz-grid.three { grid-template-columns: repeat(3, 1fr); }
        #cz-nzp .cz-grid.four { grid-template-columns: repeat(4, 1fr); }
        #cz-nzp .cz-button { color: #eaeaea; background: #1d1d1d; border: 1px solid #333; }
        #cz-nzp .cz-button:hover { background: #282828; border-color: #ffd400; color: #ffe45c;
          box-shadow: 0 0 10px #ffd40026; }
        #cz-nzp .cz-button:active { transform: translateY(1px); }
        #cz-nzp .cz-button.primary { color: #111; font-weight: 800;
          background: linear-gradient(180deg, #ffe066, #f0c000); border: 1px solid #ffe066; }
        #cz-nzp .cz-button.primary:hover { background: linear-gradient(180deg, #fff0a0, #ffd400);
          color: #000; box-shadow: 0 0 14px #ffd40040; }
        #cz-nzp .cz-button.wide { grid-column: 1 / -1; }
        #cz-nzp .cz-section { margin: 10px 0 0; border-top: 1px solid #2a2a2a; padding-top: 8px; }
        #cz-nzp .cz-section h3 { margin: 0 0 6px; font-size: 10px; letter-spacing: .16em;
          color: #ffd400; font-weight: 800; text-transform: uppercase; }
        #cz-nzp .cz-note { font-size: 9.5px; color: #9e9e9e; margin: 6px 0 0; white-space: pre-line; }
        #cz-nzp details.cz-group { margin-top: 5px; border: 1px solid #2e2e2e; border-radius: 8px; background: #161616; }
        #cz-nzp details.cz-group[open] { border-color: #4d4100; }
        #cz-nzp details.cz-group summary { cursor: pointer; padding: 6px 8px; font-size: 10.5px;
          font-weight: 700; color: #e6e6e6; list-style: none; }
        #cz-nzp details.cz-group summary:hover { color: #ffd400; }
        #cz-nzp details.cz-group summary::-webkit-details-marker { display: none; }
        #cz-nzp details.cz-group summary::before { content: '+ '; color: #ffd400; font-weight: 800; }
        #cz-nzp details.cz-group[open] summary::before { content: '- '; }
        #cz-nzp details.cz-group .cz-grid { padding: 2px 7px 8px; }
        #cz-nzp .cz-footer { margin-top: 10px; padding-top: 8px; border-top: 1px solid #2a2a2a;
          display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        #cz-nzp .cz-link { background: none; padding: 0; border: 0; color: #b5b5b5;
          font-size: 10px; font-weight: 600; cursor: pointer; min-height: 0; }
        #cz-nzp .cz-link:hover { color: #ffd400; }
        #cz-nzp .cz-credit { font-size: 9px; letter-spacing: .12em; color: #8f8f8f; text-transform: uppercase; }
        #cz-nzp .cz-credit b { color: #ffd400; }`);
      (document.head || document.body).append(css);
      themeAdded = true;
    }

    panel = node('section');
    panel.id = 'cz-nzp';
    panel.setAttribute('aria-label', 'Clownz Menu');
    panel.append(node('div', 'cz-accent'));
    const main = node('div', 'cz-main');

    const head = node('div', 'cz-head');
    head.append(node('div', 'cz-mark', 'C'));
    const brand = node('div');
    const title = node('div', 'cz-brand');
    title.append(node('span', 'cz-y', 'CLOWNZ'));
    title.append(node('span', '', ' MENU'));
    brand.append(title);
    const small = node('div', 'cz-small');
    small.append(node('b', '', 'MADE BY CLOWNZ'));
    small.append(node('span', '', ' · NZ:P · nzp.gay'));
    brand.append(small);
    head.append(brand);
    const dismiss = node('button', 'cz-close', '×');
    dismiss.type = 'button';
    dismiss.title = 'Close (Shift+M reopens)';
    dismiss.addEventListener('click', () => globalThis.ClownzMenu.close());
    head.append(dismiss);
    main.append(head);

    const status = node('div', 'cz-status');
    const statusTop = node('div', 'cz-status-top');
    statusDot = node('span', 'cz-dot');
    statusTop.append(statusDot);
    statusTop.append(node('span', '', 'STATUS'));
    statusTop.append(node('span', 'cz-map', 'NZ: PORTABLE'));
    status.append(statusTop);
    message = node('div', 'cz-message', 'Preparing…');
    status.append(message);
    main.append(status);

    const grid = (items, columns) => {
      const box = node('div', 'cz-grid' + (columns === 3 ? ' three' : columns === 4 ? ' four' : ''));
      for (const item of items) {
        const button = node('button', item.primary ? 'cz-button primary' : 'cz-button', item.label);
        button.type = 'button';
        button.addEventListener('click', () => {
          if (item.confirm && !window.confirm(item.confirm)) return;
          try { run(item.command); } catch (error) { say(error.message, true); }
        });
        if (item.wide) button.classList.add('wide');
        box.append(button);
      }
      return box;
    };
    const section = (name, element) => {
      const box = node('div', 'cz-section');
      box.append(node('h3', '', name));
      box.append(element);
      return box;
    };

    main.append(section('Player', grid([
      { label: 'Toggle God Mode', command: 'cmd god', primary: true },
      { label: 'Toggle No Clip', command: 'cmd noclip', primary: true },
      { label: 'Die (Respawn)', command: 'kill' },
      { label: 'Drop to Menu', command: 'disconnect', confirm: 'End this game and return to the menu?' },
    ])));

    main.append(section('Points', grid([
      { label: '+ 500', command: 'cmd addmoney 500' },
      { label: '+ 1,000', command: 'cmd addmoney 1000' },
      { label: '+ 5,000', command: 'cmd addmoney 5000', primary: true },
      { label: '+ 10,000', command: 'cmd addmoney 10000' },
      { label: '+ 50,000', command: 'cmd addmoney 50000' },
      { label: '+ 100,000', command: 'cmd addmoney 100000' },
      { label: '- 5,000', command: 'cmd addmoney -5000' },
      { label: '- 10,000', command: 'cmd addmoney -10000' },
    ], 4)));

    const weaponGroup = (name, list) => {
      const details = node('details', 'cz-group');
      const summary = node('summary', '', name + '  (' + list.length + ')');
      details.append(summary);
      details.append(grid(list.map(([id, weapon]) => ({ label: weapon, command: 'cmd give ' + id })), 2));
      return details;
    };
    const weapons = node('div');
    weapons.append(weaponGroup('Wall Weapons', WEAPONS_WALL));
    weapons.append(weaponGroup('Wonder Weapons', WEAPONS_WONDER));
    weapons.append(weaponGroup('Pack-a-Punched', WEAPONS_PAP));
    main.append(section('Weapons', weapons));

    main.append(section('Power-Ups (spawn in front of you)', grid(
      POWERUPS.map(([id, name]) => ({
        label: name, command: 'cmd spawn_pu ' + id, primary: id === -1, wide: id === -1,
      })), 3)));

    main.append(section('Damage', grid([
      { label: 'Normal (x1)', command: 'cmd sv_tracedmgmultiplier 1', primary: true },
      { label: 'x2', command: 'cmd sv_tracedmgmultiplier 2' },
      { label: 'x5', command: 'cmd sv_tracedmgmultiplier 5' },
      { label: 'x10', command: 'cmd sv_tracedmgmultiplier 10' },
    ])));

    const setup = node('div');
    setup.append(grid([
      { label: 'Start Round 5', command: 'sv_startround 5' },
      { label: 'Start Round 10', command: 'sv_startround 10' },
      { label: 'Start Round 25', command: 'sv_startround 25' },
      { label: 'Start Round 50', command: 'sv_startround 50' },
      { label: 'Fast Rounds: ON', command: 'sv_fastrounds 1' },
      { label: 'Fast Rounds: OFF', command: 'sv_fastrounds 0' },
      { label: 'Max AI 24', command: 'sv_maxai 24' },
      { label: 'Max AI 96', command: 'sv_maxai 96' },
      { label: 'Magic ON', command: 'sv_magic 1' },
      { label: 'Magic OFF', command: 'sv_magic 0' },
      { label: 'Headshots Only ON', command: 'sv_headshotonly 1' },
      { label: 'Headshots Only OFF', command: 'sv_headshotonly 0' },
    ], 2));
    const modes = node('div', 'cz-grid three');
    for (const [id, name] of GAMEMODES)
      modes.append(grid([{ label: name, command: 'sv_gamemode ' + id }]).firstChild);
    const modesWrap = node('div');
    modesWrap.append(modes);
    modesWrap.append(node('p', 'cz-note',
      'Round, AI and game-mode settings apply when the next map starts. Pick a map below to apply them now.'));
    setup.append(modesWrap);
    main.append(section('Game Setup (applies at next map start)', setup));

    main.append(section('Maps (restarts the game)', grid(
      MAPS.map(([name, label]) => ({
        label: label, command: 'map ' + name, confirm: 'Load ' + label + '? Your current game will end.',
      })), 2)));

    main.append(section('Quick Binds', grid([
      { label: 'G = God Mode', command: 'bind g god' },
      { label: 'V = No Clip', command: 'bind v noclip' },
      { label: 'B = +5,000 Points', command: 'bind b addmoney 5000' },
      { label: 'N = Random Power-Up', command: 'bind n spawn_pu -1' },
    ], 2)));

    const footer = node('div', 'cz-footer');
    const hide = node('button', 'cz-link', 'Hide panel');
    hide.type = 'button';
    hide.addEventListener('click', () => globalThis.ClownzMenu.close());
    footer.append(hide);
    const credit = node('span', 'cz-credit');
    credit.append('Made by ');
    credit.append(node('b', '', 'Clownz'));
    footer.append(credit);
    const stop = node('button', 'cz-link', 'Stop menu');
    stop.type = 'button';
    stop.addEventListener('click', () => globalThis.ClownzMenu.disable());
    footer.append(stop);
    main.append(footer);
    main.append(node('p', 'cz-note',
      'Shift+M: open/close this menu (also frees the mouse from the game).\n' +
      'Every action runs a NZ:P console command; buttons work even while queued.\n' +
      'Co-op: the host pastes the loader; once cheats activate, everyone can use the commands.'));

    panel.append(main);
    document.body.append(panel);
    say(engineReady ? 'Ready. Cheats unlocked (sv_cheats 1).' : 'Waiting for the game engine…');
    poll();
  }

  function onShortcut(event) {
    if (!active || !event.shiftKey || event.key?.toLowerCase() !== 'm' ||
        event.repeat || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || ''))
      return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (document.pointerLockElement) {
      try { document.exitPointerLock(); } catch (_) {}
    }
    if (panel) hidePanel(); else showPanel();
  }
  window.addEventListener('keydown', onShortcut, { capture: true, passive: false });

  const api = {
    __direct: true, version: VERSION,
    run,
    open: showPanel,
    close: hidePanel,
    maps: () => MAPS.map(([name]) => name),
    ready: null,
    disable() {
      if (!active) return;
      active = false;
      if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
      hidePanel();
      window.removeEventListener('keydown', onShortcut, true);
      toastBox?.remove();
      toastBox = null;
      delete globalThis.ClownzMenu;
      console.log('[CLOWNZ] Menu stopped. Reload the page to start it again.');
    },
  };
  api.ready = new Promise(resolve => {
    const check = () => { if (ready()) { engineReady = true; resolve(true); } else setTimeout(check, 500); };
    check();
  });
  api.ready.then(() => {
    if (queue.length) {
      for (const command of queue) cbuf(command + '\n');
      queue.length = 0;
    }
  }).catch(() => {});
  globalThis.ClownzMenu = api;
  Object.freeze(api);

  try {
    install();
  } catch (error) {
    say(error.message, true);
  }
  if (document.body) showPanel();
  else document.addEventListener('DOMContentLoaded', () => { if (active) showPanel(); }, { once: true });
  console.log('[CLOWNZ] Clownz Menu ' + VERSION + ' loaded. Shift+M toggles the menu. Made by Clownz.');
})();
