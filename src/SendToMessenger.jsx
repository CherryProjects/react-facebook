// @flow
import React, { type Node, PureComponent, forwardRef } from 'react';
import Parser from './Parser';
// import MessengerSize from './constants/MessengerSize';
// import MessengerColor from './constants/MessengerColor';

type Props = {
  messengerAppId: string,
  pageId: string,
  color?: string,
  children?: Node,
  dataRef?: string,
  size?: string,
  handleParse: Function,
  ctaText?: string,
};

class SendToMessenger extends PureComponent<Props> {
  static defaultProps = {
    color: undefined,
    size: undefined,
    dataRef: undefined,
    children: undefined,
    ctaText: 'GET_THIS_IN_MESSENGER',
  };

  componentDidUpdate() {
    const { handleParse } = this.props;
    handleParse();
  }

  render() {
    const {
      color,
      messengerAppId,
      pageId,
      children,
      dataRef,
      size,
      ctaText
    } = this.props;

    return (
      <div
        className="fb-send-to-messenger"
        messenger_app_id={messengerAppId}
        page_id={pageId}
        data-color={color}
        data-size={size}
        data-ref={dataRef}
        cta_text={ctaText}
      >
        {children}
      </div>
    );
  }
}

export default forwardRef((props, ref) => (
  <Parser>
    {({ handleParse }) => (
      <SendToMessenger
        {...props}
        handleParse={handleParse}
        ref={ref}
      />
    )}
  </Parser>
));
