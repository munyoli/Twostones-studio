const nodemailer = require('nodemailer');

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send order confirmation email
const sendOrderConfirmation = async (order, orderItems, customerEmail) => {
    const itemsList = orderItems.map(item =>
        `<tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.product.name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">KES ${Number(item.price_at_purchase).toLocaleString()}</td>
        </tr>`
    ).join('');

    const mailOptions = {
        from: `"Twostones Luxury" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `Order Receipt - Twostones #${order.id}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Georgia', serif; color: #292524; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #292524; color: white; padding: 30px; text-align: center; }
                    .content { background: #fafaf9; padding: 30px; }
                    .footer { background: #292524; color: #a8a29e; padding: 20px; text-align: center; font-size: 12px; }
                    .payment-box { background: white; border-left: 4px solid #b8860b; padding: 20px; margin: 20px 0; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">TWOSTONES</h1>
                        <p style="margin: 10px 0 0 0; font-size: 12px; letter-spacing: 4px; text-transform: uppercase;">Crafted for Wholeness</p>
                    </div>
                    
                    <div class="content">
                        <h2 style="color: #292524; margin-top: 0;">Order Received</h2>
                        <p>Thank you for choosing Twostones. Your order has been received and is awaiting payment confirmation.</p>
                        
                        <p><strong>Order Number:</strong> #${order.id}<br>
                        <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br>
                        <strong>Total Amount:</strong> KES ${Number(order.total_amount).toLocaleString()}</p>
                        
                        <h3 style="margin-top: 30px;">Order Details</h3>
                        <table style="background: white;">
                            <thead>
                                <tr style="background: #f5f5f4;">
                                    <th style="padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                                    <th style="padding: 12px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                                    <th style="padding: 12px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsList}
                                <tr>
                                    <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total:</td>
                                    <td style="padding: 12px; text-align: right; font-weight: bold; font-size: 18px;">KES ${Number(order.total_amount).toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div class="payment-box">
                            <h3 style="margin-top: 0; color: #16a34a;">✓ Payment Received</h3>
                            <p style="font-size: 13px; color: #78716c; margin-top: 15px;">
                                Thank you for your payment. Your order is now confirmed and will be processed within 2-3 business days. We will send you a shipping confirmation once your order is dispatched.
                            </p>
                        </div>
                        
                        <p style="margin-top: 30px;"><strong>Shipping Address:</strong><br>${order.shipping_address}</p>
                    </div>
                    
                    <div class="footer">
                        <p style="margin: 0;">Twostones Luxury Heritage</p>
                        <p style="margin: 5px 0;">Nairobi, Kenya</p>
                        <p style="margin: 5px 0;">manukato.twostones@gmail.com</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Order confirmation email sent to ${customerEmail}`);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        // Don't throw error - order should still be created even if email fails
    }
};

// Send payment confirmation email
const sendPaymentConfirmation = async (order, orderItems, customerEmail) => {
    const itemsList = orderItems.map(item =>
        `<li>${item.product.name} (x${item.quantity})</li>`
    ).join('');

    const mailOptions = {
        from: `"Twostones Luxury" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `Payment Confirmed - Twostones #${order.id}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Georgia', serif; color: #292524; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #b8860b; color: white; padding: 30px; text-align: center; }
                    .content { background: #fafaf9; padding: 30px; }
                    .footer { background: #292524; color: #a8a29e; padding: 20px; text-align: center; font-size: 12px; }
                    .success-box { background: #dcfce7; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">TWOSTONES</h1>
                        <p style="margin: 10px 0 0 0; font-size: 12px; letter-spacing: 4px; text-transform: uppercase;">Crafted for Wholeness</p>
                    </div>
                    
                    <div class="content">
                        <div class="success-box">
                            <h2 style="color: #16a34a; margin-top: 0;">✓ Payment Confirmed</h2>
                            <p style="margin: 0;">Your payment has been received and confirmed. Thank you for your trust in Twostones.</p>
                        </div>
                        
                        <p><strong>Order Number:</strong> #${order.id}<br>
                        <strong>Amount Paid:</strong> KES ${Number(order.total_amount).toLocaleString()}</p>
                        
                        <h3>What's Next?</h3>
                        <p>Your order is now being processed by our artisans. Ready-To-Wear items are typically processed within 2-3 business days.</p>
                        
                        <p><strong>Your Order:</strong></p>
                        <ul style="line-height: 2;">
                            ${itemsList}
                        </ul>
                        
                        <p style="margin-top: 30px;">We will send you a shipping confirmation with tracking details once your order is dispatched.</p>
                        
                        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            If you have any questions, please don't hesitate to reach out to us at manukato.twostones@gmail.com
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p style="margin: 0;">Twostones Luxury Heritage</p>
                        <p style="margin: 5px 0;">Nairobi, Kenya</p>
                        <p style="margin: 5px 0;">manukato.twostones@gmail.com</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Payment confirmation email sent to ${customerEmail}`);
    } catch (error) {
        console.error('Error sending payment confirmation email:', error);
    }
};

module.exports = {
    sendOrderConfirmation,
    sendPaymentConfirmation
};
