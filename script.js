const corsProxy = 'https://api.allorigins.win/get?url='; // free public CORS proxy

const form = document.getElementById('proxyForm');
const urlInput = document.getElementById('urlInput');
const contentFrame = document.getElementById('contentFrame');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  errorMsg.textContent = '';
  let targetUrl = urlInput.value.trim();

  if (!targetUrl) {
    errorMsg.textContent = 'Please enter a valid URL.';
    return;
  }

  try {
    const urlObj = new URL(targetUrl); // Validate URL format
    fetchContentCorsProxy(targetUrl);
  } catch (e) {
    errorMsg.textContent = 'Invalid URL format.';
  }
});

function fetchContentCorsProxy(url) {
  const encodedUrl = encodeURIComponent(url);
  fetch(corsProxy + encodedUrl)
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch content via proxy.');
      return response.json();
    })
    .then(data => {
      if (data && data.contents) {
        // Create a Blob URL for inline loading in iframe
        const blob = new Blob([data.contents], {type: 'text/html'});
        const blobUrl = URL.createObjectURL(blob);
        contentFrame.src = blobUrl;
      } else {
        throw new Error('No content returned from proxy.');
      }
    })
    .catch(error => {
      errorMsg.textContent = 'Error loading content: ' + error.message + 
        ' You may try another URL or check your internet connection.';
      contentFrame.src = 'about:blank';
    });
}

