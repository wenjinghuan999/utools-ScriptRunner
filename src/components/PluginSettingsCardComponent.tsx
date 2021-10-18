import Nano, { Component, Fragment, Img } from 'nano-jsx';
import { Store } from 'nano-jsx/lib/store';
import { SavedHintComponent, TitleComponent, StringSettingItemComponent, BooleanSettingItemComponent } from './common';
import { Data } from '../dataUtils';

export class PluginSettingsCardComponent extends Component {
    private icon: string = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAmVBMVEUAAABceIhgfYtffYxgfYtffYtgfYtgfItgfYtffYxgfItgfItgfotgfotgfotgfYtgfYtgfYtgfYtgfoxgfYtgfYtgfYxgfYtEWmRgfYtgfYtFWmRFWWRgfYtEWmRFWWNgfYtEWmRFWmRFWmNFWmREWmVFWmRFWmRFWmRFWmRFWWRgfYtFWmRJYGtceIVYc4BOZnJRa3dVbnsdBSFyAAAAK3RSTlMADvll57nxOttNn3YsjIFEHMNZJK5tFtHyypdHFjLXtKaTMyR2YePLvoKcxDF7bgAABKlJREFUeNrs1+tyokAQBeDDyEVEEEHWaDQxiVYl6Rm8vP/D7dZuys0qNNNsjb/8HmCmge4zA+7u7u7uevGa4Ta8maJmfoxbGFErleMGhtRugBtQ1C6Dex4xlnBvTIwZ3IuIMYV7BTGGcK8ihoJ7GXE8ODciTgnnAuJEcG5BnBjO+cSp4JwiTgbXPKKbZHFRjZkklmfxYBlDwJsTUTBpWmhILLVpKNxLfGF7pPTbvMC/Ep+6BRcl5Gkova2U6pztlYezgU92RjnOxhvFfB6LrAnT/GulKVlTCf6Igj4hEV+stiwBZIokFiWAYsGclaJL32wSkFA4qK7XSWAjIVt1vf+lru2rytHtR2i19+lg9Jk5nOyq2AiOW0Z9NPqKOTI1CE7LNXXZG93C7KnLHF2mou3lJVTgFcQ76A6H+r/60POJc9LdzIlYI3Ayu8fnHYgV8YcAw2hLhg9JtJtxs2e0NVNTr1/oiWT//hX4HlrM2fcvYvrc2yrZ/v0rUGvxCB612FH8E50y8ad74EKxEP5xGN2DkV6eff4DyB2ZAkQXkVr3VFMLNUGTRIkSuH8mhzGarYeyF/D0st3tti9PwlcwLdEqte+Ah483fHn7eLDvApWBE/uWI/C5wjerT9tBGEbg5YFVBmxxYWeXBSMPnSrV3YKPuPJo0YZhgSZ8Lxru+b/bdn6DIIellJ+BdzR65+dAZbAXh9w18BWNXvW109/uG0PCZ4bwGS2euUGcQYTrwR1a7LgunEOi5HpwhRYrrgtDSERMAT/bNbvdxGEgCk9MnLD5Ify0CSwtLYsErYY0wPs/3K72oqWRfWwTu1KlfrdcMARnzvic2ZOWPXoNyIUKFHAgLQdUAGhByCTBZ9B8Cvmdqa8CXkjLCyqg9nUGNqRl4+0MFKCAJWlZggLEjY5wi5TIrEftrXFSAhrRljRsUSOS5EIdAy1YPmj60BJoASgAz0Xd0foRbPFEMptaH4CMrzhiOcRieOQr4oqsqGLjRLR/UPwBe/NEVDoMI9gX2uyox045nPf9IlmTgXTMfdRD+br3BqoHc+4TpwQphfXF6OnqIPx5sr0a4cHssXG6mx9e17so2q1fD0439DutLOZi2OUcCYHN3yChPeHTohApUGCPj6B1s2hyYNF5tgc4cV3NOHs2SKRzLt/6tYjUNl0hTD6pL680A01YR+fRpEvqW8KCzs/34/BuhMMKBy43rvo0DOj8/H7+hadxD449Tq4kIZ4Zchqe2IgFIaaCIZd2aGZVmvekMCebn4/TEszYnNsaQ8NBK5dzh+jYPTxekZkZW9CdT+DbHTJDLAmYt+5yPv3jfOne2I6MbPitGCAku5JkiUNujCVBpkQjwU6sFhTdx0AEEPf9FRa8RAMs+dEYi4D5VUwmtfsaEcvFx6Q5wyKAPbJ4En3eyEqsnn5F1zxmAogAkoRmTn3qCS5BvYG2+F+CKMie6DmWlfqTFbO71taT2V36JTutXFNoSkYICk6OxY6Cg8WqoeBUjJAUnMKgNsGphwxc4feKcwoPVIQ5hadhQEXhkQwoKDwZ7sThKXEnDk+OO3F40uCN0Dw160hS+hLSkZp5RD/88A35C2SN6arArlV4AAAAAElFTkSuQmCC`
    store = new Store({ dirty: false, saved: false });

