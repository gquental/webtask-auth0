"use latest";

const googleapis = require('googleapis');
const aws = require("aws-sdk");
const sprintf = require('sprintf-js').sprintf;

const HTML_TEMPLATE = `
  <html>
    <head>
      <title>YouTube videos from %s</title>
      <link rel="stylesheet" href="https://cdn.rawgit.com/twbs/bootstrap/v4-dev/dist/css/bootstrap.css">
    </head>
    <body>
      <h1>YouTube videos from %s</h1>
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

module.exports = (ctx, req, res) => {
  const { GOOGLE_API, AWS_KEY, AWS_SECRET, S3_BUCKET, AWS_REGION, YT_TERM } = ctx.data;

  // Get the SDKs that will be used for the project
  let { youtube, s3 } = getProjectSDK()
  let { search } = ctx.data

  search = (typeof search != "undefined" && search != "") ? search : YT_TERM

  findVideos(youtube, search)
    .then(data => {
      return extractVideosToHTML(data)
    })
    .then(videosHtml => {
      return uploadToS3(s3, videosHtml)
    })
    .then(msg => {
      res.end(msg)
      console.log(msg)
    })
    .catch(err => {
      console.error(err)
      res.end(msg)
    })

  // Create the instance for the SDKs
  function getProjectSDK() {
    return {
      youtube: googleapis.youtube({
        version: 'v3',
        auth: GOOGLE_API
      }),
      s3: new aws.S3({
        region: AWS_REGION,
        accessKeyId: AWS_KEY,
        secretAccessKey: AWS_SECRET
      })
    }
  }

  // Find videos by using the YouTube SDK and a search term
  function findVideos(youtube, term) {
    return new Promise((resolve, reject) => {
      youtube.search.list({
        part: 'id,snippet',
        q: term
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
          today.toUTCString(),
          videosHtml.join('')
        )
      )
    })
  }

  // Uploads the video HTML to S3 Bucket
  function uploadToS3(s3, videosHtml) {
    let today = new Date()
    let filename = `videos-${today.getTime()}.html`

    return new Promise((resolve, reject) => {
      s3.putObject({
        Bucket: S3_BUCKET,
        ACL: 'public-read',
        ContentType: "text/html",
        Key: filename,
        Body: videosHtml
      }, (err, data) => {
        if (err) {
          reject(`Problem during S3 upload: ${err.message}`)
        }

        resolve(`Upload finished for file ${filename}`)
      })
    })
  }
}
