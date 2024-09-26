import React, { Component } from 'react';
import { Input, Button, Form, Typography, message } from 'antd';
import axios from 'axios';

const { Title } = Typography;

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
    };
  }

  // Handles input change
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // Handles adding a new user
  handleAddUser = async () => {
    const { username, email } = this.state;
    if (username && email) {
      try {
        await axios.post('http://localhost:5000/users', { username, email });
        message.success('Kullanıcı başarıyla eklendi!');
        this.setState({ username: '', email: '' });
        if (this.props.onUserAdded) {
          this.props.onUserAdded();
        }
      } catch (error) {
        message.error('Kullanıcı eklenirken bir hata oluştu.');
        console.error('Error adding user:', error);
      }
    } else {
      message.error('Lütfen tüm alanları doldurun!');
    }
  };

  render() {
    const { username, email } = this.state;

    return (
      <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '16px' }}>
        <Title level={4}>Add New User</Title>
        <Form layout="vertical">
          <Form.Item label="Kullanıcı Adı">
            <Input
              name="username"
              value={username}
              onChange={this.handleInputChange}
              placeholder="Enter username"
            />
          </Form.Item>
          <Form.Item label="e-mail">
            <Input
              name="email"
              value={email}
              onChange={this.handleInputChange}
              placeholder="Enter e-mail"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.handleAddUser}>
              Add User
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default AddUser;
