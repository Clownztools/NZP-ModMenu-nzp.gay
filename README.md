# Clownz Menu

**Mod menu for the browser game at [nzp.gay](https://nzp.gay/)** — Nazi Zombies: Portable (the FTE/Quake WebGL build).
Release **v1.0-clownz** · Yellow & Black edition · **Made by Clownz**

One JavaScript file, pasted into your browser's developer console, adds a full in-game mod menu. No files to install, nothing to download, nothing on the site changes — the menu simply drives the game's own console commands. **Every feature below was verified live against the real game** (each button click was tested end-to-end in a real browser session).

## Quick start

1. Open **[nzp.gay](https://nzp.gay/)**. You can paste right away or after the game has loaded — both work.
2. Press **F12** to open Developer Tools, then select **Console** (Firefox: **Ctrl+Shift+K**).
3. Open [`NZP_Clownz_Loader.js`](NZP_Clownz_Loader.js), copy the entire file, paste it into the console, press **Enter**. If DevTools blocks pasting, follow its on-screen paste instructions.
4. The **CLOWNZ MENU** panel appears in the bottom-right corner. If you pasted before the game finished loading, commands queue automatically and fire the moment the engine is up.
5. Press **Shift+M** any time to show or hide the menu. **Shift+M also pulls your mouse out of the game** so you can click the panel; click the game canvas to lock the mouse again.
6. Start a map (from the game's own menu, or from the panel's **Maps** section) and use the buttons. Every action shows a small toast at the bottom of the screen.

## What's in the menu

| Section | Features |
| --- | --- |
| **Player** | Toggle God Mode, Toggle No Clip, Respawn, Drop to Menu |
| **Points** | +500 / +1,000 / +5,000 / +10,000 / +50,000 / +100,000, and negative amounts |
| **Weapons** | All 28 wall weapons, 7 wonder weapons (Ray Gun, Wunderwaffe, DG-3, Ray Gun Mk2…), 24 Pack-a-Punched weapons — via the game's `give <id>` command with IDs from NZ:P's QuakeC |
| **Power-Ups** | Spawn any of the 8 power-ups (Nuke, Insta-Kill, Double Points, Carpenter, Max Ammo, Free Perk, Upgrade Weapon, Bonus Points) or a random one, right in front of you |
| **Damage** | Bullet damage x1 / x2 / x5 / x10 (`sv_tracedmgmultiplier`) |
| **Game Setup** | Start round (5/10/25/50), Fast Rounds, Max AI 24/96, Magic, Headshots Only, all 7 game modes (Classic, Grief, Gun Game, Hardcore, Wild West, Sticks & Stones, Festive) — applies at the next map start |
| **Maps** | All 18 shipped maps (Nacht der Untoten, Warehouse, Christmas Special, Lexi's House/Temple/Overlook, Hangar, 4All, BLOOD, Boxxer, Bunker Defense, Dungeon, Fegefeuer, Loop, Wahnsinn…) |
| **Binds** | One-click keybinds: **G** God Mode, **V** No Clip, **B** +5,000 points, **N** random power-up |

The loader also runs `sv_cheats 1` once on install, which unlocks every cheat — including in co-op, where NZ:P's own anti-cheat only blocks commands *before* cheats have been activated.

## How it works

nzp.gay runs the FTE Quake engine compiled to WebAssembly. The engine exposes a JS bridge (`FTEC`) whose `cbufadd(text)` function appends text to the engine's command buffer — exactly like typing in the game console. NZ:P's QuakeC registers gameplay commands (`god`, `noclip`, `addmoney`, `give`, `spawn_pu`, `sv_tracedmgmultiplier`) behind the `cmd` client-command prefix, plus gameplay cvars (`sv_startround`, `sv_maxai`, `sv_fastrounds`, `sv_magic`, `sv_headshotonly`, `sv_gamemode`) and the standard `map` command. The panel is pure DOM — every button simply delivers the matching console command.

## Co-op

In a co-op lobby, **the host pastes the loader** and starts any map. Once cheats are active, the commands work for **everyone** — friends can type `god`, `addmoney 5000`, etc. in their own console (open it with `~` if available), or paste the loader themselves for the panel UI. `sv_cheats 1` is server-side: it only has to be set once by the host.

## Browser console commands

Run these after pasting the loader:

```javascript
await ClownzMenu.ready;
ClownzMenu.run('cmd god');
ClownzMenu.run('map ndu');
ClownzMenu.open();
ClownzMenu.close();
ClownzMenu.maps();
ClownzMenu.disable();
```

## Troubleshooting

| Problem | What to try |
| --- | --- |
| **Panel doesn't appear** | Make sure you're on `nzp.gay` (or another NZ:P FTE WebGL page) and pasted the entire file. Check the console for errors. |
| **Buttons say "queued"** | The game engine hasn't started yet. Click **Click To Begin!** and wait for the game to finish downloading; queued commands fire automatically. |
| **Can't click the panel while playing** | Press **Shift+M** — it releases the mouse from the game and toggles the panel. |
| **Nothing happens in game** | Commands like God/No Clip need a map running (start one first). Check the toasts — `-> cmd god` means it was delivered. |
| **A weapon button does nothing** | Some maps don't precache every weapon. Try another weapon or buy it from a wall; it's harmless. |
| **Round / mode settings didn't apply** | They take effect at the next map start — pick a map from the **Maps** section after setting them. |
| **Old panel still running** | Reload the page and paste again; pasting twice just reopens the menu. |

## Notes and limits

- Requires a desktop browser with WebGL. Tested working in Chrome and Edge.
- This menu uses only the game's own documented QuakeC commands and engine features; it installs no files and survives page reloads only as a console paste (re-paste after reloading).
- NZ:P's `set_player_pos` / `set_player_angle` commands are excluded: the FTE console only forwards their first argument, so they cannot work as shipped (verified live).
- Command IDs were taken from the official [nzp-team/quakec](https://github.com/nzp-team/quakec) source (`command_parser.qc`, `shared_defs.qc`) — the exact code nzp.gay runs.
- Use at your own risk. The engine may print `Bad user command` lines for unknown names on older site builds.

## Credits

**Made by Clownz.** NZ:P command knowledge from the official NZ:P QuakeC sources. Not affiliated with the NZ:P Team.
