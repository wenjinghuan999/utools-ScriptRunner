abstract class DBDocBase {
    abstract readonly id: string;
    abstract readonly enableSync: boolean;
    public abstract data: any;

    public load(): void {
        const local_id = this.enableSync ? this.id : this.id + '_' + window.utools.getNativeId()
        const data = window.utools.dbStorage.getItem(local_id);
        if (data !== undefined && data !== null) {
            this.data = data;
        }
    }

    public store(): void {
        const local_id = this.enableSync ? this.id : this.id + '_' + window.utools.getNativeId()
        window.utools.dbStorage.setItem(local_id, this.data);
    }
}

export class DBDirs extends DBDocBase {
    readonly id = 'dirs';
    readonly enableSync = false;
    public data: string[] = [];
}

export class DBScripts extends DBDocBase {
    readonly id = 'scripts';
    readonly enableSync = false;
    public data: Record<string, string[]> = {};
}