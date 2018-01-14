import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from './common';
import axios from 'axios';

class Search extends Component {
  state = { search: '' };

  searchSubmit() {
    const request = 'http://ec2-18-220-0-193.us-east-2.compute.amazonaws.com:3000/search?term=' + this.state.search;
    console.log(request);

    axios.get('request')
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }

  render() {
    return (
      <Card>
        <CardSection>
          <Input
            label="Search"
            value={this.state.search}
            onChangeText={search => this.setState({ search })}
            returnKeyType="search"
            onSubmitEditing={this.searchSubmit = this.searchSubmit.bind(this)}
          />
        </CardSection>
        <CardSection>
          <ScrollView>
            
          </ScrollView>
        </CardSection>
      </Card>
    )
  }
}

export default Search;
