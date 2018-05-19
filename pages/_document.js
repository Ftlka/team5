import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <html>
                <Head>
                    <link rel="stylesheet" href="/_next/static/style.css" />
                    <meta name="viewport" content="width=device-width" />
                    <link rel="shortcut icon" href="/static/images/logo.png" />
                    <title>&copy;TBM</title>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
