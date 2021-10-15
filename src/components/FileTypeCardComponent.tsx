import Nano, { Component, Fragment, Img } from 'nano-jsx';
import { Store } from 'nano-jsx/lib/store';
import { Data } from '../dataUtils';
import { FileTypeSettingItem } from '../settings';
import { TitleComponent, SavedHintComponent, StringSettingItemComponent } from './common';

interface FileTypeCardProps {
    fileType: string;
    store: ReturnType<typeof Store.prototype.use>;
}

export class FileTypeCardComponent extends Component {
    icon: string;
    originalName: string;
    name: string;
    pattern: string;
    extname: string;
    command: string;

    store = new Store({ dirty: false, saved: false });
    parentStore: ReturnType<typeof Store.prototype.use>;

    constructor(props: FileTypeCardProps) {
        super(props);
        this.parentStore = props.store;

        const fileType = Data.getLocalSettings().fileTypes[props.fileType];
        this.originalName = fileType.name;
        this.name = fileType.name;
        this.pattern = fileType.pattern;
        this.extname = fileType.extname;
        this.command = fileType.command;
        this.icon = window.utools.getFileIcon(this.extname);
    }

    input(event: any, id: string) {
        let inputValue = event.target?.value;
        if (!inputValue) {
            return;
        } else {
            console.log('input: ' + inputValue); 
            switch (id) {
                case 'name':
                    this.name = inputValue;
                    break;
                case 'pattern':
                    this.pattern = inputValue;
                    break;
                case 'extname':
                    this.extname = inputValue;
                    break;
                case 'command':
                    this.command = inputValue;
                    break;
                default:
                    break;
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
                this.parentStore.setState({ dirtyId: FileTypeSettingItem.getId(this.name) });
            }
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

    checkValid(): boolean {
        return this.isNameUnique(this.name) && this.isRegExp(this.pattern);
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
                        store={ this.store.use() }
                        title="名称"
                        value={ this.name }
                        description="文件类型的显示名称（唯一名称），如“Python”。"
                        placeholder="文件类型名称"
                        errorMessage="文件类型名称不唯一。"
                        checkError={ (value) => { return !this.isNameUnique(value); } }
                        inputCallback={ (event) => { this.input(event, 'name'); } }
                    />
                    <StringSettingItemComponent 
                        store={ this.store.use() }
                        title="正则表达式"
                        value={ this.pattern }
                        description="扫描脚本文件时应匹配的正则表达式。如“\.py$”。"
                        placeholder="输入匹配的正则表达式"
                        errorMessage="正则表达式无效。"
                        checkError={ (value) => { return !this.isRegExp(value); } }
                        inputCallback={ (event) => { this.input(event, 'pattern'); } }
                    />
                    <SavedHintComponent store={ this.store.use() } />
                </div>
            </Fragment>
        )
    }
}
