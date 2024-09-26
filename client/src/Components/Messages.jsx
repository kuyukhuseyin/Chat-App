import React, { Component } from 'react';
import axios from 'axios';
import { List, Layout, Typography } from 'antd';

const { Header, Content } = Layout;
const { Text } = Typography;

class Messages extends Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    this.fetchMessages();
  }

  // Fetching messages from the server
  fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/messages');
      this.setState({ messages: response.data.messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  render() {
    const { messages } = this.state;

    return (
      <Layout className="messages-layout">
        <Header className="messages-header">
          <Text style={{ color: 'white', fontSize: '18px' }}>Messages</Text>
        </Header>

        <Content className="messages-content">
          <List
            dataSource={messages}
            renderItem={(message) => (
              <List.Item key={message.text}>
                <List.Item.Meta
                  title={message.sender}
                  description={message.text}
                />
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    );
  }
}

export default Messages;
