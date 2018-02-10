import React, { Component } from 'react';
import { View } from 'react-native';
import { Header, Button } from './src/components/common';
import Search from './src/components/Search.js';
import Camera from './src/components/Camera.js';
// import { CameraButton } from './src/components/CameraButton.js';

export default class App extends Component<{}> {
  state = { camera: false };

  renderContent() {
    switch (this.state.camera) {
      case false:
        return (
          <View>
            <Header headerText="goecogecko"/>
            <Search />
          </View>
        );
      case true:
        return (
          <Camera />
        );

    }
  }

  switch() {
    console.log(this.state.camera);
    this.setState({ camera: !this.state.camera });
  }

  render() {
    if (this.state.camera) {
      return (<Camera switch={this.switch.bind(this)} />)
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
          {/* <Header headerText="goecogecko"/> */}
          <Search />
          </View>
          <View style={styles.preview}>
            <Button onPress={this.switch.bind(this)}>Switch</Button>
          </View>
      </View>)
    }
  }
}


const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 4,
    flexDirection: 'column'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',

  }
}
