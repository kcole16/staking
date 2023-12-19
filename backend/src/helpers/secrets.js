import fs from 'node:fs';

if (!process.env.SECRET_FILE) {
  console.error(`Environment variable SECRET_FILE is not set`);
  process.exit(1);
}
export const secrets = JSON.parse(fs.readFileSync(process.env.SECRET_FILE));
const requiredSecrets = ['zeptomail_token', 'jwt_token'];
requiredSecrets.forEach((variable) => {
  if (!secrets[variable]) {
    console.error(`Secret variable ${variable} is not set`);
    process.exit(1);
  }
});
