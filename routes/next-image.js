const express = require('express');
const router = express.Router();
const path = require('path');
const accept = require('@hapi/accept');

// Select the most appropriate image type to use based on the accept header
let varyImageGetter = function(req) {
  const mediaType = accept.mediaType(req.headers.accept, ["image/jpg", "image/webp"]);

  let image = 'mountain.jpg'

  if (mediaType == 'image/webp') {
    image = 'mountain.webp'
  }

  console.log('Responding with "' + image + '" based on the accept header of "' + req.headers.accept + '"')
  return image
}

router.get('/no-cache-headers.jpg', function (req, res) {
  const options = {
    root: path.join(__dirname, '../assets'),
    headers: {
      'Cache-Control': '',
    }
  }

  res.sendFile('mountain.jpg', options)
})

router.get('/zero-cache-headers.jpg', function (req, res) {
  const options = {
    root: path.join(__dirname, '../assets'),
    headers: {
      'Cache-Control': 'public, max-age=0',
    }
  }

  res.sendFile('mountain.jpg', options)
})

router.get('/non-zero-cache-headers.jpg', function (req, res) {
  const options = {
    root: path.join(__dirname, '../assets'),
    headers: {
      'Cache-Control': 'public, max-age=200',
    }
  }

  res.sendFile('mountain.jpg', options)
})

router.get('/short-age-cache-headers.jpg', function (req, res) {
  const options = {
    root: path.join(__dirname, '../assets'),
    headers: {
      'Cache-Control': 'public, max-age=30',
    }
  }

  res.sendFile('mountain.jpg', options)
})

// Respond with either a jpg or webp image based on the accept header
router.get('/accept-header', function (req, res) {
  const options = {
    root: path.join(__dirname, '../assets'),
    headers: {
      'Cache-Control': 'public, max-age=200',
    }
  }

  res.setHeader('vary', 'accept')

  let image = varyImageGetter(req)
  res.sendFile(image, options)
})

// Respond with either a jpg or webp image based on the accept header
// but don't set the vary header in the response.
// This is to replicate a non-standard customer setup
router.get('/accept-header-no-vary', function (req, res) {
  const options = {
    root: path.join(__dirname, '../assets'),
    headers: {
      'Cache-Control': 'public, max-age=200',
    }
  }

  let image = varyImageGetter(req)
  res.sendFile(image, options)
})

router.get('/404', (req, res) => {
  res.sendStatus(404)
})

module.exports = router;
