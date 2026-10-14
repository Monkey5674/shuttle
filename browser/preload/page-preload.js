'use strict';
// Runs in every tab. Only the browser's own drew:// pages get an API; for
// ordinary websites this script exposes nothing at all.
const { contextBridge, ipcRenderer } = require('electron');

if (location.protocol === 'drew:') {
  const invoke = (channel) => (...args) => ipcRenderer.invoke(channel, ...args);
  const on = (channel) => (fn) => { ipcRenderer.on(channel, (e, ...a) => fn(...a)); };
  contextBridge.exposeInMainWorld('drew', {
    open: invoke('page:open'), retry: invoke('page:retry'), back: invoke('page:back'),
    settings: { get: invoke('settings:get'), set: invoke('settings:set') },
    bookmarks: { list: invoke('bookmarks:list'), add: invoke('bookmarks:add'), update: invoke('bookmarks:update'), remove: invoke('bookmarks:remove'), move: invoke('bookmarks:move'), export: invoke('bookmarks:export'), import: invoke('bookmarks:import') },
    history: { list: invoke('history:list'), remove: invoke('history:remove'), clear: invoke('history:clear'), top: invoke('history:top') },
    downloads: { list: invoke('downloads:list'), pause: invoke('downloads:pause'), resume: invoke('downloads:resume'), cancel: invoke('downloads:cancel'), remove: invoke('downloads:remove'), clear: invoke('downloads:clear'), open: invoke('downloads:open'), show: invoke('downloads:show'), openFolder: invoke('downloads:open-folder') },
    privacy: { status: invoke('privacy:status'), updateList: invoke('privacy:update-list'), allowlistRemove: invoke('privacy:allowlist-remove'), clearData: invoke('privacy:clear-data') },
    permissions: { list: invoke('permissions:list'), clear: invoke('permissions:clear') },
    auth: { submit: invoke('auth:submit'), cancel: invoke('auth:cancel') },
    proxy: { status: invoke('proxy:status') },
    onDownloads: on('downloads:update')
  });
}
