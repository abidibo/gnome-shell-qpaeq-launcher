const Lang = imports.lang;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;

const EqualizerIcon = 'equalizer-symbolic';

const QpaeqSubMenu = new Lang.Class({
    Name: 'QpaeqSubMenu',
    Extends: PopupMenu.PopupSubMenuMenuItem,

    _init: function() {
        this.parent('qpaeq launcher: loading...', true);

        this.icon.style_class = 'system-status-icon';
        this.icon.icon_name = EqualizerIcon;
        this.label.set_text("equalizer");

        this.item = new PopupMenu.PopupMenuItem('qpaeq');
        this.item.connect('activate', Lang.bind(this, this._launch));
        this.menu.addMenuItem(this.item);
    },

    _launch: function() {
        Util.spawn(['qpaeq'])
    },

    destroy: function() {
        this.parent();
    }
});

let qpaeqSubMenu = null;

function init(extensionMeta) {
    // add icons path to the theme search path
    let theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path(extensionMeta.path + "/icons");
}

function enable() {
    if (qpaeqSubMenu != null)
        return;
    qpaeqSubMenu = new QpaeqSubMenu();

    // Try to add the output-switcher right below the output slider...
    let volMen = Main.panel.statusArea.aggregateMenu._volume._volumeMenu;
    let items = volMen._getMenuItems();
    let i = 0;
    while (i < items.length)
        if (items[i] === volMen._output.item)
            break;
        else
            i++;
    volMen.addMenuItem(qpaeqSubMenu, i+1);
}

function disable() {
    qpaeqSubMenu.destroy();
    qpaeqSubMenu = null;
}
