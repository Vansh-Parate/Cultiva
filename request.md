var axios = require('axios');
var data = JSON.stringify({
    "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD]
    "latitude": 49.207,
  "longitude": 16.608,
  "similar_images": true
})

var config = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'https://plant.id/api/v3/health_assessment',
  headers: { 
    'Api-Key': 'your_api_key', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});