const orderConfirmationTemplate = (userName, orderId, orderItems) => {
    const itemsHtml = orderItems
      .map(
        (item) => `
        <li>
          ${item.name} - ${item.qty} x ${item.price ? item.price : 10000} = <span>&#8377;</span>${item.qty*item.price}
        </li>`
      )
      .join('');
    return `
      <html>
        <body>
          <h1 style="color:green;">Your Order Has Been Confirmed 💕 </h1>
          <p>Hi ${userName},</p>
          <p>Thank you for your order. Your order ID is <strong>${orderId}</strong>.</p>
          <p>Here are the details of your order:</p>
          <ul style="color:red;">
            ${itemsHtml}
          </ul>
          <p>We will notify you once your items have been shipped.</p>
          <p>Thank you for shopping with us!</p>
        </body>
      </html>
    `;
  };
  
  module.exports = orderConfirmationTemplate;