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

export class TitleComponent extends Component {
    title: string;
    parentStore: ReturnType<typeof Store.prototype.use>;
  
    constructor(props: TitleProps) {
        super(props);
        this.title = props.title;
        this.parentStore = props.store;
    }

    override didMount() {
        this.parentStore.subscribe((newState: any, prevState: any) => {
            if (newState.dirty !== prevState.dirty) {
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
                <span
                    class={'title' + (this.parentStore.state.dirty ? ' badge badge-unready' : '')}
                    data-badge="已修改"
                >
                    { this.title }
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

export class StringSettingItemComponent extends Component {
    key: string;
    parentStore: ReturnType<typeof Store.prototype.use>;
    title: string;
    description: string;
    placeholder: string;
    errorMessage: string;
    value: string;
    checkError: StringInputCheckErrorFunc;
    inputCallback: StringInputCallback;
  
    constructor(props: StringSettingItemProps) {
        super(props);
        this.key = props.key;
        this.parentStore = props.store;
        this.title = props.title;
        this.description = props.description;
        this.placeholder = props.placeholder;
        this.errorMessage = props.errorMessage;
        this.value = props.value;
        this.checkError = props.checkError;
        this.inputCallback = props.inputCallback;
    }

    override render () { 
        return (
            <Fragment>
                <div class="form-group card-body">
                    <div class="form-group">
                        <div class="form-label">{ this.title }</div>
                        <div class="setting-item-description">
                            { this.description }
                        </div>
                        <div class="input-group">
                            <input
                                type="text"
                                class={`form-input input-sm ${ this.checkError(this.value) ? 'is-error' : '' }`}
                                value={ this.value }
                                placeholder={ this.placeholder }
                                onkeydown={ () => { this.parentStore.setState({ dirty: true, saved: false }); } }
                                onblur={ (event: { target?: { value?: string }}) => { this.inputCallback(this.key, event.target?.value ?? ''); } }
                            />
                        </div>
                        <div
                            class="form-input-hint-error"
                            style={`display: ${ this.checkError(this.value) ? 'block' : 'none' }`}
                        >
                            { this.errorMessage }
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
    store: ReturnType<typeof Store.prototype.use>;
    title: string;
    description: string;
    value: boolean;
    inputCallback: BooleanInputCallback;
}

export class BooleanSettingItemComponent extends Component {
    key: string;
    parentStore: ReturnType<typeof Store.prototype.use>;
    title: string;
    description: string;
    value: boolean;
    inputCallback: BooleanInputCallback;
  
    constructor(props: BooleanSettingItemProps) {
        super(props);
        this.key = props.key;
        this.parentStore = props.store;
        this.title = props.title;
        this.description = props.description;
        this.value = props.value;
        this.inputCallback = props.inputCallback;
    }

    override render () { 
        return (
            <Fragment>
                <div class="card-body">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <div class="col-10 col-mr-auto">
                                <div class="form-label">{ this.title }</div>
                                <div class="form-description">{ this.description }</div>
                            </div>
                            <div class="col-1 flex-column-center">
                                <label class="form-switch">
                                    {
                                        this.value
                                            ? <input
                                                type="checkbox"
                                                checked
                                                onchange={() => this.inputCallback(this.key, false)}
                                            />
                                            :
                                            <input
                                                type="checkbox"
                                                onchange={() => this.inputCallback(this.key, true)}
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