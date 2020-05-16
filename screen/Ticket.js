import React, { Component } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  FlatList,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ac: "",
      dataSource: [],
      isLoading: true,
      shop: this.props.shopid,
    }
  }
  async componentDidMount() {
    this.focusSubscription = this.props.navigation.addListener('focus', async () => {
      await AsyncStorage.getItem("logined").then((value) => {
        if (value !== null) {
          this.setState({ ac: value });
        } else {
          this.setState({ ac: null });
        }
      });
    });
  }
  componentWillUnmount = () => {
    this.focusSubscription && this.focusSubscription.remove();
    this.focusSubscription = null;
  }
  fetchstore(){
    var {shop}= this.state;
    fetch('http://seantalk.asuscomm.com/mobile/function.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        option: "loadrest",
        para: shop
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson,
          isLoading: false
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  fetchdata() {
    const { ac } = this.state;
    fetch('http://seantalk.asuscomm.com/mobile/function.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        option: "loadticket",
        para: ac
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          dataSource: responseJson,
          isLoading: false
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }
  renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', marginBottom: 3 }}>
        <View style={{ flex: 1, justifyContent: 'center', marginleft: 5 }}>
          <Text style={{ fontSize: 18, color: 'green', marginBottom: 15 }}>
            Ticket ID:{item.TicketID}
          </Text>
          <Text style={{ fontSize: 16, color: 'red' }}>
            Restaurant name:{item.Name}
          </Text>
          <Text style={{ fontSize: 16, color: 'red' }}>
            No. of :{item.NumOfSeat}
          </Text>
          <Text style={{ fontSize: 16, color: 'red' }}>
            Date:{item.Date}
          </Text>
        </View>
      </View>
    )
  }
  renderSeparator = () => {
    return (
      <View style={{ height: 1, width: '100%', backgroundColor: 'black' }}>
      </View>
    )
  }
  render() {
    var ac = this.state.ac;
    var shop = this.state.shop;
    if (ac == null || ac == "") {
      if (shop == null || shop == "") {
        return (
          <View style={styles.container}>
            <Text style={styles.welcome}>Login to use this function!</Text>
            <TouchableOpacity style={styles.loginBtn}
              onPress={() => this.props.navigation.navigate("profile")}>
              <Text style={{ color: "black" }}>
                Login!
            </Text>
            </TouchableOpacity >
          </View>
        )
      } else if (shop != null && shop != "") {
        return (
          <View style={styles.container}>
            <Image style={{width:100,height:100,margin:5}}
            source={{uri:"http://seantalk.asuscomm.com/fyp/img/shop/R/"+shop+".jpg"}}/>
          </View>
        )
      }
      else {
        this.fetchdata();
        return (
          this.state.isLading
            ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#330066" animating />
            </View>
            :
            <View>
              <View style={{ height: 1, width: '100%', backgroundColor: 'black' }}>
              </View>
              <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                keyExtractor={(item) => item.TicketID}
                ItemSeparatorComponent={this.renderSeparator}
              />
            </View>
        )
      }
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  signBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10
  }
});
