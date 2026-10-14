'use strict';
// Bridge between the toolbar/tab-strip renderer and the main process.
const { contextBridge, ipcRenderer } = require('electron');

const invoke = (channel) => (...args) => ipcRenderer.invoke(channel, ...args);
const on = (channel) => (fn) => { const h = (e, ...a) => fn(...a); ipcRenderer.on(channel, h); return () => ipcRenderer.removeListener(channel, h); };

contextBridge.exposeInMainWorld('ui', {
  tabs: {
    state: invoke('tabs:state'), new: invoke('tabs:new'), close: invoke('tabs:close'), closeOthers: invoke('tabs:close-others'),
    closeRight: invoke('tabs:close-right'), activate: invoke('tabs:activate'), move: invoke('tabs:move'),
    duplicate: invoke('tabs:duplicate'), mute: invoke('tabs:mute'), reopen: invoke('tabs:reopen')
  },
  nav: { go: invoke('nav:go'), back: invoke('nav:back'), forward: invoke('nav:forward'), reload: invoke('nav:reload'), stop: invoke('nav:stop'), home: invoke('nav:home') },
  zoom: invoke('zoom'),
  find: invoke('find'), stopFind: invoke('find:stop'),
  setChromeHeight: invoke('ui:chrome-height'), setOverlay: invoke('ui:overlay'), focusPage: invoke('ui:focus-page'),
  suggest: invoke('suggest'),
  bookmarks: { list: invoke('bookmarks:list'), toggle: invoke('bookmark:toggle'), remove: invoke('bookmarks:remove'), add: invoke('bookmarks:add'), update: invoke('bookmarks:update'), move: invoke('bookmarks:move') },
  shield: { toggle: invoke('shield:toggle'), info: invoke('shield:info') },
  settings: { get: invoke('settings:get'), set: invoke('settings:set') },
  downloads: { list: invoke('downloads:list'), pause: invoke('downloads:pause'), resume: invoke('downloads:resume'), cancel: invoke('downloads:cancel'), remove: invoke('downloads:remove'), open: invoke('downloads:open'), show: invoke('downloads:show'), openFolder: invoke('downloads:open-folder'), clear: invoke('downloads:clear') },
  window: { new: invoke('window:new'), close: invoke('window:close'), fullscreen: invoke('window:fullscreen') },
  devtools: invoke('devtools'), print: invoke('print'), quit: invoke('quit'), copy: invoke('clipboard:write'),
  onTabs: on('tabs:update'), onBookmarks: on('bookmarks:update'), onDownloads: on('downloads:update'), onSettings: on('settings:update'),
  onFindResult: on('find:result'), onFocusAddress: on('ui:focus-address'), onOpenFind: on('ui:open-find'),
  onToggleBookmarksBar: on('ui:toggle-bookmarks-bar'), onBookmarkToggled: on('ui:bookmark-toggled'), onClosePopups: on('ui:close-popups')
});
