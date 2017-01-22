import React, {Component} from 'react';
import VideoViewer from './components/VideoViewer';
import VideoPresenter from './components/VideoPresenter';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: null
    };

    this.onPresentClick = this.onPresentClick.bind(this);
    this.onViewerClick= this.onViewerClick.bind(this);
    this.renderVideo = this.renderVideo.bind(this);
  }

  onPresentClick() {
    this.setState({
      mode: 'presenter'
    });
  }

  onViewerClick() {
    this.setState({
      mode: 'viewer'
    });
  }

  renderVideo() {
    switch (this.state.mode) {
      case 'presenter':
        return <VideoPresenter />;
      case 'viewer':
        return <VideoViewer />;
      default:
        return <div style={{color: '#ffffff'}}>Please, select mode</div>
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <button onClick={this.onPresentClick}>Present</button>
          <button onClick={this.onViewerClick}>View</button>
        </div>
        {this.renderVideo()}
      </div>
    );
  }
}

export default App;
