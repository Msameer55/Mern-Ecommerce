import fs from 'fs';
import google from 'googlethis';

const productFilePath = './data/product.js';

async function updateImages() {
    let content = fs.readFileSync(productFilePath, 'utf8');

    // Find all blocks of objects that have a name and images array.
    // This is a naive regex trying to capture the name and the images array block.
    // Example:
    // name: "Classic Oxford Button-Down Shirt",
    // ...
    // url: "https://picsum.photos/500/500?random=39",
    // altText: "Classic Oxford Button-Down Shirt Front View",
    
    // We will extract all names and index their position roughly, 
    // or just search all `name: "Title"` and `url: "..."` and process them sequentially block by block.
    // Let's parse all names in order:
    const nameRegex = /name:\s*"([^"]+)"/g;
    const urlRegex = /url:\s*"([^"]+)"/g;

    let names = [];
    let match;
    while ((match = nameRegex.exec(content)) !== null) {
        names.push(match[1]);
    }

    console.log(`Found ${names.length} products.`);

    for (let i = 0; i < names.length; i++) {
        const productName = names[i];
        console.log(`Searching for: ${productName}`);
        
        try {
            // Search images
            const imagesResult = await google.image(productName + ' clothing high quality product photography white background', { safe: false });
            if (imagesResult && imagesResult.length > 0) {
                // Find next occurrences of `url: "..."` corresponding to this product
                // To do this reliably, we find the index of the current name, and the index of the next name (or end of string)
                const startIndex = content.indexOf(`name: "${productName}"`);
                const endIndex = i < names.length - 1 ? content.indexOf(`name: "${names[i + 1]}"`, startIndex + 1) : content.length;
                
                let block = content.substring(startIndex, endIndex);
                
                let imageIdx = 0;
                block = block.replace(/url:\s*"([^"]+)"/g, (match, urlValue) => {
                    // Try to get distinct images 
                    const foundImageUrl = imagesResult[imageIdx % imagesResult.length].url;
                    imageIdx++;
                    return `url: "${foundImageUrl}"`;
                });
                
                content = content.substring(0, startIndex) + block + content.substring(endIndex);
            }
        } catch (error) {
            console.error(`Error searching image for ${productName}:`, error.message);
        }
        
        // Wait a bit to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    fs.writeFileSync(productFilePath, content);
    console.log('Finished updating images!');
}

updateImages();
