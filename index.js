const { GOOGLE_API, AWS_KEY, AWS_SECRET, S3_FOLDER, YT_TERM } = process.env;

const googleapis = require('googleapis');

const HTML_TEMPLATE = `
  <html>
    <head>
      <title>YouTube videos from %s</title>
    </head>
    <body>
      %s
    </body>
  </html>`;
const VIDEO_TEMPLATE = `
  <div style="display: block; float: left;">
    <iframe src="%s"></iframe>
    <h2>%s</h2>
    <p>%s</p>
  </div>`;

(() => {
  // Setup API SDK with API KEY and create YouTube object
  let youtube = googleapis.youtube({
    version: 'v3',
    auth: GOOGLE_API
  })

  findVideos(youtube, YT_TERM)
    .then(data => {
      return extractVideos(data)
    })
    .then(videos => {
      console.log(videos)
    })

  // Find videos by using the YouTube SDK and a search term
  function findVideos(youtube, term) {
    return new Promise((resolve, reject) => {
      youtube.search.list({
        part: 'id,snippet',
        q: YT_TERM
      }, function(err, data) {
        if (err) {
          reject(`Problem connection with YouTube ${err.message}`)
        }

        resolve(data)
      })
    })
  }

  function extractVideos(data) {
    return new Promise((resolve, reject) => {
      resolve(data.items.map(video => {
        return {
          title: video.snippet.description,
          description: video.snippet.description,
          embed: `https://www.youtube.com/embed/${video.id.videoId}`
        }
      }))
    })
  }

  function generateYouTubeHTML(videos) {
    return new Promise((resolve, reject) => {
      let videosHtml = videos.map(video => {
        
      })
    })
  }
})()
