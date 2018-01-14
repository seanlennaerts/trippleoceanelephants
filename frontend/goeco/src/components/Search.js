import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import axios from 'axios';
import Camera from 'react-native-camera';
import { Button, Card, CardSection, Input, Spinner } from './common';
import Product from './Product';

class Search extends Component {
  state = { search: '', products: [], camera: false, qrcode: '' };

  searchSubmit() {
    const request = 'https://warm-retreat-84975.herokuapp.com/search?term=' + this.state.search;
    console.log(request);

    axios.get(request)
      .then(response => this.setState({ products: response.data.results }))
      // .then(response => console.log(response))
      .catch(error => console.log(error));
  }

  buildList() {
    return this.state.products.map((product, index) =>
      <Product key={index} product={product} />
    );
  }

  onBarCodeRead(e) {
    console.log(
        "Barcode Found!",
        "Type: " + e.type + "\nData: " + e.data
    );
  }

  renderContent() {
    switch (this.state.camera) {
      case false:
        return (
          <View>
            <Card>
              <CardSection>
                <Input
                  label="Search"
                  placeholder="Search"
                  value={this.state.search}
                  onChangeText={search => this.setState({ search })}
                  returnKeyType="search"
                  onSubmitEditing={this.searchSubmit = this.searchSubmit.bind(this)}
                />
              </CardSection>
            </Card>
            <ScrollView>
              {this.buildList()}
            </ScrollView>
          </View>
        );
      case true:
        return (
          <View  style={styles.container}>
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
            </View>
        );
    }
  }

  render() {
    return (
      <View>
        {this.renderContent()}
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
}

export default Search;
