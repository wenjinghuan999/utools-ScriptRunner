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