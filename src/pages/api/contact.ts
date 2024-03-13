import type { APIRoute } from 'astro';
import Mailgun from 'mailgun.js';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');

  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: 'api',
    key: import.meta.env.MAILGUN_API_KEY || 'MAILGUN_API_KEY',
  });

  console.log(name, email, message);

  // Validate the data - you'll probably want to do more than this
  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({
        message: 'Missing required fields',
      }),
      { status: 400 }
    );
  }

  try {
    const resp = await mg.messages.create(import.meta.env.MAILGUN_EMAIL || 'MAILGUN_EMAIL', {
      from: `mailgun@${import.meta.env.MAILGUN_EMAIL || 'MAILGUN_EMAIL'}`,
      to: import.meta.env.RECIPIENT_EMAIL || 'RECIPIENT_EMAIL',
      subject: 'Contact from Tripath Website',
      text: `${name} ; ${email}\n\n${message}\n`,
    });

    console.log(resp);

    return new Response(
      JSON.stringify({
        message: 'Success!',
      }),
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify({
        message: 'Internal server error',
      }),
      { status: 500 }
    );
  }
};
