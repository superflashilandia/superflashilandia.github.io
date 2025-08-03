// Function to filter gallery items based on the selected tag
function filterGallery(tag) {
   window.location.href = "?tag=" + tag; 
}
function filterGallery_OLD(tag) {
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    const itemTags = item.getAttribute('data-tags').split(' ');
    if (itemTags.includes(tag)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

  function openVideo(videoId) {
    const overlay = document.getElementById('videoOverlay');
    const frame = document.getElementById('videoFrame');
    frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    overlay.style.display = 'flex';
  }

  function closeVideo() {
    const overlay = document.getElementById('videoOverlay');
    const frame = document.getElementById('videoFrame');
    frame.src = "";
    overlay.style.display = 'none';
  }

// Add event listeners to the filter buttons
const filterButtons = document.querySelectorAll('.filter-button');
var selectedTag = urlParams.get('tag');
filterButtons.forEach(button => {
	var buttonTag = button.getAttribute('data-filter');
	if(selectedTag ==buttonTag )
		button.className  = "filter-button-active";
  button.addEventListener('click', () => {
    const tag = button.getAttribute('data-filter');
    filterGallery(tag);
  });
});


fetch('data/videos.json')
.then(response => response.json())
.then(data => {
	
	// Parse the URL to get the selected tag from the query parameters
	const urlParams = new URLSearchParams(window.location.search);
	var selectedTag = urlParams.get('tag');
	
	if(selectedTag == "" || selectedTag == null) 
		selectedTag = "home";
	
	const gallery = document.getElementById('gallery');
  
	data.forEach(item => {	  
	const itemTags = item.tags.split(' ');	
    if (itemTags.includes(selectedTag)) {
	
	
		const galleryItem = document.createElement('div');
		const youtubeContainer = document.createElement('div');
		galleryItem.setAttribute('data-tags', item.tags);
		galleryItem.appendChild(youtubeContainer);
		galleryItem.className = 'galleryItem';
		
		youtubeContainer.className = 'thumbnail-container';

		const youtubeEmbed = document.createElement('img');
		youtubeEmbed.src = `https://img.youtube.com/vi/${item.youtube_id}/hqdefault.jpg`;

		youtubeContainer.appendChild(youtubeEmbed);

		const name = document.createElement('h3');
		name.innerText = item.name;
		galleryItem.appendChild(name);
		
		const description = document.createElement('p');
		description.innerHTML = item.description;
		galleryItem.appendChild(description);
		
		galleryItem.addEventListener("click", () => openVideo(item.youtube_id));
		
		if(item.links != null)
		{	
			const links = document.createElement('div');	
			links.className = "links";	
			galleryItem.appendChild(links);
			
			for (var i = 0; i < item.links.length; i++){
				
				var obj = item.links[i];			
				var a = document.createElement('a');
				var _text = obj["url_text"];
				var _url = obj["url"];
				var linkText = document.createTextNode(_text);
				a.appendChild(linkText);
				a.title = _text;
				a.href = _url;
				links.appendChild(a);
				a.className = "videoLinks";			
			}
		}
	
		
		
		
		const playBtn = document.createElement('div');
		playBtn.className = 'play-button';
		youtubeContainer.appendChild(playBtn);
		
		gallery.appendChild(galleryItem);
		
	}
	
  });
  
  
})
.catch(error => console.error(error));







