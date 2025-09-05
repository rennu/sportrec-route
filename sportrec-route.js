// ==UserScript==
// @name         Add route to sportrec
// @namespace    https://sloth.fi/
// @version      2025-09-05
// @description  Load your GPX file in sportrec
// @author       You
// @match        https://sportrec.eu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

let mapLoaderDiv = null

const styles = {
  fileLoaderDiv: {
    height: '100px',
    width: '200px',
    position: 'fixed',
    top: '50%',
    left: '50%',
    marginLeft: '-50px',
    marginTop: '-100px',
    backgroundColor: '#fff',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },

  uploadButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },

  fileInput: {
    display: 'none',
    type: 'file',
    accept: '.gpx',
  }
}

const loadGpxFile = async (event) => {
  const file = event.target.files[0]
  const gpx = await file.text()
  const parser = new DOMParser()
  const gpxDoc = parser.parseFromString(gpx, 'application/xml')

  const _routePoints = []
  for (const pt of gpxDoc.getElementsByTagName('trkpt')) {
    _routePoints.push({ lat: parseFloat(pt.attributes.lat.value), lng: parseFloat(pt.attributes.lon.value) })
  }
  window.L.polyline(_routePoints, { color: '#007bff', weight: 5 }).addTo(window.$map)
}

const createMapLoader = () => {
  const title = document.createElement('h3')
  title.innerText = 'Custom track'
  document.querySelector('#tail-opacity-style').after(title)

  const mainDiv = document.createElement('div')
  mainDiv.className = 'option'


  const leftDiv = document.createElement('div')
  leftDiv.innerText = 'Load GPX file'
  leftDiv.className = 'left'
  mainDiv.append(leftDiv)

  const rightDiv = document.createElement('div')
  rightDiv.className = 'right'

  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  Object.assign(fileInput.style, styles.fileInput)
  fileInput.addEventListener('change', loadGpxFile)
  rightDiv.append(fileInput)

  const button = document.createElement('button')
  button.className = 'keyb'
  button.style.cursor = 'pointer'
  button.innerText = 'Load GPX file'
  button.addEventListener('click', () => {
    fileInput.click()
  })
  rightDiv.append(button)

  mainDiv.append(rightDiv)
  title.after(mainDiv)
}

(function() {
  'use strict';
  let interval = null
  interval = setInterval(() => {
    if (document.querySelector('#tail-opacity-style') !== null) {
      clearInterval(interval)
      createMapLoader()
    }
  }, 1000)
})();
