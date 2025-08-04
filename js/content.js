const urlParams = new URLSearchParams(window.location.search);

var selectedTag = "home";

if (urlParams != null)	
	selectedTag = urlParams.get('tag');

var jsonName = "home";
if (selectedTag == null || selectedTag == "") {
	jsonName = 'home';
	selectedTag = "home";
} else {	
	jsonName = selectedTag;
}

fetch("data/" + jsonName + '.json')
.then(response => response.json())
.then(data => {
	const home = document.getElementById('content');
  
	data.forEach(section => {  
		const sectionDiv = document.createElement('div');	
		sectionDiv.className = 'content-section';

		// Título general (H1) si existe
		if (section.title) {
			const title = document.createElement('h1');
			title.innerText = section.title;
			sectionDiv.appendChild(title);
		}

		// --- NUEVO: soporte para formato con "items" (ej. CV) ---
		if (section.items) {
			section.items.forEach(item => {
				const itemDiv = document.createElement('div');	
				itemDiv.className = 'content-item';

				if (item.subtitle) {
					const subtitle = document.createElement('h2');
					subtitle.innerText = item.subtitle;
					itemDiv.appendChild(subtitle);
				}

				if (item.description) {
					const description = document.createElement('p'); 
					description.innerHTML = item.description;
					itemDiv.appendChild(description);
					itemDiv.className = "contentDesc";	
				}

				if (item.image) {
					const imageData = document.createElement('img'); 
					imageData.src = `${item.image}`;
					itemDiv.appendChild(imageData);
					itemDiv.className = "contentImages";	
				}

				if (item.links) {	
					const links = document.createElement('div');	
					links.className = "links";	
				 itemDiv.appendChild(links);

					item.links.forEach(obj => {
						const a = document.createElement('a');
						a.innerText = obj.url_text;
						a.href = obj.url;
						a.className = "contentLinks";
						links.appendChild(a);
					});
				}

				sectionDiv.appendChild(itemDiv);
			});
		} 
		// --- SOPORTE LEGADO: formato simple (ej. Home) ---
		else {
			if (section.description) {
				const description = document.createElement('p'); 
				description.innerHTML = section.description;
				sectionDiv.appendChild(description);
			}

			if (section.image) {
				const imageData = document.createElement('img'); 
				imageData.src = `${section.image}`;
				sectionDiv.appendChild(imageData);
				sectionDiv.className = "contentImages";	
			}

			if (section.links) {
				const links = document.createElement('div');	
				links.className = "links";	
				sectionDiv.appendChild(links);

				section.links.forEach(obj => {
					const a = document.createElement('a');
					a.innerText = obj.url_text;
					a.href = obj.url;
					a.className = "contentLinks";
					links.appendChild(a);
				});
			}
		}

		home.appendChild(sectionDiv);

		const c = document.createElement('p'); 
		c.innerText = ".....";
		c.className = "separation";	
		home.appendChild(c);
	});
})
.catch(error => console.error(error));
