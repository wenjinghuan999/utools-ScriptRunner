import Nano, { Component, Fragment, Img } from 'nano-jsx';

export class SystemInfoCardComponent extends Component {
    icon: string;
    username: string;
    version: string;
    platform: string;
    nativeId: string;

    constructor(props: any) {
        super(props);

        this.icon = window.utools.getUser()?.avatar ?? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAQlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACO4fbyAAAAFXRSTlMACOHTj+9DaxMoHXNWTbC8ncY7gTBQQCg8AAACc0lEQVRo3u2Z3XK0IAyGSyAIImjXzf3f6nf27bQbeUGcTjvjcxxD/gwQPm5ubpoJfnKrJRZhsqubfLhQucnOyhvWZXOJ+sfGckTJw8ZPJFVoMiPqEwmE0uklMkkTtJxSPxdppswnzGfpgHudME462boyET6lm8/QEX4rJ7DNiYh0oMH5aEz0zooKxUb7SVfvXyIPPYTU5EPQ7Zu+Sk26EQ15MKpx7L/LeVYzjWvJiYZXmqBoOKR/AfGBUVpAglXHrS6sJovriS44QC+8aJRqAxLkAHZBcqWCCCcOFwQdV1ISHCEcI0mdDkg87CnS58IkOubQItGZDuTpqgUIRPRciHDWNiDeYdKm+suigMpUhw34yTp+NJ0MzDnRKrDTVoALg18EUQDtukLA/uINp4bH9uAts8YEcty96eMsr/ICHlu8FcAKSqL74IXLiGQI3O9YLoXfFpCL+ekFrg/RzyfZyqVY8KMNs4JWMYwDzW6YCbTrYbyy4VTh1aXlOQdjwvxckltBWYeeDZC2Jb7Lx2UjXEQ4yzbFyoU3WZBjcGxhB6++T6cFKzcdvDiZk1MlVj/cKurREqwcHUGhrnPXcOlrI3jg47sbmf9YfAHZP7rZ8QXEUOUqiin4Fpj+i4R+/YHAJRC40OuAThZoBfReMjADDDXgEKW0DkOWc/p5RpJgheGv3ImfLenf4JFaaWt2pTJSA0NB67G8p8pQEI81C/gkbGCsCQezvIeK+p3xYBaPlo+2tejAaLl9OG73+KZ9t2A4Dtq7cm5ZHnE2Zo6PRTm1OPO7HiiGnliufyTKv/WZ67qHOnx00+HN/4XH0sPn3pubm1b+AbmqIcRUyWtIAAAAAElFTkSuQmCC';
        this.username = window.utools.getUser()?.nickname ?? 'Unknown User';
        this.version = window.utools.getAppVersion();
        this.platform = window.utools.isWindows() ? 'Windows' : 'MacOS';
        this.nativeId = window.utools.getNativeId();
    }

    override render() {
        return (
            <Fragment>
                <div
                    id="information-card"
                    class="gap"
                />
                <div class="form-item information-card card">
                    <div class="card-header">
                        <Img
                            class="icon"
                            src={ this.icon }
                        />
                        <span class="title">{ this.username }</span>
                    </div>
                    <div class = "divider" />
                    <div class="card-body">
                        <form class="form-horizontal">
                            <div class="form-group">
                                <div class="col-3 col-sm-12">
                                    <label
                                        class="form-label label-sm"
                                        for="utools-version"
                                    >
                                        UTools版本
                                    </label>
                                </div>
                                <div class="col-9 col-sm-12">
                                    <input
                                        class="form-input input-sm"
                                        type="text"
                                        id="utools-version"
                                        value={ this.version }
                                        readonly
                                    />
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-3 col-sm-12">
                                    <label
                                        class="form-label label-sm"
                                        for="system-version"
                                    >
                                        操作系统
                                    </label>
                                </div>
                                <div class="col-9 col-sm-12">
                                    <input
                                        class="form-input input-sm"
                                        type="text"
                                        id="system-version"
                                        value={ this.platform }
                                        readonly
                                    />
                                </div>
                            </div>
                            <div
                                class="form-group tooltip tooltip-bottom"
                                data-tooltip="每台计算机的唯一ID（用于数据库）"
                            >
                                <div class="col-3 col-sm-12">
                                    <label
                                        class="form-label label-sm"
                                        for="native-id"
                                    >
                                        NativeId
                                    </label>
                                </div>
                                <div class="col-9 col-sm-12">
                                    <input
                                        class="form-input input-sm"
                                        type="text"
                                        id="native-id"
                                        value={this.nativeId}
                                        readonly
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Fragment>
        )
    }
}
