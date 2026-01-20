export interface KeyboardShortcut {
	key: string;
	description: string;
	action: () => void;
	category: 'navigation' | 'actions' | 'editing' | 'view';
}

export class KeyboardShortcutManager {
	private shortcuts: Map<string, KeyboardShortcut> = new Map();
	private enabled = true;

	constructor() {
		if (typeof window !== 'undefined') {
			this.init();
		}
	}

	private init() {
		document.addEventListener('keydown', this.handleKeyDown.bind(this));
	}

	register(shortcut: KeyboardShortcut): void {
		const key = this.normalizeKey(shortcut.key);
		this.shortcuts.set(key, shortcut);
	}

	unregister(key: string): void {
		const normalizedKey = this.normalizeKey(key);
		this.shortcuts.delete(normalizedKey);
	}

	private normalizeKey(key: string): string {
		return key.toLowerCase().replace(/\s+/g, '');
	}

	private handleKeyDown(event: KeyboardEvent): void {
		if (!this.enabled) return;

		// Ignore if user is typing in an input field
		const target = event.target as HTMLElement;
		if (
			target.tagName === 'INPUT' ||
			target.tagName === 'TEXTAREA' ||
			target.contentEditable === 'true'
		) {
			return;
		}

		const modifiers: string[] = [];
		if (event.ctrlKey) modifiers.push('ctrl');
		if (event.metaKey) modifiers.push('cmd');
		if (event.shiftKey) modifiers.push('shift');
		if (event.altKey) modifiers.push('alt');

		const key = event.key.toLowerCase();
		const fullKey = [...modifiers, key].join('+');

		const shortcut = this.shortcuts.get(fullKey);
		if (shortcut) {
			event.preventDefault();
			shortcut.action();
		}
	}

	enable(): void {
		this.enabled = true;
	}

	disable(): void {
		this.enabled = false;
	}

	getAllShortcuts(): KeyboardShortcut[] {
		return Array.from(this.shortcuts.values());
	}

	getShortcutsByCategory(category: KeyboardShortcut['category']): KeyboardShortcut[] {
		return Array.from(this.shortcuts.values()).filter((s) => s.category === category);
	}
}

// Global instance
let shortcutManager: KeyboardShortcutManager | null = null;

export function getShortcutManager(): KeyboardShortcutManager {
	if (!shortcutManager) {
		shortcutManager = new KeyboardShortcutManager();
	}
	return shortcutManager;
}

// Default shortcuts for the app
export function registerDefaultShortcuts(manager: KeyboardShortcutManager): void {
	// Navigation
	manager.register({
		key: 'Ctrl+K',
		description: 'Quick search',
		category: 'navigation',
		action: () => {
			// Navigate to home
			window.location.href = '/';
		}
	});

	manager.register({
		key: 'Ctrl+/',
		description: 'Show keyboard shortcuts',
		category: 'navigation',
		action: () => {
			// Show shortcuts modal (to be implemented)
			alert('Keyboard Shortcuts:\nCtrl+K: Quick search\nCtrl+S: Save mapping\nCtrl+E: Export\nCtrl+Z: Undo\nCtrl+Shift+Z: Redo\n/: Show shortcuts');
		}
	});

	// Actions
	manager.register({
		key: 'Ctrl+S',
		description: 'Save mapping',
		category: 'actions',
		action: () => {
			// Trigger save
			document.dispatchEvent(new CustomEvent('save-mapping'));
		}
	});

	manager.register({
		key: 'Ctrl+E',
		description: 'Export CSV',
		category: 'actions',
		action: () => {
			// Trigger export
			document.dispatchEvent(new CustomEvent('export-csv'));
		}
	});

	// Editing
	manager.register({
		key: 'Ctrl+Z',
		description: 'Undo',
		category: 'editing',
		action: () => {
			document.dispatchEvent(new CustomEvent('undo'));
		}
	});

	manager.register({
		key: 'Ctrl+Shift+Z',
		description: 'Redo',
		category: 'editing',
		action: () => {
			document.dispatchEvent(new CustomEvent('redo'));
		}
	});

	manager.register({
		key: 'Delete',
		description: 'Delete selected',
		category: 'editing',
		action: () => {
			document.dispatchEvent(new CustomEvent('delete-selected'));
		}
	});

	// View
	manager.register({
		key: 'Ctrl+D',
		description: 'Toggle dark mode',
		category: 'view',
		action: () => {
			document.dispatchEvent(new CustomEvent('toggle-dark-mode'));
		}
	});
}
