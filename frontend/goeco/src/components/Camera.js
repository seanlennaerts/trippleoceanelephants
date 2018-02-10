import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';
import { Button } from './common/index';

import Camera from 'react-native-camera';

export default class BarcodeScan extends Component {

    constructor(props) {
        super(props);
        this.state = {
            qrcode: ''
        }
    }

    onBarCodeRead = (e) => { this.setState({qrcode: e.data})

  };

    render () {
        return (
            <View style={styles.container}>
                <Camera
                    style={styles.preview}
                    onBarCodeRead={this.onBarCodeRead}
                    ref={cam => this.camera = cam}
                    aspect={Camera.constants.Aspect.fill}
                    >
                        <Text style={{
                            backgroundColor: 'white'
                        }}>{this.state.qrcode}</Text>

                    </Camera>
                    <Button onPress={this.props.switch}>
                      Switch
                    </Button>

            </View>
        )
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  preview: {
    flex: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',

  }
});
