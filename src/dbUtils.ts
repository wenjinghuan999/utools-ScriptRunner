import { LocalSettings, GlobalSettings } from './settings';

abstract class DBDocBase<T> {
    abstract readonly id: string;
    abstract readonly enableSync: boolean;
    public abstract data: T;
    public abstract checkValid(inData: any): boolean;
    public abstract recover(inData: any): T;

    public load(): T {
        const local_id = this.enableSync ? this.id : this.id + '_' + window.utools.getNativeId()
        const data = window.utools.dbStorage.getItem(local_id);
        if (data !== undefined && data !== null) {
            if (!this.checkValid(data)) {
                this.data = this.recover(data);
            } else {
                this.data = data;
            }
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

    public checkValid(inData: any): boolean {
        return true;
    }

    public recover(inData: any): string[] {
        return [];
    }
}

export class DBScripts extends DBDocBase<Record<string, string[]>> {
    readonly id = 'scripts';
    readonly enableSync = false;
    public data: Record<string, string[]> = {};

    public checkValid(inData: any): boolean {
        return true;
    }

    public recover(inData: Record<string, string[]>): Record<string, string[]> {
        return {};
    }
}

export class DBLocalSettings extends DBDocBase<LocalSettings> {
    readonly id = 'settings';
    readonly enableSync = false;
    public data = new LocalSettings();

    public checkValid(inData: any): boolean {
        return inData instanceof LocalSettings;
    }

    public recover(inData: any): LocalSettings {
        return Object.assign(this.data, inData);
    }
}

export class DBGlobalSettings extends DBDocBase<GlobalSettings> {
    readonly id = 'global-settings';
    readonly enableSync = true;
    public data = new GlobalSettings();

    public checkValid(inData: any): boolean {
        return inData instanceof GlobalSettings;
    }

    public recover(inData: any): GlobalSettings {
        return Object.assign(this.data, inData);
    }
}
