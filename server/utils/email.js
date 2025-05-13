const nodemailer = require('nodemailer');

const email = process.env.EMAIL_USER;
const pass = process.env.EMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass,
    },
});

async function sendOrderConfirmationEmail(toEmail, orderData) {

    let deliveryBlock = "";

    if (
        orderData.officeDetails &&
        typeof orderData.officeDetails === "object" &&
        orderData.officeDetails.courierName
    ) {
        deliveryBlock = `
        <p style="margin: 0; font-weight: bold;">📦 Доставка до:</p>
        <p style="margin: 4px 0 0 0;">
          <span style="font-style: italic;">Офис на ${orderData.officeDetails.courierName}</span><br/>
          ${orderData.officeDetails.address}<br/>
          <strong>Куриер:</strong> ${orderData.officeDetails.courierName}
        </p>
      `;
    } else if (orderData.address) {
        deliveryBlock = `
        <p style="margin: 0; font-weight: bold;">📦 Доставка до:</p>
        <p style="margin: 4px 0 0 0;">
          <span style="font-style: italic;">Личен адрес</span><br/>
          ${orderData.address}<br/>
          <strong>Куриер:</strong> ${orderData.deliveryCompany || "—"}
        </p>
      `;
    } else {
        deliveryBlock = "<p>Няма подаден адрес за доставка.</p>";
    }

    const itemsList = orderData.items.map(
        (item) => `<li>${item.name} - ${item.quantity} бр. - ${item.price.toFixed(2)} лв.</li>`
    ).join('');

    const htmlContent = `
  <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
    <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://i.ibb.co/3ym0c2Ty/logo.jpg" alt="logo" border="0" />
    </div>

  <h2 style="color: #2d3748;">Благодарим за поръчката, ${orderData.name.split(" ")[0]}!</h2>
  
  <div style="background-color: #f9fafb; padding: 12px; border-radius: 8px; margin: 16px 0;">
  ${deliveryBlock}
    </div>

    <hr style="margin: 16px 0;" />

   <div style="background-color: #f0f4f8; padding: 12px; border-radius: 8px; margin: 16px 0;">
  <p style="margin: 0 0 8px 0; font-weight: bold;">🧾 Детайли на поръчката:</p>
  <ul style="padding-left: 20px; margin: 0;">
    ${itemsList}
  </ul>
  <hr style="margin: 12px 0;" />
  <p style="margin: 4px 0;"><strong>Цена на доставка:</strong> ${orderData.deliveryTotal?.toFixed(2) || "0.00"} лв.</p>
  <p style="margin: 4px 0;"><strong>Обща сума:</strong> <span style="color: #2f855a; font-size: 16px;">${orderData.total.toFixed(2)} лв.</span></p>
    </div>

    <hr style="margin: 16px 0;" />
    
   <div style="background-color: #f9fafb; padding: 12px; border-radius: 8px; margin: 16px 0;">
  <p style="margin: 0; font-weight: bold;">👤 Данни за получател:</p>
  <p style="margin: 4px 0 0 0;"><strong>Име:</strong> ${orderData.name}</p>
  <p style="margin: 2px 0;"><strong>Телефон:</strong> ${orderData.phone}</p>
  <p style="margin: 2px 0;"><strong>Имейл:</strong> ${orderData.email}</p>
  ${orderData.comment ? `<p style="margin: 2px 0;"><strong>Коментар:</strong> ${orderData.comment}</p>` : ""}
    </div>

  
    <p style="margin-top: 20px;">Ще се свържем с вас при нужда от допълнителна информация.</p>
    
</div>`

    const mailOptions = {
        from: `"MултиДом" < ${email}> `,
        to: toEmail,
        subject: 'Потвърждение на поръчка',
        html: htmlContent,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Грешка при изпращане на имейл:", error);
                reject(error);
            } else {
                console.log("Имейл изпратен успешно:", info.response);
                resolve(info);
            }
        });
    });
}

module.exports = { sendOrderConfirmationEmail };
