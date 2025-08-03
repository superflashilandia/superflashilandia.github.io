const urlParams = new URLSearchParams(window.location.search);

var selectedTag = "home";

if(urlParams != null)	
	selectedTag = urlParams.get('tag');

var jsonName = "home";
if(selectedTag == null || selectedTag == "")
{
	jsonName = 'home';
	selectedTag = "home";
} else{	
	jsonName = selectedTag;
}

fetch("data/" + jsonName + '.json')
.then(response => response.json())
.then(data => {
	const home = document.getElementById('content');
  
  data.forEach(item => {  
	
	const itemData = document.createElement('div');	
	itemData.className = 'content-item';

	if(item.title != null)
	{
		const title = document.createElement('h1'); title.innerText = item.title;
		itemData.appendChild(title);
		itemData.className = "contentTitle";	
	}
	if(item.description != null)
	{
		const description = document.createElement('h2'); description.innerHTML  = item.description;
		itemData.appendChild(description);
		itemData.className = "contentDesc";	
	}
	if(item.image != null)
	{
		const imageData = document.createElement('img'); imageData.src = `${item.image}`;
		itemData.appendChild(imageData);
		itemData.className = "contentImages";	
	}
	if(item.links != null)
	{	
		const links = document.createElement('div');	
		links.className = "links";	
		itemData.appendChild(links);
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
			a.className = "contentLinks";			
		}
	}
	
	home.appendChild(itemData);
	
	const c = document.createElement('p'); c.innerText = ".....";
	c.className = "separation";	
	home.appendChild(c);
  });
  
})
.catch(error => console.error(error));




