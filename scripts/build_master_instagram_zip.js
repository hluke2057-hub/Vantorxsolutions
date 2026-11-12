const fs = require('fs');
const path = require('path');
const { ZipArchive } = require('C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions/node_modules/archiver');

async function buildZip() {
  const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
  const staging = path.join(root, 'temp_staging_ig_package');
  
  if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true, force: true });
  fs.mkdirSync(staging, { recursive: true });

  // 1. Clean Highlight Covers (8 pictures)
  const coversDst = path.join(staging, '01_CLEAN_HIGHLIGHT_COVERS_8_PICTURES');
  fs.mkdirSync(coversDst, { recursive: true });
  const coversSrc = path.join(root, 'website/assets/instagram/covers');
  const coverFiles = fs.readdirSync(coversSrc).filter(f => f.endsWith('.png'));
  coverFiles.forEach(f => {
    fs.copyFileSync(path.join(coversSrc, f), path.join(coversDst, f));
  });

  // 2. Core Story Highlights (15 pictures in 5 category folders)
  const storiesDst = path.join(staging, '02_CORE_STORY_HIGHLIGHTS_15_PICTURES');
  fs.mkdirSync(storiesDst, { recursive: true });
  
  const categories = [
    {
      dir: '01_Packages_Basic_Accelerate_Scale',
      files: [
        'insta_highlight_01_packages_1_basic.png',
        'insta_highlight_02_packages_2_accelerate.png',
        'insta_highlight_03_packages_3_scale.png'
      ]
    },
    {
      dir: '02_AVA_Voice_AI_Receptionist',
      files: [
        'insta_highlight_04_ava_1_problem.png',
        'insta_highlight_05_ava_2_how_it_works.png',
        'insta_highlight_06_ava_3_live_demo.png'
      ]
    },
    {
      dir: '03_Custom_Contractor_Website',
      files: [
        'insta_highlight_07_website_1_problem.png',
        'insta_highlight_08_website_2_features.png',
        'insta_highlight_09_website_3_results.png'
      ]
    },
    {
      dir: '04_AEO_Search_Engine_Optimization',
      files: [
        'insta_highlight_10_aeo_1_what_is_aeo.png',
        'insta_highlight_11_aeo_2_how_it_works.png',
        'insta_highlight_12_aeo_3_dominate.png'
      ]
    },
    {
      dir: '05_LeadFlow_90_Second_Speed_To_Lead',
      files: [
        'insta_highlight_13_leadflow_1_90s_rule.png',
        'insta_highlight_14_leadflow_2_how_it_works.png',
        'insta_highlight_15_leadflow_3_zero_leaks.png'
      ]
    }
  ];

  const highlightsSrc = path.join(root, 'website/instagram-package/highlights');
  categories.forEach(cat => {
    const catDst = path.join(storiesDst, cat.dir);
    fs.mkdirSync(catDst, { recursive: true });
    cat.files.forEach(f => {
      const srcFile = path.join(highlightsSrc, f);
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, path.join(catDst, f));
      } else {
        console.warn('Missing file:', srcFile);
      }
    });
  });

  // 3. All Products Carousels (21 pictures)
  const carouselsDst = path.join(staging, '03_ALL_PRODUCTS_CAROUSELS_21_PICTURES');
  fs.mkdirSync(carouselsDst, { recursive: true });
  const allProdSrc = path.join(root, 'website/assets/instagram/all_products');
  const prodDirs = [
    '01_Accelerate_Bundle',
    '02_Ava_Voice_AI',
    '03_Basic_Front_Desk',
    '04_Scale_Enterprise',
    '05_Mobile_Website',
    '06_LeadFlow_SMS',
    '07_Contractor_AEO'
  ];
  prodDirs.forEach(pd => {
    const srcDir = path.join(allProdSrc, pd);
    const dstDir = path.join(carouselsDst, pd);
    if (fs.existsSync(srcDir)) {
      fs.mkdirSync(dstDir, { recursive: true });
      fs.readdirSync(srcDir).filter(f => f.endsWith('.png')).forEach(f => {
        fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, f));
      });
    }
  });

  // 4. Brand Logos and Profile Pictures
  const brandDst = path.join(staging, '04_BRAND_LOGOS_AND_PFPS');
  fs.mkdirSync(brandDst, { recursive: true });
  const logoPfp = path.join(root, 'website/assets/instagram/vantorx_logo_pfp.png');
  const logo3d = path.join(root, 'website/assets/instagram/vantorx_logo_3d_pfp.jpg');
  if (fs.existsSync(logoPfp)) fs.copyFileSync(logoPfp, path.join(brandDst, 'vantorx_logo_pfp.png'));
  if (fs.existsSync(logo3d)) fs.copyFileSync(logo3d, path.join(brandDst, 'vantorx_logo_3d_pfp.jpg'));

  // 5. Instruction Guide
  const readme = `================================================================================
VANTORX™ INSTAGRAM HIGHLIGHTS & BRAND ASSET MASTER PACKAGE
================================================================================

Everything you need to set up a world-class, conversion-focused Instagram profile
for VantorX Solutions.

PACKAGE CONTENTS:
--------------------------------------------------------------------------------
📁 01_CLEAN_HIGHLIGHT_COVERS_8_PICTURES (1080 x 1080 Circle-Safe Covers)
   - cover_01_ava_ai.png        -> AVA Voice AI highlight
   - cover_02_leadflow.png      -> 90-Sec LeadFlow highlight
   - cover_03_websites.png      -> Custom Contractor Websites highlight
   - cover_04_aeo_rank.png      -> AEO / AI Search Ranking highlight
   - cover_05_accelerate.png    -> Accelerate Package highlight
   - cover_06_results.png       -> Live Client Proof & Results highlight
   - cover_07_live_demo.png     -> Voice Demo & Phone Recordings highlight
   - cover_08_scale_fleet.png   -> Scale Enterprise Package highlight

📁 02_CORE_STORY_HIGHLIGHTS_15_PICTURES (1080 x 1920 HD Vertical Stories)
   Organized across 5 highlight categories (3 sequential slides each):
   1. 01_Packages_Basic_Accelerate_Scale (Basic $997, Accelerate $1,497, Scale $4,997)
   2. 02_AVA_Voice_AI_Receptionist (Missed call bleed, 24/7 AI dispatch, Live demo)
   3. 03_Custom_Contractor_Website (Why 2012 sites bleed sales, Sub-second UX, $142K proof)
   4. 04_AEO_Search_Engine_Optimization (What is AEO, Perplexity/ChatGPT crawl, Domination)
   5. 05_LeadFlow_90_Second_Speed_To_Lead (The 90s rule, SMS dispatch, 0 lost leads)

📁 03_ALL_PRODUCTS_CAROUSELS_21_PICTURES (1080 x 1080 Square Post Slides)
   3 sequential carousel slides for each of VantorX's 7 core products.

📁 04_BRAND_LOGOS_AND_PFPS
   - vantorx_logo_pfp.png       -> High-res transparent PNG logo
   - vantorx_logo_3d_pfp.jpg    -> Hyper-detailed obsidian & amber 3D logo

HOW TO SET UP YOUR INSTAGRAM HIGHLIGHTS (STEP-BY-STEP):
--------------------------------------------------------------------------------
1. POST STORIES:
   Post the 3 vertical story graphics from a category folder to your Instagram Story.

2. ADD TO HIGHLIGHT:
   - View your posted story, tap "Highlight" at the bottom right.
   - Choose "New Highlight" and give it a short, punchy name (e.g. "AVA AI", "Packages").

3. SET THE CLEAN COVER:
   - Tap and hold your new Highlight on your Instagram profile page.
   - Select "Edit Highlight" -> "Edit Cover".
   - Tap the gallery icon and select the corresponding 1080x1080 cover from
     the "01_CLEAN_HIGHLIGHT_COVERS_8_PICTURES" folder.
   - Notice how perfectly the glowing amber icon and typography are centered
     inside Instagram's circular crop without touching the edges!

Need web preview or to download individual slides?
Visit: https://www.vantorxsolutions.com/instagram-package/
`;
  fs.writeFileSync(path.join(staging, 'README_HOW_TO_USE.txt'), readme, 'utf8');

  // Now create the master zip with archiver
  const outPath = path.join(root, 'VantorX_Instagram_Highlights_Complete_Package.zip');
  const output = fs.createWriteStream(outPath);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`Master zip created: ${archive.pointer()} total bytes (~${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
      
      // Copy to target locations
      const targets = [
        path.join(root, 'website/instagram-package/VantorX_Instagram_Highlights_Complete_Package.zip'),
        path.join(root, 'website/downloads/VantorX_Instagram_Highlights_Complete_Package.zip'),
        path.join(root, 'website/assets/instagram/VantorX_Instagram_Highlights_Complete_Package.zip'),
        'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0/VantorX_Instagram_Highlights_Complete_Package.zip'
      ];
      
      targets.forEach(t => {
        const pDir = path.dirname(t);
        if (!fs.existsSync(pDir)) fs.mkdirSync(pDir, { recursive: true });
        fs.copyFileSync(outPath, t);
        console.log('Copied to:', t);
      });

      // Also build the clean covers zip
      const coversZipPath = path.join(root, 'VantorX_Clean_IG_Highlight_Covers.zip');
      const coversOutput = fs.createWriteStream(coversZipPath);
      const coversArchive = new ZipArchive({ zlib: { level: 9 } });

      coversOutput.on('close', () => {
        console.log(`Covers zip created: ${coversArchive.pointer()} total bytes (~${(coversArchive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
        const coverTargets = [
          path.join(root, 'website/instagram-package/VantorX_Clean_IG_Highlight_Covers.zip'),
          path.join(root, 'website/downloads/VantorX_Clean_IG_Highlight_Covers.zip'),
          path.join(root, 'website/assets/instagram/VantorX_Clean_IG_Highlight_Covers.zip'),
          'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0/VantorX_Clean_IG_Highlight_Covers.zip'
        ];
        coverTargets.forEach(ct => {
          const cDir = path.dirname(ct);
          if (!fs.existsSync(cDir)) fs.mkdirSync(cDir, { recursive: true });
          fs.copyFileSync(coversZipPath, ct);
          console.log('Copied covers zip to:', ct);
        });
        fs.unlinkSync(coversZipPath);
        fs.rmSync(staging, { recursive: true, force: true });
        fs.unlinkSync(outPath);
        resolve();
      });

      coversArchive.on('error', err => reject(err));
      coversArchive.pipe(coversOutput);
      coversArchive.directory(coversDst, false);
      coversArchive.finalize();
    });

    archive.on('error', err => reject(err));
    archive.pipe(output);
    archive.directory(staging, false);
    archive.finalize();
  });
}

buildZip().catch(console.error);
