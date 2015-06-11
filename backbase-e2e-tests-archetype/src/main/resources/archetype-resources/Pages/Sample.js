module.exports = (function() {

		var samplePage = function() {
			this.header = element.all(by.css('h1')).first();
			this.infoLink = element.all(by.css('a')).first();
		}

		samplePage.prototype = {

			get:function(){
				browser.driver.get('http://www.example.com/');
			},

			moreInfo:function(){
				this.infoLink.click();
			}
		}

	return samplePage;
}) ();