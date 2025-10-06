const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

async function testGotenbergWithFile() {
  try {
    const html = '<html><body><h1>Test PDF from File</h1><p>This is a test</p></body></html>';
    fs.writeFileSync('index.html', html);

    const form = new FormData();
    form.append('files', fs.createReadStream('index.html'));
    form.append('marginTop', '0.5');
    form.append('marginBottom', '0.5');
    form.append('marginLeft', '0.5');
    form.append('marginRight', '0.5');

    console.log('Sending request to Gotenberg with file...');

    const response = await axios.post(
      'http://localhost:3001/forms/chromium/convert/html',
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

    fs.writeFileSync('/tmp/test-node-file.pdf', Buffer.from(response.data));
    console.log('PDF saved to /tmp/test-node-file.pdf');

    fs.unlinkSync('index.html');

  } catch (error) {
    console.error('Error:', error.message);
    console.error('Error code:', error.code);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', Buffer.from(error.response.data).toString());
    }
    try {
      fs.unlinkSync('index.html');
    } catch (e) {}
  }
}

testGotenbergWithFile();
