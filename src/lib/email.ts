import nodemailer from 'nodemailer';
import path from 'path';
import { Order } from '@/types';

// Create Nodemailer Transporter
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS environment variables are required');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

const LOGO_URL = 'https://res.cloudinary.com/dnd8u5sll/image/upload/v1787209605/saga-fabrics-logo-new_skmnli.png';

const BRAND_NAME = 'SAGA FABRICS';
const FROM_EMAIL = `"Saga Fabrics" <${process.env.SMTP_USER || 'saga.fabricss@gmail.com'}>`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'saga.fabricss@gmail.com';

// Common Email Header HTML with Cloudinary Logo
function getEmailHeaderHTML(title: string, subtitle: string): string {
  return `
    <div style="background-color: #2D2A26; padding: 32px 20px; text-align: center; border-top-left-radius: 16px; border-top-right-radius: 16px;">
      <div style="background-color: #FAF6F0; display: inline-block; padding: 12px 24px; border-radius: 14px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
        <img src="${LOGO_URL}" alt="Saga Fabrics" style="max-height: 70px; height: 70px; width: auto; display: block; margin: 0 auto;" />
      </div>
      <h1 style="color: #F7C687; font-family: 'Georgia', serif; font-size: 23px; font-weight: 700; margin: 0; letter-spacing: 0.5px;">
        ${title}
      </h1>
      <p style="color: #E7E5E4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; margin: 6px 0 0 0; opacity: 0.9;">
        ${subtitle}
      </p>
    </div>
  `;
}

// Common Email Footer HTML
function getEmailFooterHTML(): string {
  return `
    <div style="background-color: #FAF6F0; padding: 24px 20px; text-align: center; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; border-top: 1px solid #EDE7E1;">
      <p style="color: #9E6962; font-family: 'Georgia', serif; font-weight: bold; font-size: 15px; margin: 0 0 6px 0;">
        SAGA FABRICS
      </p>
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #EDE7E1;">
        <p style="color: #A8A29E; font-size: 11px; margin: 0;">
          Need help with your order? Contact us at <a href="mailto:${ADMIN_EMAIL}" style="color: #9E6962; text-decoration: underline;">${ADMIN_EMAIL}</a> or WhatsApp support.
        </p>
      </div>
    </div>
  `;
}

/**
 * 1. Send Order Confirmation Email to Customer
 */
export async function sendCustomerOrderConfirmationEmail(order: Order): Promise<boolean> {
  const transporter = createTransporter();
  const customerEmail = order.customer.email;

  if (!customerEmail || !customerEmail.includes('@')) {
    console.log(`[Email Service] Customer order ${order.id} has no valid email provided (${customerEmail}). Skipping customer email.`);
    return false;
  }

  const itemsListHTML = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 14px 10px; border-bottom: 1px solid #EDE7E1;">
          <strong style="color: #2D2A26; font-size: 14px; display: block; font-family: 'Georgia', serif;">${item.productTitle}</strong>
          <span style="color: #78716C; font-size: 12px; display: inline-block; margin-top: 4px;">
            Spec: <strong style="color: #9E6962;">Free Size (100% Unstitched Fabric Set)</strong> | Qty: ${item.quantity}
          </span>
        </td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #EDE7E1; text-align: right; font-weight: bold; color: #2D2A26; font-size: 14px;">
          ₹${(item.price * item.quantity).toLocaleString('en-IN')}
        </td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - ${order.id}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F5F2EC; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F5F2EC; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td>
                  ${getEmailHeaderHTML('Order Confirmed!', `Thank you for your purchase, ${order.customer.name}`)}
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 28px 24px;">
                  
                  <!-- Order Number Box -->
                  <div style="background-color: #FAF6F0; border: 1px solid #EDE7E1; border-left: 4px solid #9E6962; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <span style="color: #78716C; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Order Identifier</span>
                          <h2 style="margin: 2px 0 0 0; color: #9E6962; font-family: monospace; font-size: 18px;">${order.id}</h2>
                        </td>
                        <td align="right">
                          <span style="display: inline-block; background-color: #E6F4EA; color: #137333; font-size: 12px; font-weight: bold; padding: 6px 12px; rounded-radius: 20px; border-radius: 20px;">
                            Payment Verified
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- Greeting -->
                  <p style="color: #44403C; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                    Dear <strong>${order.customer.name}</strong>,<br/>
                    We have successfully received your payment and our team is carefully packing your order for dispatch.
                  </p>

                  <!-- Order Items Table -->
                  <h3 style="color: #2D2A26; font-family: 'Georgia', serif; font-size: 16px; margin: 24px 0 12px 0; border-bottom: 2px solid #F5F2EC; padding-bottom: 8px;">
                    Items Summary
                  </h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                    <thead>
                      <tr style="background-color: #FAF6F0;">
                        <th align="left" style="padding: 10px; color: #78716C; font-size: 12px; text-transform: uppercase; font-weight: bold;">Product Spec</th>
                        <th align="right" style="padding: 10px; color: #78716C; font-size: 12px; text-transform: uppercase; font-weight: bold;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsListHTML}
                    </tbody>
                  </table>

                  <!-- Price Total Box -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF6F0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
                    <tr>
                      <td style="color: #78716C; font-size: 13px;">Subtotal Amount:</td>
                      <td align="right" style="color: #2D2A26; font-weight: bold; font-size: 14px;">₹${order.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="color: #78716C; font-size: 13px; padding-top: 6px;">Express Courier Shipping:</td>
                      <td align="right" style="color: #137333; font-weight: bold; font-size: 13px; padding-top: 6px;">FREE (Complimentary)</td>
                    </tr>
                    <tr>
                      <td style="padding-top: 12px; border-top: 1px solid #EDE7E1; color: #2D2A26; font-size: 15px; font-weight: bold;">Total Amount Paid:</td>
                      <td align="right" style="padding-top: 12px; border-top: 1px solid #EDE7E1; color: #9E6962; font-size: 18px; font-weight: bold; font-family: 'Georgia', serif;">₹${order.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  </table>

                  <!-- Shipping & Delivery Address -->
                  <h3 style="color: #2D2A26; font-family: 'Georgia', serif; font-size: 16px; margin: 24px 0 12px 0; border-bottom: 2px solid #F5F2EC; padding-bottom: 8px;">
                    Shipping Address
                  </h3>
                  <div style="background-color: #FFFFFF; border: 1px solid #EDE7E1; border-radius: 10px; padding: 16px; color: #44403C; font-size: 13px; line-height: 1.6;">
                    <strong style="color: #2D2A26; font-size: 14px;">${order.customer.name}</strong><br/>
                    Phone: <strong>${order.customer.phone}</strong><br/>
                    Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - <strong>${order.customer.pincode}</strong><br/>
                    ${order.customer.notes ? `<div style="margin-top: 8px; font-style: italic; color: #78716C;">Customer Note: ${order.customer.notes}</div>` : ''}
                  </div>

                  <!-- Payment Reference -->
                  <p style="color: #78716C; font-size: 11px; margin-top: 20px; font-family: monospace;">
                    Razorpay Payment Ref: ${order.razorpayPaymentId || 'pay_simulated'} | Order ID: ${order.razorpayOrderId || 'order_simulated'}
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td>
                  ${getEmailFooterHTML()}
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `✨ Order Confirmed: ${order.id} | SAGA FABRICS`,
      html: htmlContent,
    });
    console.log(`[Email Service] Customer confirmation email sent for ${order.id}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Email Service] Failed to send customer order email for ${order.id}:`, error);
    return false;
  }
}

