import React from 'react';
import { Text, View, Image, Linking } from 'react-native';
import { Card, CardSection, Button } from './common/index';

const Product = ({ product }) => {
  const { vendor, name, image, url, price } = product;
  const {
    thumbnailStyle,
    headerContentStyle,
    thumbnailContainerStyle,
    headerTextStyle,
    imageStyle
  } = styles;
  console.log(product);
  return (
    // <TouchableOpacity onPress={onPress} style={buttonStyle}>
    //   <Text style={textStyle}>
    //     {children}
    //   </Text>
    // </TouchableOpacity>
    // <Card>
    //   <CardSection>
    //     <Text>{product.name}</Text>
    //   </CardSection>
    //   <CardSection>
    //
    //   </CardSection>
    // </Card>
    <Card>
      <CardSection>
        <View style={thumbnailContainerStyle}>
          <Image
            style={thumbnailStyle}
            source={{ uri: 'https://sem3-idn.s3-website-us-east-1.amazonaws.com/147888bc7ff597bbd1073b2e94627f95,0.jpg' }}
          />
        </View>
        <View style={headerContentStyle}>
          <Text style={headerTextStyle}>{name}</Text>
          <Text>${price}</Text>
          {/* <Text>{vendor}</Text> */}
        </View>

      </CardSection>

      <CardSection>
        <Button onPress={() => Linking.openURL(url)}>
          Buy from {vendor}
        </Button>
      </CardSection>
    </Card>
  );
};

const styles = {
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  headerTextStyle: {
    fontSize: 18
  },
  thumbnailStyle: {
    height: 50,
    width: 50
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  imageStyle: {
    height: 300,
    flex: 1,
    width: null
  }
};

export default Product;
