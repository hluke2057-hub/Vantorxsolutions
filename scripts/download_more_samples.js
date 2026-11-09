const https = require('https');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

const urls = [
  {
    name: 'taskless_sample_2.jpg',
    url: 'https://scontent-mia5-1.cdninstagram.com/v/t51.82787-15/555101019_17864174244470236_7394289985947327105_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=102&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=qSpHD1Ez_AQQ7kNvwG8RMqn&_nc_oc=Adok8RGonawRtOE_2SIJZiCdAeeYqLDKcpEyq1LxuUCNDk0gQk45OygBvu2tDHVULOg&_nc_zt=23&_nc_ht=scontent-mia5-1.cdninstagram.com&_nc_gid=orHOa8BedIMidyRwgLRNsw&_nc_ss=7f689&oh=00_AQS6UMfBq25846Bkl2hQQr6MuEDD-EOix5NYSqnfht4wWg&oe=6AF6D4E3'
  },
  {
    name: 'taskless_sample_3.jpg',
    url: 'https://scontent-mia5-1.cdninstagram.com/v/t51.82787-15/554831475_17864174154470236_1790283917713592889_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=104&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=GjJDV21EwF8Q7kNvwEjiemZ&_nc_oc=Adr4aaWloJyg7GTon-38OOs5Ow_M7O-k8YkYlrzTcFxAoBGsXQvjCUF6DsApWiEQHqA&_nc_zt=23&_nc_ht=scontent-mia5-1.cdninstagram.com&_nc_gid=orHOa8BedIMidyRwgLRNsw&_nc_ss=7f689&oh=00_AQQNzbCn49uqzsH8G9fnUL5Rrm97kK4B2jMS5yzIZQxKRA&oe=6AF6AE79'
  }
];

urls.forEach(item => {
  const dest = path.join(ARTIFACTS_DIR, item.name);
  const file = fs.createWriteStream(dest);
  https.get(item.url, res => {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Downloaded', item.name);
    });
  });
});