/**
 * 2. Send Admin New Order Notification Email
 */
export async function sendAdminOrderNotificationEmail(order: Order): Promise<boolean> {
  const transporter = createTransporter();

  const itemsListHTML = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #EDE7E1; font-size: 13px;">
          <strong>${item.productTitle}</strong><br/>
          Spec: <span style="color: #9E6962; font-weight: bold;">Free Size (100% Unstitched Fabric Set)</span> | Qty: ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #EDE7E1; text-align: right; font-weight: bold; font-size: 13px;">
          ₹${(item.price * item.quantity).toLocaleString('en-IN')}
        </td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Alert - ${order.id}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F5F2EC; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F5F2EC; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td>
                  ${getEmailHeaderHTML('🛍️ NEW ORDER RECEIVED!', `Order ID: ${order.id} • Total: ₹${order.totalAmount.toLocaleString('en-IN')}`)}
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 24px;">
                  
                  <div style="background-color: #FFFBEB; border: 1px solid #FCD34D; border-radius: 10px; padding: 14px; margin-bottom: 20px; text-align: center;">
                    <strong style="color: #B45309; font-size: 14px;">Action Required: Pack & Dispatch</strong>
                  </div>

                  <!-- Customer Info -->
                  <h3 style="color: #2D2A26; font-size: 15px; margin: 0 0 10px 0; border-bottom: 2px solid #F5F2EC; padding-bottom: 6px;">
                    Customer Details
                  </h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
                    <tr>
                      <td style="color: #78716C; width: 120px;">Customer Name:</td>
                      <td style="color: #2D2A26; font-weight: bold;">${order.customer.name}</td>
                    </tr>
                    <tr>
                      <td style="color: #78716C;">Phone Number:</td>
                      <td style="color: #2D2A26; font-weight: bold;"><a href="tel:${order.customer.phone}" style="color: #9E6962; text-decoration: none;">${order.customer.phone}</a></td>
                    </tr>
                    <tr>
                      <td style="color: #78716C;">Email Address:</td>
                      <td style="color: #2D2A26;">${order.customer.email || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="color: #78716C;">Shipping Address:</td>
                      <td style="color: #2D2A26;">${order.customer.address}, ${order.customer.city}, ${order.customer.state} - <strong>${order.customer.pincode}</strong></td>
                    </tr>
                    ${order.customer.notes ? `<tr><td style="color: #78716C;">Customer Note:</td><td style="color: #B45309; font-weight: bold;">${order.customer.notes}</td></tr>` : ''}
                  </table>

                  <!-- Ordered Items -->
                  <h3 style="color: #2D2A26; font-size: 15px; margin: 0 0 10px 0; border-bottom: 2px solid #F5F2EC; padding-bottom: 6px;">
                    Items Purchased
                  </h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                    ${itemsListHTML}
                  </table>

                  <!-- Total Amount -->
                  <div style="background-color: #FAF6F0; padding: 14px; border-radius: 10px; text-align: right;">
                    <span style="font-size: 13px; color: #78716C;">Total Revenue Paid: </span>
                    <strong style="font-size: 18px; color: #9E6962; font-family: 'Georgia', serif;">₹${order.totalAmount.toLocaleString('en-IN')}</strong>
                  </div>

                  <!-- Payment Info -->
                  <p style="color: #78716C; font-size: 11px; margin-top: 16px;">
                    Razorpay Payment ID: <strong>${order.razorpayPaymentId || 'pay_simulated'}</strong><br/>
                    Razorpay Order ID: <strong>${order.razorpayOrderId || 'order_simulated'}</strong>
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td>
                  ${getEmailFooterHTML()}
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🚨 [NEW ORDER] ${order.id} - ₹${order.totalAmount} from ${order.customer.name}`,
      html: htmlContent,
    });
    console.log(`[Email Service] Admin notification email sent for order ${order.id}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Email Service] Failed to send admin order notification for ${order.id}:`, error);
    return false;
  }
}

/**
 * 3. Send Order Status Update Email to Customer
 */
export async function sendOrderStatusUpdateEmail(order: Order): Promise<boolean> {
  const transporter = createTransporter();
  const customerEmail = order.customer.email;

  if (!customerEmail || !customerEmail.includes('@')) {
    console.log(`[Email Service] Cannot send status update for order ${order.id} - invalid customer email (${customerEmail}).`);
    return false;
  }

  let statusBadgeColor = '#9E6962';
  let statusBadgeBg = '#FDFBF7';
  let statusDescription = 'Your order status has been updated.';

  switch (order.status) {
    case 'Dispatched':
      statusBadgeColor = '#1D4ED8';
      statusBadgeBg = '#EFF6FF';
      statusDescription = 'Great news! Your order has been carefully packaged and handed over to our express courier partner. It is currently on its way to your shipping address.';
      break;
    case 'Delivered':
      statusBadgeColor = '#047857';
      statusBadgeBg = '#ECFDF5';
      statusDescription = 'Your package has been successfully delivered! Thank you for shopping with Saga Fabrics.';
      break;
    case 'Processing':
      statusBadgeColor = '#B45309';
      statusBadgeBg = '#FFFBEB';
      statusDescription = 'Our team is preparing and inspecting your items for dispatch.';
      break;
    case 'Cancelled':
      statusBadgeColor = '#B91C1C';
      statusBadgeBg = '#FEF2F2';
      statusDescription = 'Your order has been cancelled as requested. If you have any questions or refund inquiries, please contact our support team.';
      break;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Status Update - ${order.id}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F5F2EC; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F5F2EC; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td>
                  ${getEmailHeaderHTML(`Order Update: ${order.status}`, `Order ID: ${order.id}`)}
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 28px 24px;">
                  
                  <!-- Status Card -->
                  <div style="background-color: ${statusBadgeBg}; border: 1px solid ${statusBadgeColor}; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; color: ${statusBadgeColor}; display: block; margin-bottom: 4px;">
                      Current Shipment Status
                    </span>
                    <h2 style="margin: 0; color: ${statusBadgeColor}; font-family: 'Georgia', serif; font-size: 24px; font-weight: bold;">
                      ${order.status}
                    </h2>
                    <p style="color: #44403C; font-size: 13px; line-height: 1.5; margin: 12px 0 0 0;">
                      ${statusDescription}
                    </p>
                  </div>

                  <p style="color: #44403C; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                    Dear <strong>${order.customer.name}</strong>,<br/>
                    Here are your order details for reference:
                  </p>

                  <!-- Order Summary Box -->
                  <div style="background-color: #FAF6F0; border-radius: 10px; padding: 16px; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
                    <strong style="color: #9E6962; font-family: monospace;">Order ID: ${order.id}</strong><br/>
                    Item: <strong>${order.items[0]?.productTitle || 'Saga Fabrics Couture'}</strong> (${order.items[0]?.size || 'Unstitched'})<br/>
                    Total Amount: <strong>₹${order.totalAmount.toLocaleString('en-IN')}</strong><br/>
                    Delivery Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td>
                  ${getEmailFooterHTML()}
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `📦 Order ${order.id} is now ${order.status.toUpperCase()} | SAGA FABRICS`,
      html: htmlContent,
    });
    console.log(`[Email Service] Status update email sent for order ${order.id} (${order.status}): ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Email Service] Failed to send status update email for ${order.id}:`, error);
    return false;
  }
}

