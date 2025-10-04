const { Client } = require('pg');

const client = new Client({
  host: '185.244.219.128',
  port: 5432,
  user: 'afi_applicationform',
  password: 'run123',
  database: 'afi-application-form'
});

client.connect()
  .then(() => client.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'questionnaires' ORDER BY ordinal_position;"))
  .then(res => {
    console.log('Questionnaires table structure:');
    res.rows.forEach(r => {
      console.log(`  ${r.column_name}: ${r.data_type} (nullable: ${r.is_nullable})`);
    });
    client.end();
  })
  .catch(err => {
    console.error(err);
    client.end();
  });
