const nodemailer = require('nodemailer');

const email = process.env.EMAIL_USER;
const pass = process.env.EMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: email, pass },
});

async function sendRegistrationConfirmationEmail(toEmail, firstName, confirmUrl) {
    const htmlContent = `
  <div style="font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 15px; color: #2d3748; background-color: #f7fafc; padding: 24px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
      <div style="background: #1a202c; padding: 20px; text-align: center;">
        <img src="https://i.ibb.co/3ym0c2Ty/logo.jpg" alt="МултиДом" style="height: 60px;" />
      </div>

      <div style="padding: 30px; text-align: center;">
        <h2 style="margin-top: 0; font-size: 22px; color: #2f855a;">Добре дошъл, ${firstName || "потребител"}! 🎉</h2>
        <p style="color: #4a5568; font-size: 15px; margin-bottom: 24px;">
          Благодарим ти, че се регистрира в <strong>МултиДом</strong>.<br />
          За да потвърдиш имейл адреса си, кликни на бутона по-долу:
        </p>

        <a href="${confirmUrl}" target="_blank"
          style="background-color: #38a169; color: #fff; padding: 12px 24px; border-radius: 6px; font-weight: 600; text-decoration: none; display: inline-block;">
          ✅ Потвърди имейла си
        </a>

        <p style="margin-top: 16px; font-size: 13px; color: #e53e3e;">
        ⏳ Линкът е валиден 15 минути от момента на изпращане.
        </p>

        <p style="margin-top: 30px; font-size: 13px; color: #718096;">
          Ако не си се регистрирал ти, можеш да игнорираш този имейл.
        </p>
      </div>

      <div style="background: #edf2f7; padding: 16px; text-align: center; font-size: 12px; color: #718096;">
        © ${new Date().getFullYear()} МултиДом. Всички права запазени.
      </div>
    </div>
  </div>
`;

    const mailOptions = {
        from: `"MултиДом" <${email}>`,
        to: toEmail,
        subject: 'Потвърждение на регистрация',
        html: htmlContent,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Грешка при изпращане на имейл за регистрация:", error);
                reject(error);
            } else {
                console.log("Имейл за регистрация изпратен успешно:", info.response);
                resolve(info);
            }
        });
    });
}

module.exports = { sendRegistrationConfirmationEmail }