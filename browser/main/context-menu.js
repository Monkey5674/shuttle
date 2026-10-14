'use strict';
// Right-click menu for web pages.
const { Menu, clipboard, nativeImage, shell } = require('electron');
const store = require('./store');
const { BrowserWin } = require('./windows');
const urls = require('./urls');

function show(bw, tab, params) {
  const wc = tab.view.webContents;
  const template = [];
  const add = (item) => template.push(item);
  const sep = () => template.length && template[template.length - 1].type !== 'separator' && add({ type: 'separator' });

  if (params.linkURL) {
    add({ label: 'Open link in new tab', click: () => bw.newTab(params.linkURL, { active: false, index: bw.tabs.indexOf(tab) + 1 }) });
    add({ label: 'Open link in new window', click: () => new BrowserWin({ tabs: [{ url: params.linkURL }] }) });
    add({ label: 'Open link in private window', click: () => new BrowserWin({ isPrivate: true, tabs: [{ url: params.linkURL }] }) });
    add({ label: 'Copy link address', click: () => clipboard.writeText(params.linkURL) });
    if (params.linkText) add({ label: 'Copy link text', click: () => clipboard.writeText(params.linkText) });
    sep();
  }
  if (params.mediaType === 'image' && params.srcURL) {
    add({ label: 'Open image in new tab', click: () => bw.newTab(params.srcURL, { active: false, index: bw.tabs.indexOf(tab) + 1 }) });
    add({ label: 'Save image as…', click: () => wc.downloadURL(params.srcURL, { headers: { Referer: tab.url } }) });
    add({ label: 'Copy image', click: () => wc.copyImageAt(params.x, params.y) });
    add({ label: 'Copy image address', click: () => clipboard.writeText(params.srcURL) });
    sep();
  }
  if ((params.mediaType === 'video' || params.mediaType === 'audio') && params.srcURL) {
    add({ label: `Save ${params.mediaType} as…`, click: () => wc.downloadURL(params.srcURL) });
    add({ label: `Copy ${params.mediaType} address`, click: () => clipboard.writeText(params.srcURL) });
    sep();
  }
  if (params.isEditable) {
    for (const s of (params.dictionarySuggestions || []).slice(0, 5)) {
      add({ label: s, click: () => wc.replaceMisspelling(s) });
    }
    if (params.misspelledWord) {
      add({ label: 'Add to dictionary', click: () => wc.session.addWordToSpellCheckerDictionary(params.misspelledWord) });
      sep();
    }
    add({ label: 'Undo', role: 'undo', enabled: params.editFlags.canUndo });
    add({ label: 'Redo', role: 'redo', enabled: params.editFlags.canRedo });
    sep();
    add({ label: 'Cut', role: 'cut', enabled: params.editFlags.canCut });
    add({ label: 'Copy', role: 'copy', enabled: params.editFlags.canCopy });
    add({ label: 'Paste', role: 'paste', enabled: params.editFlags.canPaste });
    add({ label: 'Paste as plain text', role: 'pasteAndMatchStyle', enabled: params.editFlags.canPaste });
    add({ label: 'Select all', role: 'selectAll' });
    sep();
  } else if (params.selectionText && params.selectionText.trim()) {
    const text = params.selectionText.trim();
    const short = text.length > 40 ? text.slice(0, 40) + '…' : text;
    add({ label: 'Copy', role: 'copy' });
    const engine = store.SEARCH_ENGINES[store.settings.get().searchEngine] || store.SEARCH_ENGINES.duckduckgo;
    add({ label: `Search ${engine.name} for “${short}”`, click: () => bw.newTab(store.settings.searchUrl(text), { active: true, index: bw.tabs.indexOf(tab) + 1 }) });
    if (urls.fromUserInput(text) && !urls.fromUserInput(text).includes(encodeURIComponent(text))) {
      add({ label: `Go to ${short}`, click: () => bw.newTab(urls.fromUserInput(text), { active: true }) });
    }
    sep();
  }
  if (!params.linkURL && !params.isEditable && !params.selectionText) {
    add({ label: 'Back', enabled: wc.navigationHistory.canGoBack(), click: () => wc.navigationHistory.goBack() });
    add({ label: 'Forward', enabled: wc.navigationHistory.canGoForward(), click: () => wc.navigationHistory.goForward() });
    add({ label: 'Reload', click: () => wc.reload() });
    sep();
    add({ label: 'Bookmark this page', enabled: urls.isBookmarkable(tab.url), click: () => { bw.toggleBookmark(); } });
    add({ label: 'Save page as…', click: () => wc.savePage(require('path').join(require('electron').app.getPath('downloads'), (wc.getTitle() || 'page').replace(/[\\/:*?"<>|]/g, '_') + '.html'), 'HTMLComplete').catch(() => {}) });
    add({ label: 'Print…', click: () => wc.print() });
    add({ label: 'View page source', enabled: urls.isWebUrl(tab.url), click: () => bw.newTab('view-source:' + tab.url, { active: true, index: bw.tabs.indexOf(tab) + 1 }) });
    sep();
  }
  add({ label: 'Inspect', click: () => { wc.inspectElement(params.x, params.y); if (!wc.isDevToolsOpened()) wc.openDevTools({ mode: 'bottom' }); } });

  Menu.buildFromTemplate(template).popup({ window: bw.win });
}

module.exports = { show };
