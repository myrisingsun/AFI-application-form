const { Client } = require('pg');

const client = new Client({
  host: '185.244.219.128',
  port: 5432,
  user: 'afi_applicationform',
  password: 'run123',
  database: 'afi-application-form'
});

client.connect()
  .then(() => client.query('SELECT education, "workExperience" FROM questionnaires ORDER BY "createdAt" DESC LIMIT 1;'))
  .then(res => {
    if (res.rows.length === 0) {
      console.log('No questionnaires found');
    } else {
      const q = res.rows[0];
      console.log('Latest questionnaire:');
      console.log('\nEducation:');
      console.log(JSON.stringify(q.education, null, 2));
      console.log('\nWork Experience:');
      console.log(JSON.stringify(q.workExperience, null, 2));
    }
    client.end();
  })
  .catch(err => {
    console.error(err);
    client.end();
  });
