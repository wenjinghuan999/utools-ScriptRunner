import Nano, { Component, Fragment } from 'nano-jsx';
import { Store } from 'nano-jsx/lib/store';

interface SavedHintProps {
    store: Store;
}

export class SavedHintComponent extends Component {
    store: ReturnType<typeof Store.prototype.use>;
  
    constructor(props: SavedHintProps) {
        super(props);
        this.store = props.store.use();
    }

    override didMount() {
        this.store.subscribe((newState: any, prevState: any) => {
            if (newState.saved !== prevState.saved) {
                this.update();
            }
        })
    }
  
    override didUnmount() {
        this.store.cancel();
    }

    override render () { 
        return (
            <Fragment>
                <div
                    class="form-input-hint"
                    style={`display: ${ this.store.state.saved ? 'block' : 'none' }`}
                >
                    设置已保存。
                </div>
            </Fragment>
        );
    }
}

interface TitleProps {
    title: string;
    store: Store;
}

export class TitleComponent extends Component {
    title: string;
    store: ReturnType<typeof Store.prototype.use>;
  
    constructor(props: TitleProps) {
        super(props);
        this.title = props.title;
        this.store = props.store.use();
    }

    override didMount() {
        this.store.subscribe((newState: any, prevState: any) => {
            if (newState.dirty !== prevState.dirty) {
                this.update();
            }
        })
    }
  
    override didUnmount() {
        this.store.cancel();
    }

    override render () { 
        return (
            <Fragment>
                <span
                    class={'title' + (this.store.state.dirty ? ' badge badge-unready' : '')}
                    data-badge="已修改"
                >
                    { this.title }
                </span>
            </Fragment>
        );
    }
}