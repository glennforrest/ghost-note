import { app, Menu } from 'electron';
import { writeSetting, readSetting } from './settings';

export default function () {
  const isMac = process.platform === 'darwin'

  const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Split pane horizontally',
        },
        {
          label: 'Split pane vertically',
        },
        isMac ? { role: 'close', label: 'Close Pane' } : { role: 'quit' }
      ]
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
        ] : [
        ]),
        {
          type: 'checkbox',
          label: 'Float on top',
          checked: readSetting('floatOnTop', false),
          click: (menuItem, browserWindow) => {
            browserWindow.setAlwaysOnTop(menuItem.checked);

            writeSetting('floatOnTop', menuItem.checked);
          }
        },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' },
        ] : [
          { role: 'close' }
        ])
      ]
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
