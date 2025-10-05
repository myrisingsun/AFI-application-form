const { Client } = require('pg');

const client = new Client({
  host: '185.244.219.128',
  port: 5432,
  user: 'afi_applicationform',
  password: 'run123',
  database: 'afi-application-form'
});

client.connect()
  .then(() => client.query('SELECT "registrationAddress", "actualAddress", "actualAddressSameAsRegistration" FROM questionnaires ORDER BY "createdAt" DESC LIMIT 3;'))
  .then(res => {
    console.log('Address fields in last 3 questionnaires:');
    res.rows.forEach((q, i) => {
      console.log(`\n#${i+1}:`);
      console.log(`  Registration: ${q.registrationAddress}`);
      console.log(`  Actual: ${q.actualAddress}`);
      console.log(`  Same as registration: ${q.actualAddressSameAsRegistration}`);
    });
    client.end();
  })
  .catch(err => {
    console.error(err);
    client.end();
  });
