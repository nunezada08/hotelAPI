import sharp from 'sharp';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { uptime } from 'process';
import { assert } from 'console';

const UPLOADS_DIR = './uploads';

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `quartos_${req.params.id}_${Date.now()}${ext}`);
    },
});

export const upload = multer({ storage });

export async function processarFoto(filePath) {
    const processado = await sharp(fs.readFileSync(filePath))
        .resize({ width: 800, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
    fs.writeFileSync(filePath, processado);
    return filePath.replace(/\\/g, '/')
}

export function removerFoto(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
