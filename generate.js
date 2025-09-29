const fs = require('fs-extra');
const path = require('path');
const csv = require('csv-parser');
const { execSync } = require('child_process');

const csvFilePath = path.join(__dirname, 'websites.csv');
const templatePath = path.join(__dirname, 'template');
const buildPath = path.join(__dirname, 'build');

console.log('Build path:', buildPath);
console.log('Template path:', templatePath);
console.log('CSV file path:', csvFilePath);

// Function to process spintax
function processSpintax(text) {
    const spintaxRegex = /\[\[(.*?)\]\]/g;
    return text.replace(spintaxRegex, (match, content) => {
        const options = content.split('|').map(s => s.trim());
        const randomIndex = Math.floor(Math.random() * options.length);
        return options[randomIndex];
    });
}

async function generateWebsites() {
    console.log('🚀 Next.js website generation process started...');

    // Ensure build directory exists
    console.log('Ensuring build directory exists...');
    await fs.ensureDir(buildPath);
    console.log('Build directory ensured.');

    const websites = [];

    // Read CSV file
    console.log('Reading CSV file...');
    await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => {
                console.log('CSV data row:', data);
                websites.push(data);
            })
            .on('end', resolve)
            .on('error', reject);
    });

    console.log(`Found ${websites.length} websites to generate`);

    for (const site of websites) {
        const sitePath = path.join(buildPath, site.domain);
        console.log(`\n✨ Generating website for: ${site.domain}`);
        console.log(`Site path: ${sitePath}`);

        try {
            // 1. Copy template
            console.log('Copying template...');
            await fs.copy(templatePath, sitePath, {
                filter: (src) => {
                    const shouldInclude = !src.includes('node_modules');
                    console.log(`Filtering ${src}, include: ${shouldInclude}`);
                    return shouldInclude;
                }
            });
            console.log(`[${site.domain}] Template copied successfully.`);

            // Check if site directory was created
            const siteDirExists = await fs.pathExists(sitePath);
            console.log(`Site directory exists: ${siteDirExists}`);

            // 2. Update file contents with dynamic data
            // Hero component update
            const heroFilePath = path.join(sitePath, 'components', 'Hero.jsx');
            console.log(`Updating Hero component at: ${heroFilePath}`);
            let heroContent = await fs.readFile(heroFilePath, 'utf-8');
            heroContent = processSpintax(heroContent);
            heroContent = heroContent.replace('{{ TITLE }}', site.title);
            heroContent = heroContent.replace('{{ DESCRIPTION }}', site.description);
            await fs.writeFile(heroFilePath, heroContent);

            // Contact component update
            const contactFilePath = path.join(sitePath, 'components', 'Contact.jsx');
            console.log(`Updating Contact component at: ${contactFilePath}`);
            let contactContent = await fs.readFile(contactFilePath, 'utf-8');
            contactContent = contactContent.replace('{{PHONE}}', site.phone);
            contactContent = contactContent.replace('{{ADDRESS}}', site.address);
            await fs.writeFile(contactFilePath, contactContent);



            // Root layout (layout.js) file metadata update
            const layoutFilePath = path.join(sitePath, 'app', 'layout.js');
            console.log(`Updating layout at: ${layoutFilePath}`);
            let layoutContent = await fs.readFile(layoutFilePath, 'utf-8');
            layoutContent = layoutContent.replace('{{TITLE}}', site.title);
            layoutContent = layoutContent.replace('{{DESCRIPTION}}', site.description);
            await fs.writeFile(layoutFilePath, layoutContent);
            console.log(`[${site.domain}] Root layout updated.`);

            // Update package.json with site-specific name
            const packageJsonPath = path.join(sitePath, 'package.json');
            console.log(`Updating package.json at: ${packageJsonPath}`);
            let packageJsonContent = await fs.readJson(packageJsonPath);
            packageJsonContent.name = site.domain.replace(/\./g, '-').toLowerCase();
            await fs.writeJson(packageJsonPath, packageJsonContent, { spaces: 2 });

            console.log(`[${site.domain}] Files updated with dynamic data.`);

            // 3. Install dependencies
            console.log(`[${site.domain}] Installing dependencies...`);
            try {
                // Clean any existing .next folder before installation
                await fs.remove(path.join(sitePath, '.next'));
                execSync('npm install', { cwd: sitePath, stdio: 'inherit' });
                console.log(`[${site.domain}] ✅ Dependencies installed successfully.`);
            } catch (installError) {
                console.error(`[${site.domain}] ❌ Failed to install dependencies:`, installError.message);
            }
        } catch (err) {
            console.error(`[${site.domain}] Error generating website:`, err);
            continue;
        }
    }

    console.log('\n🎉 All Next.js websites generated successfully! 🎉');
}

// Run the generation process
generateWebsites().catch(err => {
    console.error('❌ Fatal error in website generation:', err);
    process.exit(1);
});