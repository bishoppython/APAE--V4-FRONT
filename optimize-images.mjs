import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const dirsToOptimize = [
  './src/assets/images',
  './public'
];

const MAX_WIDTH = 800; // Redimensionar imagens que sejam maiores que 800px de largura

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    return;
  }

  try {
    const tempFilePath = `${filePath}.temp${ext}`;
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let sharpInstance = image;

    // Se a imagem for muito grande, redimensionamos
    if (metadata.width > MAX_WIDTH) {
      sharpInstance = sharpInstance.resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,
      });
    }

    if (ext === '.png') {
      sharpInstance = sharpInstance.png({ quality: 80, compressionLevel: 9 });
    } else if (ext === '.jpg' || ext === '.jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality: 80, mozjpeg: true });
    }

    await sharpInstance.toFile(tempFilePath);

    const originalStats = await fs.stat(filePath);
    const optimizedStats = await fs.stat(tempFilePath);

    const savedBytes = originalStats.size - optimizedStats.size;

    if (savedBytes > 0) {
      await fs.rename(tempFilePath, filePath);
      console.log(`✅ Otimizada: ${filePath} | Tamanho original: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB -> ${(optimizedStats.size / 1024 / 1024).toFixed(2)} MB`);
    } else {
      // Se a original for menor (raro com resize, mas possível), mantemos a original
      await fs.unlink(tempFilePath);
      console.log(`➖ Já otimizada (ou impossível reduzir): ${filePath}`);
    }
  } catch (err) {
    console.error(`❌ Erro ao otimizar ${filePath}:`, err.message);
  }
}

async function traverseDirectory(dir) {
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        await traverseDirectory(fullPath);
      } else {
        await optimizeImage(fullPath);
      }
    }
  } catch (err) {
    // Ignora erros se o diretório não existir
    if (err.code !== 'ENOENT') {
      console.error(`Erro ao ler o diretório ${dir}:`, err);
    }
  }
}

async function run() {
  console.log('Iniciando otimização de imagens...');
  for (const dir of dirsToOptimize) {
    await traverseDirectory(dir);
  }
  console.log('Otimização concluída!');
}

run();
