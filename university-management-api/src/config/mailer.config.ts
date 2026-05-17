import{ MailerOptions } from '@nestjs-modules/mailer';

export const mailerConfig: MailerOptions = {
    transport: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    },
    defaults: {
        from: '"No Reply" <process.env.EMAIL_USER>',
    },
};// Replace with your actual no-reply email