import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as TodoActions from 'actions';

import Header from 'components/Header';
import MainSection from 'components/MainSection';
import Footer from 'components/Footer';
import Snackbar from 'components/Snackbar';

class App extends React.Component {

    constructor(props) {
        super(props);
        this._handleTimeoutSnackbar = this._handleTimeoutSnackbar.bind(this);
        this.state = { isSnackbarActive: false };
    }

    componentDidMount() {
        this.props.actions.getTodos();
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.isSnackbarActive) {
            return;
        }

        if (nextProps.notifications.size) {
            this.setState({
                isSnackbarActive: true
            });
        }
    }

    _handleTimeoutSnackbar() {
        this.setState({ isSnackbarActive: false });
        this.props.actions.deleteNotification();
    }

    render() {
        const { todos, actions, status, notifications } = this.props;
        const { isSnackbarActive } = this.state;

        return (
            <div>
                <Header />
                <MainSection todos={todos} actions={actions} status={status} />
                <Footer />
                <Snackbar active={isSnackbarActive} onTimeout={this._handleTimeoutSnackbar}>
                    {notifications.size ? notifications.first().get('message') : null}
                </Snackbar>
            </div>
        );
    }

}

App.displayName = 'App';

App.propTypes = {
    actions: React.PropTypes.object.isRequired,
    todos: React.PropTypes.object.isRequired,
    status: React.PropTypes.object.isRequired,
    notifications: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        todos: state.todos,
        status: state.status,
        notifications: state.notifications
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TodoActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);