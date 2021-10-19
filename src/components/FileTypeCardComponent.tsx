import Nano, { Component, Fragment, Img } from 'nano-jsx';
import { Store } from 'nano-jsx/lib/store';
import { Data } from '../dataUtils';
import { FileTypeSettingItem } from '../settings';
import { TitleComponent, SavedHintComponent, StringSettingItemComponent } from './common';

interface FileTypeCardProps {
    fileType: string;
    store: ReturnType<typeof Store.prototype.use>;
}

export class FileTypeCardComponent extends Component<FileTypeCardProps> {
    icon: string;
    originalName: string;
    name: string;
    pattern: string;
    extname: string;
    command: string;

    store = new Store({ dirty: false, saved: false });

    constructor(props: FileTypeCardProps) {
        super(props);

        const fileType = Data.getLocalSettings().fileTypes[props.fileType];
        this.originalName = fileType.name;
        this.name = fileType.name;
        this.pattern = fileType.pattern;
        this.extname = fileType.extname;
        this.command = fileType.command;
        this.icon = window.utools.getFileIcon(this.extname);
    }

    input(key: string, value: string) {
        console.log('input[' + key + '] = ' + value); 
        if (key === 'name' || key == 'pattern') {
            if (!value) {
                return;
            }
        }
        switch (key) {
            case 'name':
                this.name = value;
                break;
            case 'pattern':
                this.pattern = value;
                break;
            case 'extname':
                this.extname = value;
                break;
            case 'command':
                this.command = value;
                break;
            default:
                return;
        }
        let saved = false;
        let fileTypeListDirty = false;
        if (this.checkValid()) {
            let setting = Data.getLocalSettings();
            if (this.name !== this.originalName && setting.fileTypes[this.originalName] !== undefined) {
                console.log('Renaming "' + this.originalName + '" to "' + this.name + '"');
                const originFileType = setting.fileTypes[this.originalName];
                setting.fileTypes[this.name] = new FileTypeSettingItem(this.name, originFileType.pattern, originFileType.extname, originFileType.command);
                delete setting.fileTypes[this.originalName];
                Data.setLocalSettings(setting);
                this.originalName = this.name;
                fileTypeListDirty = true;
            }

            setting = Data.getLocalSettings();
            if (setting.fileTypes[this.name] !== undefined) {
                if (setting.fileTypes[this.name].extname !== this.extname) {
                    fileTypeListDirty = true;
                }
                setting.fileTypes[this.name].pattern = this.pattern;
                setting.fileTypes[this.name].extname = this.extname;
                setting.fileTypes[this.name].command = this.command;
            } else {
                console.log(setting.fileTypes[this.name]);
                setting.fileTypes[this.name] = new FileTypeSettingItem(this.name, this.pattern, this.extname, this.command);
            }
            Data.setLocalSettings(setting);
            saved = true;
        }
        this.store.setState({ dirty: !saved, saved: saved });
        this.update();
        if (fileTypeListDirty) {
            this.props.store.setState({ dirtyId: FileTypeSettingItem.getId(this.name) });
        }
    }

    isNameUnique(name: string): boolean {
        if (name === this.originalName || Data.getLocalSettings().fileTypes[name] === undefined) {
            return true;
        } else {
            return false;
        }
    }

    isRegExp(pattern: string): boolean {
        try {
            new RegExp(pattern);
        } catch(e) {
            return false;
        }
        return true;
    }

    isExtName(extname: string): boolean {
        return !extname || extname.startsWith('.');
    }

    isCommand(command: string): boolean {
        return true;
    }

    checkValid(): boolean {
        return this.isNameUnique(this.name) && this.isRegExp(this.pattern) && this.isExtName(this.extname) && this.isCommand(this.command);
    }

    removeFileType() {
        if (confirm('确定删除文件类型："' + this.originalName + '"吗？')) {
            const setting = Data.getLocalSettings();
            if (setting.fileTypes[this.originalName] !== undefined) {
                console.log('Removing "' + this.originalName + '"');
                delete setting.fileTypes[this.originalName];
                Data.setLocalSettings(setting);
                this.originalName = this.name;
                this.props.store.setState({ dirtyId: FileTypeSettingItem.getId(this.name) });
            }
        }
    }

    override render() {
        return (
            <Fragment>
                <div class="gap"/>
                <div
                    class="gap"
                    id={ FileTypeSettingItem.getId(this.name) }
                />
                <div class="form-item setting-card card">
                    <div class="form-legend card-header">
                        <Img class="icon" src={ this.icon } />
                        <TitleComponent title={ this.name } store={ this.store.use() } />
                    </div>
                    <StringSettingItemComponent 
                        key="name"
                        store={ this.store.use() }
                        title="名称"
                        value={ this.name }
                        description="文件类型的显示名称（唯一名称），如“Python”。"
                        placeholder="输入文件类型名称"
                        errorMessage="文件类型名称不唯一。"
                        checkError={ (value) => { return !this.isNameUnique(value); } }
                        inputCallback={ (key: string, value: string) => this.input(key, value) }
                    />
                    <StringSettingItemComponent 
                        key="pattern"
                        store={ this.store.use() }
                        title="正则表达式"
                        value={ this.pattern }
                        description="扫描脚本文件时应匹配的正则表达式。如“\.py$”。"
                        placeholder="输入匹配的正则表达式"
                        errorMessage="正则表达式无效。"
                        checkError={ (value) => { return !this.isRegExp(value); } }
                        inputCallback={ (key: string, value: string) => this.input(key, value) }
                    />
                    <StringSettingItemComponent 
                        key="extname"
                        store={ this.store.use() }
                        title="后缀名"
                        value={ this.extname }
                        description="文件类型后缀名，用于获取图标，如“.py”或空。"
                        placeholder="空后缀名"
                        errorMessage="后缀名无效。"
                        checkError={ (value) => { return !this.isExtName(value); } }
                        inputCallback={ (key: string, value: string) => this.input(key, value) }
                    />
                    <StringSettingItemComponent 
                        key="command"
                        store={ this.store.use() }
                        title="命令行"
                        value={ this.command }
                        description="运行文件类型的命令行，如“python”、“python $FILE --args”或空。"
                        placeholder="空命令行"
                        errorMessage="命令行无效。"
                        checkError={ (value) => { return !this.isCommand(value); } }
                        inputCallback={ (key: string, value: string) => this.input(key, value) }
                    />
                    <SavedHintComponent store={ this.store.use() } />
                    <div class="divider"/>
                    <div class="form-group card-body">
                        <button class="btn btn-error" onclick={ () => { this.removeFileType(); } }>
                            <i class="icon icon-cross"/>
                            <b>删除文件类型</b>
                        </button>
                    </div>
                </div>
            </Fragment>
        )
    }
}
