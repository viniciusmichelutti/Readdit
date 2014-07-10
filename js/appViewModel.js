function RedditViewModel() {

	this.popularSubReddits = ko.observable();
	this.submissions = ko.observable();
	this.responses = ko.observable(); // To show comments, not implemented yet!
	this.lastVisited = ko.observable(app.Storage.getRecentlyViewed());

	this.getPopularSubReddits = function() {
		location.hash = 'subreddits';
	};

	this.getSubmissions = function(subreddit) {
		if (Object.prototype.toString.call(subreddit) != '[object String]') {
			subreddit = subreddit.url;
		}
		subreddit = subreddit.replace('/r/', '').replace('/', '');
		location.hash = '/r/' + subreddit;
	};
	
	this.goToReddit = function() {
		window.location.href = 'http://www.reddit.com' + location.hash.replace('#', '');
	};
	
	this.searchReddit = function(form) {
		var subreddit = $(form).find('input').val();
		this.getSubmissions(subreddit);
	};
	
	this.scoreClass = function(number) {
		return (number <= 0) ? 'negative' : 'positive';
	};
	
	this.getThumbnail = function(thumbnail) {
		if (thumbnail == 'self' || thumbnail == 'default') thumbnail = 'photo.jpg';
		return thumbnail;
	};
	
	var _this = this;
	Sammy(function() {
		this.get('#/r/:subreddit', function() {
			var subreddit = this.params.subreddit;
			$('#searchsubreddit').val(subreddit); // Fill in the search field
			
			_this.popularSubReddits(null);
			_this.submissions(app.API.loadSubmissionsFromReddit(subreddit).data.children);
			
			app.Storage.addRecentlyView(subreddit);
			_this.lastVisited(app.Storage.getRecentlyViewed());
			
			// console.log(_this.submissions());
		});
		
		this.get('#subreddits', function() {
			_this.submissions(null);
			_this.popularSubReddits(app.API.loadPopularSubs());
		});
		
		this.get('', function() {
			this.app.runRoute('get', '#subreddits');
		});
	}).run();

}

ko.applyBindings(new RedditViewModel());