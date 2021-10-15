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

type CheckErrorFunc = (value: string) => boolean;
type InputCallback = (event: { target?: { value?: string }}) => void;

interface StringSettingItemProps {
    store: ReturnType<typeof Store.prototype.use>;
    title: string;
    description: string;
    placeholder: string;
    errorMessage: string;
    value: string;
    checkError: CheckErrorFunc;
    inputCallback: InputCallback;
}

export class StringSettingItemComponent extends Component {
    parentStore: ReturnType<typeof Store.prototype.use>;
    title: string;
    description: string;
    placeholder: string;
    errorMessage: string;
    value: string;
    checkError: CheckErrorFunc;
    inputCallback: InputCallback;
  
    constructor(props: StringSettingItemProps) {
        super(props);
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
                                onblur={ (event: any) => { this.inputCallback(event); } }
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