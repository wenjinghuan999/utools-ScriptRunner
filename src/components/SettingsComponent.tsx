import Nano, {Component, Fragment} from 'nano-jsx';
import { Css as customCss } from '../styles/custom';
import { Css as spectreCss } from '../styles/spectre';
import { Data } from '../dataUtils';
import { CatalogueComponent } from './CatalogueComponent';
import { PluginSettingsCardComponent } from './PluginSettingsCardComponent';
import { FileTypeCardComponent } from './FileTypeCardComponent';

export class SettingsComponent extends Component {
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
                    <style>{ customCss }</style>
                    <script src="index.js"/>
                </head>
                <body style={{ padding: '5px' }}>
                    <div id="root"/>
                    <div id="setting" class={utools.isDarkColors() ? 'container dark' : 'container'}>
                        <div class="columns">
                            <div class="column col-3">
                                <CatalogueComponent localSettings={ Data.getLocalSettings() }/>
                            </div>
                            <div class="column col-9">
                                {/* <InformationCard platform={this.state.platform}/> */}
                                <PluginSettingsCardComponent />
                                {
                                    Object.keys(Data.getLocalSettings().fileTypes)
                                    .map(key => (
                                        <FileTypeCardComponent fileType={ key } />
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