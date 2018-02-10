// @flow
import React from 'react';
import { Text, View } from 'react-native';

// make component
const Header = (props) => {
  const { textStyle, viewStyle } = styles;
  // destructuring to avoid duplicate references to styles object
  // avoiding saying styles.viewStyle and styles.textStyle

  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{props.headerText}</Text>
    </View>
  ); // textStyle in brackets is prop (property)
};

const styles = {
  viewStyle: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    // position: 'relative'
    flex: 1,
  },
  textStyle: {
    fontSize: 20
  }
};
// make component available to other parts of the app
export { Header };

/* NOTES:
flexbox:
justifyContent is for vertical placement
alignItems is for horizontal placement
*/
