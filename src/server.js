import express  from 'express';
import {routes} from 'routes';


const app = express();

app.use((req, res) => {
    if (!routes.includes(req.url)) { // Мы не определили путь, который бы подошел для URL
        return res.status(404).send('Not found');
    }
        
    return res.end(renderHTML());
});

const assetUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8051' : '/';

function renderHTML() {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="${assetUrl}/assets/styles.css">
                <link rel="stylesheet" href="${assetUrl}/assets/main.css">
            </head>
            <body>
                <div id="view"></div>
                <script type="application/javascript" src="${assetUrl}/public/assets/bundle.js"></script>
            </body>
        </html>
    `;
}

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server listening on: ${PORT}`);
});