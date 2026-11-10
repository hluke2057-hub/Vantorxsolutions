const https = require('https');
const fs = require('fs');
const path = require('path');

const artDir = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

const images = [
  {
    name: 'taskless_ref_submarine.jpg',
    url: 'https://scontent-mia3-3.cdninstagram.com/v/t51.82787-15/892512610_17912002791568478_2968486549433512720_n.jpg?stp=cmp1_dst-jpg_e35_s640x640_tt6&_nc_cat=110&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=JPSrIOWCjVgQ7kNvwHIALzj&_nc_oc=AdooYG-X3Q-wVjkeqUP6_0fRsUVFY5WJp5yv2dsNFEiAJoo7kRj7CWuzJ06H3JZFTOg&_nc_zt=23&_nc_ht=scontent-mia3-3.cdninstagram.com&_nc_gid=7D5zuMamRs9VfRwhakCNFA&_nc_ss=79689&oh=00_AQT1TpT1CC9dyg181wDCGBf8bhCR3m55cu5FjW4LYOXbLg&oe=6AF93DE6'
  },
  {
    name: 'taskless_ref_uranus.jpg',
    url: 'https://scontent-mia5-2.cdninstagram.com/v/t51.82787-15/875809182_17910616347568478_2168160475634632235_n.jpg?stp=cmp1_dst-jpg_e35_s640x640_tt6&_nc_cat=108&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=wGGtMmc2YU8Q7kNvwEAf6dN&_nc_oc=Adp7Q5xdxzzz81PyiCId5O1ZujjABuTJtfvnQGf2uqJb01JNvNuMdOh4wMDYNoWCHn0&_nc_zt=23&_nc_ht=scontent-mia5-2.cdninstagram.com&_nc_gid=eWMFoXFJe0e0EbtMS8G9tQ&_nc_ss=79689&oh=00_AQSlWj0sP5fwOC9jDIQPqEWDJz5NV1Yx5kd5CGJajSD0Xg&oe=6AF92912'
  },
  {
    name: 'taskless_ref_halloween.jpg',
    url: 'https://scontent-mia3-3.cdninstagram.com/v/t51.82787-15/883299786_17911210188568478_1475294185644918901_n.jpg?stp=cmp1_dst-jpg_e35_s640x640_tt6&_nc_cat=107&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=zuXJ49qVYvUQ7kNvwHFfZE2&_nc_oc=Adoc8vOUmmQ14xd98tRYeDrviX914MR-DWj5G9oH4n3Qn0NA7IxXnnv09X_os4CzGjc&_nc_zt=23&_nc_ht=scontent-mia3-3.cdninstagram.com&_nc_gid=c88Wf4w3k6N6_6E7baOpSQ&_nc_ss=79689&oh=00_AQQ_fhQG341Oj6vySzhW3fTdi6NGNf_ooGrak5o2sucCbw&oe=6AF93764'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', reject);
  });
}

(async () => {
  for (const img of images) {
    const dest = path.join(artDir, img.name);
    try {
      await download(img.url, dest);
      console.log('Downloaded', img.name, fs.statSync(dest).size, 'bytes');
    } catch (e) {
      console.error('Failed to download', img.name, e.message);
    }
  }
})();
