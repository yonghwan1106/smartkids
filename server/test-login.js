const fetch = require('node-fetch');

async function testLogin() {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'sanoramyun8@gmail.com',
        password: '22qjsrlf67!'
      })
    });

    const data = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', data);
    
    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log('✅ Login successful!');
      console.log('Token:', jsonData.token);
      console.log('User:', jsonData.user);
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();