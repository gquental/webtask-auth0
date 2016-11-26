const { GOOGLE_API, AWS_KEY, AWS_SECRET, S3_FOLDER, YT_TERM } = process.env;

const googleapis = require('googleapis');
const sprintf = require('sprintf-js').sprintf;

const HTML_TEMPLATE = `
  <html>
    <head>
      <title>YouTube videos from %s</title>
      <link rel="stylesheet" href="https://cdn.rawgit.com/twbs/bootstrap/v4-dev/dist/css/bootstrap.css">
    </head>
    <body>
      <ul class="list-group">
        %s
      </ul>
    </body>
  </html>`;
const VIDEO_TEMPLATE = `
  <li class="list-group-item">
    <iframe src="%s"></iframe>
    <h3>%s</h3>
    <p>%s</p>
  </li>`;

(() => {
  // Setup API SDK with API KEY and create YouTube object
  let youtube = googleapis.youtube({
    version: 'v3',
    auth: GOOGLE_API
  })

  findVideos(youtube, YT_TERM)
    .then(data => {
      return extractVideosToHTML(videos)
    })
    .then(videosHtml => {
      console.log(videosHtml)
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

  // Generates array with the HTML representation of each video and returns
  // a full HTML with all the videos in the body
  function extractVideosToHTML(data) {
    return new Promise((resolve, reject) => {
      let videosHtml = data.items.map(video => {
        return sprintf(
          VIDEO_TEMPLATE,
          `https://www.youtube.com/embed/${video.id.videoId}`,
          video.snippet.title,
          video.snippet.description
        )
      })
      let today = new Date()

      // Generate final HTML with all videos
      resolve(
        sprintf(
          HTML_TEMPLATE,
          today.toUTCString(),
          videosHtml.join()
        )
      )
    })
  }

  function uploadToS3(s3SDK, videoHtml) {

  }
})()
