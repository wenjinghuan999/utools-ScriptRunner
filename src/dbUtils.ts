import { LocalSettings, GlobalSettings } from './settings';

abstract class DBDocBase<T> {
    abstract readonly id: string;
    abstract readonly enableSync: boolean;
    public abstract data: T;

    public load(): T {
        const local_id = this.enableSync ? this.id : this.id + '_' + window.utools.getNativeId()
        const data = window.utools.dbStorage.getItem(local_id);
        if (data !== undefined && data !== null) {
            this.data = data;
        }
        return this.data;
    }

    public store(): void {
        const local_id = this.enableSync ? this.id : this.id + '_' + window.utools.getNativeId()
        window.utools.dbStorage.setItem(local_id, this.data);
    }
}

export class DBDirs extends DBDocBase<string[]> {
    readonly id = 'dirs';
    readonly enableSync = false;
    public data: string[] = [];
}

export class DBScripts extends DBDocBase<Record<string, string[]>> {
    readonly id = 'scripts';
    readonly enableSync = false;
    public data: Record<string, string[]> = {};
}

export class DBLocalSettings extends DBDocBase<LocalSettings> {
    readonly id = 'settings';
    readonly enableSync = false;
    public data = new LocalSettings();
}

export class DBGlobalSettings extends DBDocBase<GlobalSettings> {
    readonly id = 'global-settings';
    readonly enableSync = true;
    public data = new GlobalSettings();
}
