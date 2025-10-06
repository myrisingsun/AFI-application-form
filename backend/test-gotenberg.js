const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

async function testGotenberg() {
  try {
    const form = new FormData();

    const html = '<html><body><h1>Test PDF</h1><p>This is a test</p></body></html>';

    form.append('files', Buffer.from(html), {
      filename: 'index.html',
      contentType: 'text/html',
    });

    form.append('marginTop', '0.5');
    form.append('marginBottom', '0.5');
    form.append('marginLeft', '0.5');
    form.append('marginRight', '0.5');

    console.log('Sending request to Gotenberg...');
    console.log('Headers:', form.getHeaders());

    const response = await axios.post(
      'http://localhost:3002/forms/chromium/convert/html',
      form,
      {
        headers: form.getHeaders(),
        responseType: 'arraybuffer',
        timeout: 30000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      },
    );

    console.log('Success! PDF generated');
    console.log('Response status:', response.status);
    console.log('Response size:', response.data.length, 'bytes');

    fs.writeFileSync('/tmp/test-node.pdf', Buffer.from(response.data));
    console.log('PDF saved to /tmp/test-node.pdf');

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', Buffer.from(error.response.data).toString());
    }
  }
}

testGotenberg();
