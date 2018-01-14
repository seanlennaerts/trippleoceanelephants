import React, { Component } from 'react';
import { View } from 'react-native';
import { Header } from './src/components/common';
import Search from './src/components/Search.js';

export default class App extends Component<{}> {
  render() {
    return (
      <View>
        <Header headerText="goecogecko"/>
        <Search />
        
      </View>
    );
  }
}
