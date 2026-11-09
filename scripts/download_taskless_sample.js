const https = require('https');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\b805e771-e1c1-4976-afc1-cd59dd49eae0';

const imgUrl = 'https://scontent-mia5-1.cdninstagram.com/v/t51.82787-15/553196361_17864174268470236_7045297937202933655_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ig_cache_key=MzczMDE0MzQ0NzYxMDA0NTI2Mw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTA4MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=VPKmvtSwZnoQ7kNvwEueVll&_nc_oc=AdqgXpMczVHaaeMZ3MqCfdJoEapckCq3e9LDqmJxF39jdsAik7H3MTml2DhQjrVZm_8&_nc_zt=23&_nc_ht=scontent-mia5-1.cdninstagram.com&_nc_gid=orHOa8BedIMidyRwgLRNsw&_nc_ss=7f689&oh=00_AQR7xFHwFo-51m1pTQFYUk2VOeCSonXwPLwO1t5nDiPMMw&oe=6AF6D0FC';

const dest = path.join(ARTIFACTS_DIR, 'taskless_sample_post.jpg');
const file = fs.createWriteStream(dest);

https.get(imgUrl, res => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Saved taskless_sample_post.jpg, size:', fs.statSync(dest).size);
  });
}).on('error', e => console.error(e.message));
