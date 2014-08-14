var app = app || new Object();

app.API = {
    
	prefix: 'http://www.reddit.com',
	
    loadPopularSubs: function() {
       var popular;
	   
	   $.ajax({
            type: 'GET',
            url: this.prefix + "/subreddits/popular.json",
			async: false,
            success: function(data) {
                popular = data.data.children;
            }
        });
		
		return popular;
    },
    
    loadSubmissionsFromReddit: function(sub) {
        var submissions;

        $.ajax({
            type: 'GET',
            url: this.prefix + "/r/" + sub + "/.json",
			async: false,
            success: function(data) {
				submissions = data;
            },
            error: function(data) {
				// @TODO show to the user
                console.log("Subreddit not found!");
            }
        });
		
		return submissions;
    },
    
    loadCommentsFromThread: function(thread) {
        var thread;
        
        $.ajax({
            type: 'GET',
            url: this.prefix + thread + '.json',
			async: false,
            success: function(data) {
				thread = data;
            },
            error: function(data) {
				// @TODO show to the user
                console.log("Thread not found!");
            }
        });
        
        return thread;
    }
    
};

app.Transitions = {
	
	showLoading: function() {
        var load = $("#loadingTpl").html();
        var html = Mustache.render(load, null);
        $("#threads").html(html);
    },
    
    hideLoading: function() {
        $("#threads").html("");
    }

};

app.Storage = {

	addRecentlyView: function(subreddit) {
		var viewed = this.getRecentlyViewed();
		
		// Remove if already viewed to push it in final
		while (true) {
			var pos = $.inArray(subreddit, viewed);
			if (pos != -1) {
				viewed.splice(pos, 1);
			} else {
				break;
			}
		}
		
		viewed.unshift(subreddit);
		localStorage.setItem('lastViewed', JSON.stringify(viewed));
	},
	
	getRecentlyViewed: function() {
		var viewed = localStorage.getItem('lastViewed');
		viewed = JSON.parse(viewed);
		
		if (viewed == null) viewed = new Array();
		return viewed;
	}

};