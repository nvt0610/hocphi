const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'admin',
  database: 'hocphi_db',
});
client.connect()
  .then(() => {
    console.log('CONNECTED SUCCESSFULLY');
    process.exit(0);
  })
  .catch(err => {
    console.error('CONNECTION ERROR', err);
    process.exit(1);
  });
