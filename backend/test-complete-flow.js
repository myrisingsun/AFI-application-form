const { Client } = require('pg');

const client = new Client({
  host: '185.244.219.128',
  port: 5432,
  user: 'afi_applicationform',
  password: 'run123',
  database: 'afi-application-form'
});

async function testCompleteFlow() {
  try {
    await client.connect();
    console.log('Connected to database\n');

    // Get latest questionnaire
    const result = await client.query(`
      SELECT
        id,
        status,
        "registrationAddress",
        "actualAddress",
        "actualAddressSameAsRegistration",
        education,
        "workExperience",
        consents
      FROM questionnaires
      ORDER BY "createdAt" DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      console.log('No questionnaires found');
      return;
    }

    const q = result.rows[0];
    console.log('Latest Questionnaire Analysis:');
    console.log('='.repeat(50));
    console.log(`Status: ${q.status}`);

    console.log('\n📍 ADDRESS CHECK:');
    console.log(`  Registration: ${q.registrationAddress}`);
    console.log(`  Actual: ${q.actualAddress}`);
    console.log(`  Same as registration: ${q.actualAddressSameAsRegistration}`);

    if (q.actualAddressSameAsRegistration && q.actualAddress === q.registrationAddress) {
      console.log('  ✅ Address validation: PASS (same as registration)');
    } else if (!q.actualAddressSameAsRegistration && q.actualAddress) {
      console.log('  ✅ Address validation: PASS (different address provided)');
    } else {
      console.log('  ❌ Address validation: FAIL');
    }

    console.log('\n🎓 EDUCATION CHECK:');
    if (q.education && q.education.length > 0) {
      q.education.forEach((edu, i) => {
        console.log(`  Education #${i + 1}:`);
        console.log(`    Institution: ${edu.institution}`);
        console.log(`    Degree: ${edu.degree}`);
        console.log(`    Start: ${edu.startDate}`);
        console.log(`    End: ${edu.endDate || 'N/A'}`);
        console.log(`    Current: ${edu.current}`);

        if (edu.current && !edu.endDate) {
          console.log('    ✅ Current education: PASS (no end date)');
        } else if (!edu.current && edu.endDate) {
          console.log('    ✅ Completed education: PASS (has end date)');
        } else if (edu.current && edu.endDate) {
          console.log('    ⚠️  WARNING: Current but has end date');
        }
      });
    } else {
      console.log('  ❌ No education entries');
    }

    console.log('\n💼 WORK EXPERIENCE CHECK:');
    if (q.workExperience && q.workExperience.length > 0) {
      q.workExperience.forEach((work, i) => {
        console.log(`  Work #${i + 1}:`);
        console.log(`    Company: ${work.company}`);
        console.log(`    Position: ${work.position}`);
        console.log(`    Start: ${work.startDate}`);
        console.log(`    End: ${work.endDate || 'N/A'}`);
        console.log(`    Current: ${work.current}`);

        if (work.current && !work.endDate) {
          console.log('    ✅ Current job: PASS (no end date)');
        } else if (!work.current && work.endDate) {
          console.log('    ✅ Past job: PASS (has end date)');
        } else if (work.current && work.endDate) {
          console.log('    ⚠️  WARNING: Current but has end date');
        }
      });
    } else {
      console.log('  ℹ️  No work experience entries');
    }

    console.log('\n✅ CONSENTS CHECK:');
    if (q.consents) {
      console.log(`  PDN Consent: ${q.consents.pdnConsent ? '✅' : '❌'}`);
      console.log(`  Background Check: ${q.consents.backgroundCheckConsent ? '✅' : '❌'}`);
      console.log(`  Photo Consent: ${q.consents.photoConsent ? '✅' : '⏭️  (optional)'}`);
      console.log(`  Medical Check: ${q.consents.medicalCheckConsent ? '✅' : '⏭️  (optional)'}`);

      if (q.consents.pdnConsent && q.consents.backgroundCheckConsent) {
        console.log('  ✅ Required consents: PASS');
      } else {
        console.log('  ❌ Required consents: FAIL');
      }
    } else {
      console.log('  ❌ No consents found');
    }

    console.log('\n' + '='.repeat(50));
    console.log(`Overall Status: ${q.status}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

testCompleteFlow();
