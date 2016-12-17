import React, { Component, PropTypes, cloneElement } from 'react';
import { LoginStatus } from './Facebook';
import FacebookProvider from './FacebookProvider';

export default class Login extends Component {
  static propTypes = {
    scope: PropTypes.string.isRequired,
    fields: PropTypes.array.isRequired,
    onResponse: PropTypes.func.isRequired,
    onReady: PropTypes.func,
    onWorking: PropTypes.func,
    children: PropTypes.node.isRequired,
    returnScopes: PropTypes.bool,
    rerequest: PropTypes.bool,
  };

  static contextTypes = {
    ...FacebookProvider.childContextTypes,
  };

  static defaultProps = {
    scope: '',
    fields: ['id', 'email', 'first_name', 'last_name', 'middle_name',
      'name', 'locale', 'gender', 'timezone', 'verified', 'link'],
    returnScopes: false,
    rerequest: false,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {};
  }

  componentDidMount() {
    this.context.facebook.whenReady(this.onReady);
  }

  componentWillUnmount() {
    this.context.facebook.dismiss(this.onReady);
  }

  onReady = (err, facebook) => {
    if (err) {
      this.props.onResponse(err);
      return;
    }

    this.setState({ facebook });

    if (this.props.onReady) {
      this.props.onReady();
    }
  }

  onClick = (evn) => {
    evn.stopPropagation();
    evn.preventDefault();

    const isWorking = this.isWorking();
    if (isWorking) {
      return;
    }

    this.setWorking(true);

    const { scope, fields, onResponse, returnScopes, rerequest } = this.props;
    const facebook = this.state.facebook;
    const loginQpts = { scope };

    if (returnScopes) {
      loginQpts.return_scopes = true;
    }

    if (rerequest) {
      loginQpts.auth_type = 'rerequest';
    }

    facebook.login(loginQpts, (err, loginStatus) => {
      if (err) {
        this.setWorking(false);
        onResponse(err);
        return;
      }

      if (loginStatus !== LoginStatus.AUTHORIZED) {
        this.setWorking(false);
        onResponse(new Error('Unauthorized user'));
        return;
      }

      facebook.getTokenDetailWithProfile({ fields }, (err2, data) => {
        this.setWorking(false);

        if (err2) {
          onResponse(err2);
          return;
        }

        onResponse(null, data);
      });
    });
  };

  setWorking(working) {
    this.setState({ working });

    if (this.props.onWorking) {
      this.props.onWorking(working);
    }
  }

  isWorking() {
    const { working, facebook } = this.state;

    return working || !facebook;
  }

  render() {
    const { children } = this.props;

    return cloneElement(children, { onClick: this.onClick });
  }
}
