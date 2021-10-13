import Nano, { Component, Fragment, Img } from 'nano-jsx';
import { Store } from 'nano-jsx/lib/store';
import { Data } from '../dataUtils';
import { FileTypeSettingItem } from '../settings';
import { TitleComponent, SavedHintComponent } from './common';

interface FileTypeCardProps {
    fileType: string;
}

export class FileTypeCardComponent extends Component {
    icon: string;
    readonly name: string;
    pattern: string;
    extname: string;
    command: string;

    store = new Store({ dirty: false, saved: false });

    constructor(props: FileTypeCardProps) {
        super(props);
        const fileType = Data.getLocalSettings().fileTypes[props.fileType];
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
            if (this.checkValid()) {
                const setting = Data.getLocalSettings();
                if (setting.fileTypes[this.name] !== undefined) {
                    setting.fileTypes[this.name].pattern = this.pattern;
                    setting.fileTypes[this.name].extname = this.extname;
                    setting.fileTypes[this.name].command = this.command;
                } else {
                    setting.fileTypes[this.name] = new FileTypeSettingItem(this.name, this.pattern, this.extname, this.command);
                }
                Data.setLocalSettings(setting);
                saved = true;
            }
            this.store.setState({ dirty: !saved, saved: saved });
            this.update();
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
        return this.isRegExp(this.pattern);
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
                        <TitleComponent title={ this.name } store={ this.store } />
                    </div>
                    <div class="form-group card-body">
                        <div class="form-group">
                            <div class="form-label">正则表达式</div>
                            <div class="setting-item-description">
                                扫描脚本文件时应匹配的正则表达式。如“\.py$”。
                            </div>
                            <div class="input-group">
                                <input
                                    type="text"
                                    class={`form-input input-sm ${ this.isRegExp(this.pattern) ? '' : 'is-error' }`}
                                    value={ this.pattern }
                                    placeholder="输入匹配的正则表达式"
                                    onkeydown={ () => { this.store.setState({ dirty: true, saved: false }); } }
                                    onblur={ (event: any) => this.input(event, 'pattern') }
                                />
                            </div>
                            <div
                                class="form-input-hint-error"
                                style={`display: ${this.isRegExp(this.pattern) ? 'none' : 'block'}`}
                            >
                                正则表达式无效。
                            </div>
                        </div>
                    </div>
                    <SavedHintComponent store={ this.store } />
                </div>
            </Fragment>
        )
    }
}
