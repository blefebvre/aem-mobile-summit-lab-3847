window.weMix = window.weMix || {};

(function() {

	var replaceJcrContent = function(pathStr) {
		return pathStr.replace(new RegExp('jcr:content', 'g'), '_jcr_content');
	};

	var transformArticleHtml = function(article, imgSrcPrefix) {
		var articleBodyItems = [];
        // Place the hero image first - if available
        if (typeof article.root.heroimage === 'object') {
            // Build an image tag using the imgSrcPrefix (instead of href) to load it off the filesystem
            articleBodyItems.push('<img src="' + imgSrcPrefix + replaceJcrContent(article.root.heroimage.path) + '.img.jpg" />');
        }
        articleBodyItems.push('<h3>' + article.title + '</h3>');
        // Iterate through the items in the responsive grid
        var responsiveGridKeys = Object.keys(article.root.responsivegrid);
        for (var i = 0; i < responsiveGridKeys.length; i++) {
            var currentItem = article.root.responsivegrid[responsiveGridKeys[i]];
            if (responsiveGridKeys[i] === 'textimage') {
                // Include the 'text' property of the textimage component by default
                articleBodyItems.push(currentItem.text);
            }
            else if (responsiveGridKeys[i] === 'image') {
                // Include an image tag with the provided href
                articleBodyItems.push('<img src="' + imgSrcPrefix + replaceJcrContent(currentItem.path) + '.img.jpg" />');
            }
            else if (responsiveGridKeys[i] === 'text') {
                // Include the 'text' property of the text component
                articleBodyItems.push(currentItem.text);
            }
            else if (responsiveGridKeys[i] === 'content_fragment') {
                // Include the 'text' property of the content fragment component
                articleBodyItems.push(currentItem.text);
            }
        }
        return articleBodyItems;
	};


    var attachHeroImageToArticles = function(articles, imgSrcPrefix) {
    	for (var i = 0; i < articles.length; i++) {
    		var currentArticle = articles[i];
    		if (typeof currentArticle.root.heroimage === 'object') {
    			var imgSrc = imgSrcPrefix + replaceJcrContent(currentArticle.root.heroimage.path) + '.img.jpg';
    			currentArticle.imgSrc = imgSrc;
    		}
    	}
    	return articles;
    };

	window.weMix.article = {
		transformArticleHtml: transformArticleHtml,
		attachHeroImageToArticles: attachHeroImageToArticles
	};

})();