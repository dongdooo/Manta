// Libs
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
const ipc = require('electron').ipcRenderer;

// Actions
import * as UIActions from './actions/ui';
import * as FormActions from './actions/form';
import * as SettingsActions from './actions/settings';
import * as InvoicesActions from './actions/invoices';
import * as ContactsActions from './actions/contacts';

// Components
import AppNav from './components/layout/AppNav';
import AppMain from './components/layout/AppMain';
import AppNoti from './components/layout/AppNoti';
import AppUpdate from './components/layout/AppUpdate';
import {AppWrapper} from './components/shared/Layout';

// Components
class App extends Component {
  constructor(props) {
    super(props);
    this.changeTab = this.changeTab.bind(this);
    this.removeNoti = this.removeNoti.bind(this);
    this.removeUpdateMessage = this.removeUpdateMessage.bind(this);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    // Get All Data
    dispatch(ContactsActions.getAllContacts());
    dispatch(InvoicesActions.getInvoices());
    dispatch(SettingsActions.getInitalSettings());
    // Add Event Listener
    ipc.on('menu-change-tab', (event, tabName) => {
      this.changeTab(tabName);
    });
    ipc.on('menu-form-save', () => {
      dispatch(FormActions.saveFormData());
    });
    ipc.on('menu-form-clear', () => {
      dispatch(FormActions.clearForm());
    });
    ipc.on('menu-form-add-item', () => {
      dispatch(FormActions.addItem());
    });
    ipc.on('menu-form-toggle-dueDate', () => {
      dispatch(FormActions.toggleField('dueDate'));
    });
    ipc.on('menu-form-toggle-currency', () => {
      dispatch(FormActions.toggleField('currency'));
    });
    ipc.on('menu-form-toggle-vat', () => {
      dispatch(FormActions.toggleField('vat'));
    });
    ipc.on('menu-form-toggle-discount', () => {
      dispatch(FormActions.toggleField('discount'));
    });
    ipc.on('menu-form-toggle-note', () => {
      dispatch(FormActions.toggleField('note'));
    });
    ipc.on('menu-form-toggle-settings', () => {
      dispatch(FormActions.toggleFormSettings());
    });
    ipc.on('check-for-updates-message', (event, message, type) => {
      dispatch(UIActions.checkUpdatesMessage(message, type));
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.props !== nextProps;
  }

  componentWillUnmount() {
    ipc.removeAllListeners([
      'menu-change-tab',
      'menu-form-save',
      'menu-form-clear',
      'menu-form-add-item',
      'menu-form-toggle-dueDate',
      'menu-form-toggle-currency',
      'menu-form-toggle-discount',
      'menu-form-toggle-vat',
      'menu-form-toggle-note',
      'menu-form-toggle-settings',
    ]);
  }

  changeTab(tabName) {
    const {dispatch} = this.props;
    dispatch(UIActions.changeActiveTab(tabName));
  }

  removeNoti(id) {
    const {dispatch} = this.props;
    dispatch(UIActions.removeNoti(id));
  }

  removeUpdateMessage() {
    const {dispatch} = this.props;
    dispatch(UIActions.checkUpdatesMessage(null, 'info'));
  }

  render() {
    const {activeTab, notifications, checkUpdatesMessage} = this.props.ui;
    return (
      <AppWrapper>
        <AppNav
          activeTab={activeTab}
          changeTab={this.changeTab} />
        <AppMain activeTab={activeTab} />
        <AppNoti
          notifications={notifications}
          removeNoti={this.removeNoti} />
        <AppUpdate
          message={checkUpdatesMessage}
          removeMessage={this.removeUpdateMessage}/>
      </AppWrapper>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  ui: PropTypes.shape({
    activeTab: PropTypes.string.isRequired,
    notifications: PropTypes.array.isRequired,
    checkUpdatesMessage: PropTypes.object,
  }).isRequired,
};

export default connect(state => ({
  ui: state.ui,
}))(App);
