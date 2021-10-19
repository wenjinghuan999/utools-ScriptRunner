import Nano, { Component, Fragment, Store } from 'nano-jsx';
import { Data } from '../dataUtils';
import { FileTypeSettingItem, LocalSettings } from '../settings';

interface CatalogueProps {
    localSettings: LocalSettings;
    store: ReturnType<typeof Store.prototype.use>;
}

export class CatalogueComponent extends Component<CatalogueProps> {
    constructor(props: CatalogueProps) {
        super(props);
    }

    addNewFileType() {
        const setting = Data.getLocalSettings();
        let name = 'New File Type';
        let i = 0;
        while (setting.fileTypes[name] !== undefined) {
            i++;
            name = `New File Type ${i}`;
        }
        setting.fileTypes[name] = new FileTypeSettingItem(name, '\.ext$', '.ext', '');

        console.log('Add new filetype "' + name + '"');
        Data.setLocalSettings(setting);
        this.props.store.setState({ dirtyId: FileTypeSettingItem.getId(name) });
    }

    resetToDefault() {
        if (confirm('将删除所有文件类型并重置设置，确定吗？')) {
            const setting = Data.getLocalSettings();
            console.log('Reset to default');
            setting.fileTypes = LocalSettings.buildDefaultFileTypes();
            Data.setLocalSettings(setting);
            this.props.store.setState({ dirtyId: 'python' });
        }
    }
    
    override render(): HTMLElement | void {
        return (            
            <Fragment>
                <ul class="nav">
                    <li class="nav-item">
                        <a href="#information-card">
                            <i class="icon icon-people"/>
                            <b>系统信息</b>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#plugin-settings-card">
                            <i class="icon icon-edit"/>
                            <b>插件设置</b>
                        </a>
                    </li>
                    <div class="divider"/>
                    {
                        Object.keys(this.props.localSettings.fileTypes)
                            .sort()
                            .map(key => (
                                <li class="nav-item">
                                    <a href={'#' + FileTypeSettingItem.getId(this.props.localSettings.fileTypes[key].name)}>
                                        <img
                                            class="catalogue-app-icon"
                                            src={ utools.getFileIcon(this.props.localSettings.fileTypes[key].extname) ?? '' }
                                            alt={ this.props.localSettings.fileTypes[key].name }
                                        />
                                        <span class="catalogue-app-name">{this.props.localSettings.fileTypes[key].name}</span>
                                    </a>
                                </li>
                            ))
                    }
                    <div class="divider"/>
                    <li class="nav-item">
                        <button class="btn" onclick={ () => { this.addNewFileType(); } }>
                            <i class="icon icon-plus"/>
                            <b>添加新的文件类型</b>
                        </button>
                    </li>
                    <li class="nav-item">
                        <button 
                            class="btn btn-error"
                            onclick={ () => { this.resetToDefault(); } }
                        >
                            <i class="icon icon-refresh"/>
                            <b>重置所有文件类型</b>
                        </button>
                    </li>
                </ul>
            </Fragment>
        );
    }
}