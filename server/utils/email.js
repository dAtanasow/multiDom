const nodemailer = require('nodemailer');

const email = process.env.EMAIL_USER;
const pass = process.env.EMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: email, pass },
});

async function sendOrderConfirmationEmail(toEmail, orderData) {
  const deliveryTotal = Number(orderData.deliveryTotal) || 0;
  const totalAmount = Number(orderData.total) || 0;
  const totalStandard = Number(orderData.totalStandard) || 0;
  const totalDiscount = Number(orderData.totalDiscount) || 0;
  const firstName = (orderData.name || "").split(" ")[0] || "клиент";

  let deliveryBlock = "<p>Няма подаден адрес за доставка.</p>";
  if (orderData.officeDetails?.courierName) {
    deliveryBlock = `
      <p style="margin: 0; font-weight: bold;">📦 Доставка до:</p>
      <p style="margin: 4px 0 0 0;">
        <span style="font-style: italic;">Офис на ${orderData.officeDetails.courierName}</span><br/>
        ${orderData.officeDetails.address}
      </p>`;
  } else if (orderData.address) {
    deliveryBlock = `
      <p style="margin: 0; font-weight: bold;">📦 Доставка до:</p>
      <p style="margin: 4px 0 0 0;">
        <span style="font-style: italic;">Личен адрес</span><br/>
        ${orderData.address}<br/>
        <strong>Куриер:</strong> ${orderData.deliveryCompany || "—"}
      </p>`;
  }

  const itemsList = (orderData.items || []).map((item) => {
    const name = item.name || "Неизвестен продукт";
    const quantity = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    const originalPrice = Number(item.originalPrice) || price;
    const discountPrice = Number(item.discountPrice);
    const imageUrl = Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : null;

    const hasDiscount =
      typeof discountPrice === "number" &&
      item.discountPrice !== null &&
      item.discountPrice < originalPrice;

    const priceHtml = hasDiscount
      ? `<span style="text-decoration: line-through; color: #999;">${item.originalPrice.toFixed(2)} лв.</span>
     <span style="margin-left: 6px; color: #e53e3e;">${item.price.toFixed(2)} лв.</span>`
      : `<span>${item.price.toFixed(2)} лв.</span>`;


    const imageBlock = imageUrl
      ? `<div style="flex-shrink: 0; width: 84px; height: 94px; margin-right: 12px; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
        <img src="${imageUrl}" alt="${name}" width="84" height="94" style="object-fit: cover; width: 100%; height: 100%; display: block;" />
     </div>`
      : "";

    return `
  <li style="display: flex; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;">
    ${imageBlock}
    <div style="flex: 1;">
      <p style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px; color: #2d3748;">${name}</p>
      <p style="margin: 0; font-size: 13px; color: #4a5568;">${priceHtml} × ${quantity} бр.</p>
    </div>
  </li>`;
  }).join('');

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://i.ibb.co/3ym0c2Ty/logo.jpg" alt="logo" border="0" />
    </div>

    <h2 style="color: #2d3748;">Благодарим за поръчката, ${firstName}!</h2>

    <hr style="margin: 16px 0;" />
    <div style="background-color: #f0f4f8; padding: 12px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0 0 8px 0; font-weight: bold;">🧾 Детайли на поръчката:</p>
      <ul style="padding-left: 20px; margin: 0;">${itemsList}</ul>
      <hr style="margin: 12px 0;" />
      <p><strong>Стандартна цена:</strong> ${totalStandard.toFixed(2)} лв.</p>
      <p><strong>Отстъпка:</strong> –${totalDiscount.toFixed(2)} лв.</p>
      <p><strong>Цена на доставка:</strong> ${deliveryTotal.toFixed(2)} лв.</p>
      <p><strong>Обща сума:</strong> <span style="color: #2f855a; font-size: 16px;">${totalAmount.toFixed(2)} лв.</span></p>
    </div>

    <hr style="margin: 16px 0;" />
    <div style="background-color: #f9fafb; padding: 12px; border-radius: 8px; margin: 16px 0;">
      ${deliveryBlock}
    </div>

    <hr style="margin: 16px 0;" />
    <div style="background-color: #f9fafb; padding: 12px; border-radius: 8px; margin: 16px 0;">
      <p style="margin: 0; font-weight: bold;">👤 Данни за получател:</p>
      <p><strong>Име:</strong> ${orderData.name}</p>
      <p><strong>Телефон:</strong> ${orderData.phone}</p>
      <p><strong>Имейл:</strong> ${orderData.email}</p>
      ${orderData.comment ? `<p><strong>Коментар:</strong> ${orderData.comment}</p>` : ""}
    </div>

    ${orderData.invoice?.useInvoice ? `
      <hr style="margin: 16px 0;" />
      <div style="background-color: #f9fafb; padding: 12px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0; font-weight: bold;">🧾 Данни за фактура:</p>
        <p><strong>Фирма:</strong> ${orderData.invoice.companyName}</p>
        <p><strong>Булстат:</strong> ${orderData.invoice.vatNumber}</p>
        ${orderData.invoice.vatNumber ? `<p><strong>ДДС №:</strong> ${orderData.invoice.vatNumber}</p>` : ""}
        <p><strong>МОЛ:</strong> ${orderData.invoice.mol}</p>
      </div>
    ` : ""}

    <p style="margin-top: 20px;">Ще се свържем с вас при нужда от допълнителна информация.</p>
    <div style="text-align: center; margin-top: 24px;">
      <a href="https://multidom-460607.web.app/api/orders/${orderData.orderId}" target="_blank"
         style="display: inline-block; padding: 10px 20px; background-color: #38a169; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Прегледай поръчката
      </a>
    </div>
  </div>
`;


  const mailOptions = {
    from: `"MултиДом" <${email}>`,
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
