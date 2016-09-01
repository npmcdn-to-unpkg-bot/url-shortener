(function() {
  'use strict';

  const form = document.getElementById('shorten-form');
  const urlBox = form.elements[0];
  const link = document.getElementById('link');
  const shortenBox = document.getElementById('shortened');

  function displayShortenedUrl(response) {
    link.textContent = response.data.shortUrl;
    link.setAttribute('href', response.data.shortUrl);
    shortenBox.style.opacity = '1';
    urlBox.value = '';
  }

  function alertError(error) {
    alert('Are you sure the URL is correct? Make sure it has http:// at the beginning.');
  }

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    axios.post('/new', { url: urlBox.value })
      .then(displayShortenedUrl)
      .catch(alertError);
  });
})();
