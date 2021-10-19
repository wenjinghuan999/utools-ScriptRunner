import Nano, {Component, Fragment} from 'nano-jsx';
import { Store } from 'nano-jsx/lib/store';
import { Css as customCss } from '../styles/custom';
import { Css as spectreCss } from '../styles/spectre';
import { Css as spectreIconsCss } from '../styles/spectre-icons';
import { Data } from '../dataUtils';
import { CatalogueComponent } from './CatalogueComponent';
import { SystemInfoCardComponent } from './SystemInfoCardComponent';
import { PluginSettingsCardComponent } from './PluginSettingsCardComponent';
import { FileTypeCardComponent } from './FileTypeCardComponent';

export class SettingsComponent extends Component {
    store = new Store({ dirtyId: '' });
    
    override didMount() {
        this.store.use().subscribe((newState: any, prevState: any) => {
            if (newState.dirtyId && newState.dirtyId !== prevState.dirtyId) {
                const dirtyId = newState.dirtyId;
                this.store.setState({ fileTypeListDirty: false });
                console.log('Created observer for "' + dirtyId + '"');
                setTimeout(() => {
                    const e = document.getElementById(dirtyId);
                    if (e) {
                        console.log('Found "' + dirtyId + '"');
                        location.hash = '#' + dirtyId;
                    }
                }, 50);
                this.update();
            }
        })
    }
  
    override didUnmount() {
        this.store.use().cancel();
    }

    override render(): HTMLElement | void {
        return (
            <Fragment>
                <head>
                    <title />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <style>{ spectreCss }</style>
                    <style>{ spectreIconsCss }</style>
                    <style>{ customCss }</style>
                    <script src="index.js"/>
                </head>
                <body style={{ padding: '5px' }}>
                    <div id="root"/>
                    <div id="setting" class={utools.isDarkColors() ? 'container dark' : 'container'}>
                        <div class="columns">
                            <div class="column col-3">
                                <CatalogueComponent localSettings={ Data.getLocalSettings() } store={ this.store.use() }/>
                            </div>
                            <div class="column col-9">
                                <SystemInfoCardComponent />
                                <PluginSettingsCardComponent />
                                {
                                    Object.keys(Data.getLocalSettings().fileTypes)
                                    .sort()
                                    .map(key => (
                                        <FileTypeCardComponent fileType={ key } store={ this.store.use() } />
                                    ))
                                }
                                <div class="gap"/>
                                <div class="gap"/>
                            </div>
                        </div>
                    </div>
                </body>
            </Fragment>
        )
    }

    public static DoRender() {
        Nano.render(<SettingsComponent/>, document.documentElement);
    }
}