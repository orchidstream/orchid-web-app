import React, {Component} from 'react';
import 'webrtc-adapter-test';
import KurentoUtils from 'kurento-utils';
import ReconnectingWebsocket from 'reconnecting-websocket';

export default class VideoViewer extends Component {
  constructor(props) {
    super(props);

    this.initKurento = this.initKurento.bind(this);
  }

  initKurento() {
    console.log('init kurento presenter');
    let webRtcPeer;
    let ws = new ReconnectingWebsocket("ws://localhost:3001/relay");

    function sendMessage(message) {
      let jsonMessage = JSON.stringify(message);
      console.log('Senging message: ' + jsonMessage);
      ws.send(jsonMessage);
    }

    function onOfferPresenter(error, offerSdp) {
      // TODO: handle error
      if (error) return onError(error);

      let message = {
        action: 'initPresenter',
        sdpOffer: offerSdp
      };

      sendMessage(message);
    }

    function onIceCandidate(candidate) {
      console.log('Local candidate' + JSON.stringify(candidate));

      let message = {
        action: 'onIceCandidate',
        candidate: candidate
      };

      sendMessage(message);
    }

    function stop() {
      if (webRtcPeer) {
        let message = {
          action: 'stop'
        };
        sendMessage(message);
        dispose();
      }
    }

    function dispose() {
      if (webRtcPeer) {
        webRtcPeer.dispose();
        webRtcPeer = null;
      }
      // TODO: hide spinner
    }

    function presenterResponse(message) {
      if (message.response !== 'accepted') {
        let errorMsg = message.message ? message.message : 'Unknow error';
        console.warn('Call not accepted for the following reason: ' + JSON.stringify(errorMsg));
        dispose();
      } else {
        webRtcPeer.processAnswer(message.sdpAnswer);
      }
    }

    ws.onopen = () => {
      console.log('ws opened');
      let options = {
        localVideo: document.getElementById("video-presenter"),
        onicecandidate: onIceCandidate
      };
      console.log('cls:', KurentoUtils);

      webRtcPeer = KurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function (error) {
        if (error) return onError(error);

        this.generateOffer(onOfferPresenter);
      });
    };

    ws.onerror = (err) => {
      console.log('ws error', err)
    };

    ws.onmessage = (rawMessage) => {
      console.log('ws opened');

      let msg = JSON.parse(rawMessage.data);
      console.info('Received message: ' + rawMessage.data);

      switch (msg.action) {
        case 'presenterResponse':
          presenterResponse(msg);
          break;
        case 'stopCommunication':
          dispose();
          break;
        case 'iceCandidate':
          webRtcPeer.addIceCandidate(msg.candidate);
          break;
        default:
          console.error('Unrecognized message', msg);
      }
    };
  }

  componentDidMount() {
    console.log('did mount presenter');
    this.initKurento();
  }

  render() {
    return (
      <video id="video-presenter" src="" autoPlay width="640px" height="480px" className="VideoViewer-video"/>
    );
  }
}
