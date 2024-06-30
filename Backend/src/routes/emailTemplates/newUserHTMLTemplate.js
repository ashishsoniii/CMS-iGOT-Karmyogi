const newUserHTMLTemplate = ({ name, email, phone, password, role }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #333333;
      }
      p {
        color: #666666;
      }
    </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to iGOT KarmaYogi!</h1>
        <p>Hi <strong>${name}</strong>,</p>
        <p>We are inviting you to join our iGOT CMS! Here are your details:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Phone Number:</strong> ${phone}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
          <li><strong>Role:</strong> ${role}</li>
        </ul>
        <p>If you have any questions or need assistance, please feel free to reach out to us.</p>
        <p><strong>The iGOT KarmaYogi Team</strong></p>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  newUserHTMLTemplate,
};