    createFeature: boolean;
    env: string;

    constructor(props: any) {
        super(props);

        const globalSetting = Data.getGlobalSettings();
        this.createFeature = globalSetting.createFeature;
        const localSetting = Data.getLocalSettings();
        this.env = localSetting.commonSettings.env;
    }

    input(key: string, value: string) {
        console.log('input[' + key + '] = ' + value); 
        switch (key) {
            case 'env':
                this.env = value;
                break;
            default:
                return;
        }
        let saved = false;
        if (this.checkValid()) {
            const setting = Data.getLocalSettings();
            setting.commonSettings.env = this.env;
            console.log(setting);
            Data.setLocalSettings(setting);
            saved = true;
        }
        this.store.setState({ dirty: !saved, saved: saved });
        this.update();
    }

    switch(key: string, value: boolean) {
        console.log('switch[' + key + '] = ' + value);
        switch (key) {
            case 'createFeature':
                this.createFeature = value;
                break;
            default:
                return;
        }
        const settings = Data.getGlobalSettings();
        settings.createFeature = value;
        let saved = false;
        if (this.checkValid()) {
            const setting = Data.getGlobalSettings();
            setting.createFeature = this.createFeature;
            console.log(setting);
            Data.setGlobalSettings(setting);
            saved = true;
        }
        this.store.setState({ dirty: !saved, saved: saved });
        this.update();
    }

    checkValid(): boolean {
        return true;
    }

    override render() {
        return (
            <Fragment>
                <div class="gap"/>
                <div
                    id="plugin-settings-card"
                    class="gap"
                />
                <div class="form-item plugin-settings-card card">
                    <div class="card-header">
                        <Img
                            class="icon"
                            src={this.icon}
                        />
                        <TitleComponent title="插件设置" store={ this.store.use() } />
                    </div>
                    <div class = "divider" />
                    <BooleanSettingItemComponent 
                        key="createFeature"
                        title="创建关键字"
                        value={ this.createFeature }
                        description="为每个脚本文件创建关键字（脚本数目较多时建议禁用）。"
                        inputCallback={ (key: string, value: boolean) => this.switch(key, value) }
                    />
                    <StringSettingItemComponent
                        key="env"
                        store={ this.store.use() }
                        title="环境变量"
                        value={ this.env }
                        description="需要追加的环境变量，如“:/usr/local/bin”或空。"
                        placeholder="未设置追加环境变量"
                        errorMessage=""
                        checkError={ () => { return false; } }
                        inputCallback={ (key: string, value: string) => this.input(key, value) }
                    />
                    <SavedHintComponent store={ this.store.use() } />
                </div>
            </Fragment>
        )
    }
}
