const { Client } = require('pg');

const client = new Client({
  host: '185.244.219.128',
  port: 5432,
  user: 'afi_applicationform',
  password: 'run123',
  database: 'afi-application-form'
});

client.connect()
  .then(() => client.query('SELECT * FROM questionnaires ORDER BY "createdAt" DESC LIMIT 5;'))
  .then(res => {
    console.log(`Found ${res.rows.length} questionnaire(s) in database:\n`);

    res.rows.forEach((q, i) => {
      console.log(`\n========== Questionnaire ${i + 1} ==========`);
      console.log(`ID: ${q.id}`);
      console.log(`Candidate ID: ${q.candidateId}`);
      console.log(`Status: ${q.status}`);
      console.log(`\nPassport Data:`);
      console.log(`  Series: ${q.passportSeries || 'N/A'}`);
      console.log(`  Number: ${q.passportNumber || 'N/A'}`);
      console.log(`  Issuer: ${q.passportIssuer || 'N/A'}`);
      console.log(`  Issue Date: ${q.passportIssueDate || 'N/A'}`);
      console.log(`  Issuer Code: ${q.passportIssuerCode || 'N/A'}`);
      console.log(`\nPersonal Data:`);
      console.log(`  Birth Date: ${q.birthDate || 'N/A'}`);
      console.log(`  Birth Place: ${q.birthPlace || 'N/A'}`);
      console.log(`\nAddress:`);
      console.log(`  Registration: ${q.registrationAddress || 'N/A'}`);
      console.log(`  Actual: ${q.actualAddress || 'N/A'}`);
      console.log(`  Same as Registration: ${q.actualAddressSameAsRegistration}`);
      console.log(`\nEducation:`);
      if (q.education && q.education.length > 0) {
        q.education.forEach((edu, idx) => {
          console.log(`  ${idx + 1}. ${edu.institution || 'N/A'} (${edu.degree || 'N/A'}, ${edu.yearGraduated || 'N/A'})`);
        });
      } else {
        console.log(`  N/A`);
      }
      console.log(`\nWork Experience:`);
      if (q.workExperience && q.workExperience.length > 0) {
        q.workExperience.forEach((work, idx) => {
          console.log(`  ${idx + 1}. ${work.company || 'N/A'} - ${work.position || 'N/A'} (${work.startDate || 'N/A'} - ${work.endDate || 'Present'})`);
        });
      } else {
        console.log(`  N/A`);
      }
      console.log(`\nConsents:`);
      if (q.consents) {
        console.log(`  PDN Consent: ${q.consents.pdnConsent ? 'YES' : 'NO'}`);
        console.log(`  Background Check: ${q.consents.backgroundCheckConsent ? 'YES' : 'NO'}`);
      } else {
        console.log(`  N/A`);
      }
      console.log(`\nTimestamps:`);
      console.log(`  Created: ${q.createdAt}`);
      console.log(`  Updated: ${q.updatedAt}`);
      console.log(`  Submitted: ${q.submittedAt || 'Not submitted yet'}`);
    });

    client.end();
  })
  .catch(err => {
    console.error('Error:', err);
    client.end();
  });
