import React from 'react';
import {
  ActivityIndicator,
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Colors from '../../styles/colors';

import {StackHeaderProps, StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../services';
import {NavBar} from '../navbar/NavBar';
import {NhsButton} from '../NhsButton';
import {NhsCard} from '../NhsCard';
import {Fido} from '../Fido';
import {NhsLogin} from '../NhsLogin';
import {Messaging, ChatInfo} from '../Messaging';
import {ChatButton} from '../ChatButton';

type DashboardScreenNavigationProps = StackScreenProps<
  RootStackParamList,
  'Dashboard'
>;

export type DashboardScreenProps = DashboardScreenNavigationProps & {};
export interface DashboardScreenState {
  chats: ChatInfo[];
  chatError: string;
  loading: boolean;
}

export class DashboardScreen extends React.Component<
  DashboardScreenProps,
  DashboardScreenState
> {
  constructor(props: DashboardScreenProps) {
    super(props);
    this.state = {
      chatError: '',
      chats: [],
      loading: false,
    };
  }

  componentDidMount() {
    if (!NhsLogin.instance.chatEnabled) {
      return;
    }
    this.getChats();
  }

  async getChats() {
    this.setState({
      loading: true,
    });
    const chats = await Messaging.instance.getChats();
    // console.log(chats);
    //@ts-ignore
    if (chats.chats) {
      //@ts-ignore
      // console.log(chats.chats);
      this.setState({
        //@ts-ignore
        chats: chats.chats,
        loading: false,
      });
    } else {
      this.setState({
        //@ts-ignore
        chatError: chats.error,
        loading: false,
      });
    }
  }

  static header(props: StackHeaderProps) {
    const progress = Animated.add(
      props.scene.progress.current,
      props.scene.progress.next || 0,
    );

    const opacity = progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0],
    });

    return (
      <Animated.View style={{opacity}}>
        <StatusBar backgroundColor={Colors.Blue} />
        <NavBar
          backButtonEnabled={true}
          left={() => <Text style={styles.title}>Chats</Text>}
        />
      </Animated.View>
    );
  }

  render() {
    return (
      <View style={styles.mainView}>
        {this.state.loading ? <ActivityIndicator color="#0000FF" /> : <></>}
        {this.state.chatError !== '' ? (
          <NhsCard title="Error Fetching Chats" body={this.state.chatError} />
        ) : (
          <></>
        )}
        {!NhsLogin.instance.chatEnabled ? (
          <NhsCard
            title="Chat Disabled"
            body={
              NhsLogin.instance.chatDisabledMessage !== ''
                ? NhsLogin.instance.chatDisabledMessage
                : 'Chat functionality has been disabled on the app server.'
            }
          />
        ) : (
          <></>
        )}
        {this.state.chats.length > 0 ? (
          this.state.chats.map((chat) => {
            return (
              <ChatButton
                key={chat.gp.id}
                imageSrc={chat.gp.image}
                name={chat.gp.name}
                location={chat.gp.location}
                id={chat.gp.id}
                onPress={(c) => {
                  this.props.navigation.navigate('Chat', {
                    chat: c,
                  });
                }}
              />
            );
          })
        ) : (
          <></>
        )}
        <NhsButton
          text="OpenID Details"
          style="primary"
          onPress={() => {
            this.props.navigation.navigate('OpenidDetails');
          }}
        />
        <NhsButton
          text="Set up fingerprint"
          style="primary"
          onPress={() => {
            new Fido().register(NhsLogin.instance.nhsAccessToken);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.BackgroundColor,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: Colors.White,
    marginLeft: 10,
  },
  mainView: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    marginBottom: 40,
    marginHorizontal: 20,
  },
});
