import Nano, { Component, Fragment } from 'nano-jsx';
import { Store } from 'nano-jsx/lib/store';

interface SavedHintProps {
    store: ReturnType<typeof Store.prototype.use>;
}

export class SavedHintComponent extends Component {
    parentStore: ReturnType<typeof Store.prototype.use>;
  
    constructor(props: SavedHintProps) {
        super(props);
        this.parentStore = props.store;
    }

    override didMount() {
        this.parentStore.subscribe((newState: any, prevState: any) => {
            if (newState.saved !== prevState.saved) {
                this.update();
            }
        })
    }
  
    override didUnmount() {
        this.parentStore.cancel();
    }

    override render () { 
        return (
            <Fragment>
                <div
                    class="form-input-hint"
                    style={`display: ${ this.parentStore.state.saved ? 'block' : 'none' }`}
                >
                    设置已保存。
                </div>
            </Fragment>
        );
    }
}

interface TitleProps {
    title: string;
    store: ReturnType<typeof Store.prototype.use>;
}

export class TitleComponent extends Component<TitleProps> {
    constructor(props: TitleProps) {
        super(props);
    }

    override didMount() {
        this.props.store.subscribe((newState: any, prevState: any) => {
            if (newState.dirty !== prevState.dirty) {
                this.update();
            }
        })
    }
  
    override didUnmount() {
        this.props.store.cancel();
    }

    override render () { 
        return (
            <Fragment>
                <span
                    class={'title' + (this.props.store.state.dirty ? ' badge badge-unready' : '')}
                    data-badge="已修改"
                >
                    { this.props.title }
                </span>
            </Fragment>
        );
    }
}

type StringInputCheckErrorFunc = (value: string) => boolean;
type StringInputCallback = (id: string, value: string) => void;

interface StringSettingItemProps {
    key: string;
    store: ReturnType<typeof Store.prototype.use>;
    title: string;
    description: string;
    placeholder: string;
    errorMessage: string;
    value: string;
    checkError: StringInputCheckErrorFunc;
    inputCallback: StringInputCallback;
}

export class StringSettingItemComponent extends Component<StringSettingItemProps> {
    constructor(props: StringSettingItemProps) {
        super(props);
    }

    override render () { 
        return (
            <Fragment>
                <div class="form-group card-body">
                    <div class="form-group">
                        <div class="form-label">{ this.props.title }</div>
                        <div class="setting-item-description">
                            { this.props.description }
                        </div>
                        <div class="input-group">
                            <input
                                type="text"
                                class={`form-input input-sm ${ this.props.checkError(this.props.value) ? 'is-error' : '' }`}
                                value={ this.props.value }
                                placeholder={ this.props.placeholder }
                                onkeydown={ () => { this.props.store.setState({ dirty: true, saved: false }); } }
                                onblur={ (event: { target?: { value?: string }}) => { this.props.inputCallback(this.props.key, event.target?.value ?? ''); } }
                            />
                        </div>
                        <div
                            class="form-input-hint-error"
                            style={`display: ${ this.props.checkError(this.props.value) ? 'block' : 'none' }`}
                        >
                            { this.props.errorMessage }
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

type BooleanInputCallback = (id: string, value: boolean) => void;

interface BooleanSettingItemProps {
    key: string;
    title: string;
    description: string;
    value: boolean;
    inputCallback: BooleanInputCallback;
}

export class BooleanSettingItemComponent extends Component<BooleanSettingItemProps> {
    constructor(props: BooleanSettingItemProps) {
        super(props);
    }

    override render () { 
        return (
            <Fragment>
                <div class="card-body">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <div class="col-10 col-mr-auto">
                                <div class="form-label">{ this.props.title }</div>
                                <div class="form-description">{ this.props.description }</div>
                            </div>
                            <div class="col-1 flex-column-center">
                                <label class="form-switch">
                                    {
                                        this.props.value
                                            ? <input
                                                type="checkbox"
                                                checked
                                                onchange={() => this.props.inputCallback(this.props.key, false)}
                                            />
                                            :
                                            <input
                                                type="checkbox"
                                                onchange={() => this.props.inputCallback(this.props.key, true)}
                                            />
                                    }
                                    <i class="form-icon"/>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>
            </Fragment>
        );
    }
}