import React, { Component } from 'react';
import axios from 'axios';
import { List, Input, Button, Layout, Typography, Avatar, Select, Modal } from 'antd';
import { UserOutlined, SendOutlined, PlusOutlined } from '@ant-design/icons';
import AddUser from './AddUser';
import './Chat.css';

const { Header, Footer, Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      inputValue: '',
      users: [],
      currentUser: '',
      recipient: '',
      isModalVisible: false,
    };
  }

  componentDidMount() {
    this.fetchMessages();
    this.fetchUsers();
  }

  // Handles fetching users
  fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      this.setState({ users: response.data.users });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Handles fetching messages
  fetchMessages = async () => {
    const { currentUser, recipient } = this.state;
    if (currentUser && recipient) {
      try {
        const response = await axios.get('http://localhost:5000/messages', {
          params: { sender: currentUser, recipient: recipient },
        });
        this.setState({ messages: response.data.messages });
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  };

  // Handles sending messages
  handleSend = async () => {
    const { inputValue, currentUser, recipient } = this.state;
    if (inputValue.trim() && currentUser && recipient) {
      try {
        await axios.post('http://localhost:5000/messages', {
          text: inputValue,
          senderId: currentUser,
          recipientId: recipient,
        });
        this.setState({ inputValue: '' });
        this.fetchMessages();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Handles input changes
  handleChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  // Handles enter key press
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSend();
    }
  };

  // Handles user change
  handleUserChange = (value) => {
    this.setState({ currentUser: value }, this.fetchMessages);
  };

  // Handles recipient change
  handleRecipientChange = (value) => {
    this.setState({ recipient: value }, this.fetchMessages);
  };

  // Handles modal visibility
  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  // Handles modal closing
  handleModalOk = () => {
    this.setState({ isModalVisible: false });
    this.fetchUsers();
  };

  handleModalCancel = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { messages, inputValue, users, currentUser, recipient, isModalVisible } = this.state;

    return (
      <Layout className="chat-layout">
        <div className="chat-container">
          <Header className="chat-header">
            <Text style={{ color: 'white', fontSize: '18px' }}>Chat App</Text>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={this.showModal}
              style={{ marginLeft: 'auto' }}
            >
              Add User
            </Button>
          </Header>

          <Content className="chat-content">
            <div className="select-container">
              <Select
                placeholder="Select User"
                onChange={this.handleUserChange}
                style={{ width: '48%' }}
              >
                {users.map((user) => (
                  <Option key={user.username} value={user.username}>
                    {user.username}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Select Recipient"
                onChange={this.handleRecipientChange}
                style={{ width: '48%' }}
              >
                {users
                  .filter((user) => user.username !== currentUser)
                  .map((user) => (
                    <Option key={user.username} value={user.username}>
                      {user.username}
                    </Option>
                  ))}
              </Select>
            </div>

            <List
              dataSource={messages}
              renderItem={(message) => (
                <List.Item
                  key={message.text}
                  className={message.senderId === currentUser ? 'chat-item user' : 'chat-item bot'}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={message.senderId === currentUser ? 'Siz' : message.senderId}
                    description={message.text}
                  />
                </List.Item>
              )}
            />
          </Content>

          <Footer className="chat-footer">
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyPress}
              className="chat-message-input"
              disabled={!currentUser || !recipient}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={this.handleSend}
              disabled={!currentUser || !recipient}
            >
              Send
            </Button>
          </Footer>
        </div>
        <Modal
          title="Add New User"
          visible={isModalVisible}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
        >
          <AddUser onUserAdded={this.handleModalOk} />
        </Modal>
      </Layout>
    );
  }
}

export default Chat;
