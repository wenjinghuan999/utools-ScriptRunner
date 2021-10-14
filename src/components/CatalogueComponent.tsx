import Nano, { Component, Fragment } from 'nano-jsx';
import { FileTypeSettingItem, LocalSettings } from '../settings';

interface CatalogueProps {
    localSettings: LocalSettings
}

export class CatalogueComponent extends Component {

    localSettings: LocalSettings;

    constructor(props: CatalogueProps) {
        super(props);
        this.localSettings = props.localSettings;
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
                        Object.keys(this.localSettings.fileTypes)
                            .sort()
                            .map(key => (
                                <li class="nav-item">
                                    <a href={'#' + FileTypeSettingItem.getId(this.localSettings.fileTypes[key].name)}>
                                        <img
                                            class="catalogue-app-icon"
                                            src={ utools.getFileIcon('.py') ?? '' }
                                            alt={ this.localSettings.fileTypes[key].name }
                                        />
                                        <span class="catalogue-app-name">{this.localSettings.fileTypes[key].name}</span>
                                    </a>
                                </li>
                            ))
                    }
                </ul>
            </Fragment>
        );
    }
}