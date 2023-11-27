var self = this;
var PARAM_showDelay = parseInt("[[ {name: 'banner_showDelay', tooltip: 'Time in milliseconds', category: 'Triggers', orderIndex: '10000', isJsonParam: true} : number | 0 ]]", 10);
var notRemoveIfClicked = "true" == ("[[ {name: 'notRemoveBannerIfUserClickedOnIt', tooltip: 'true dafault', category: 'Triggers', orderIndex: '10003', isJsonParam: true } : boolean | true ]]" );
var PARAM_hideDelayConfirmation = parseInt("[[ {name: 'bannerHideDelayAfterConfirmation', tooltip: 'Time in milliseconds', category: 'Triggers', orderIndex: '10004', isJsonParam: true} : number | 0 ]]", 10);
var removeAfter = parseInt("[[ {name: 'removeAfter', tooltip: 'Time in milliseconds', category: 'Triggers', orderIndex: '10001', isJsonParam: true} : number | 2000 ]]", 10);


setTimeout(function () {
    requestAnimationFrame(function () {
        self.sdk.track('banner', getEventProperties('show', false));
        document.body.insertAdjacentHTML('beforeend', self.html);
        var banner = self.banner = document.querySelector('.exponea-subscription-dialog');
        banner.insertAdjacentHTML('afterbegin', '<style>' + self.style + '</style>');
        var form = banner.querySelector('form');
        
        var clicked = false;
        setTimeout(function(){
        	if(!clicked && removeAfter > 0){
        		removeBanner();
        	}
        }, removeAfter);
    
        if(notRemoveIfClicked){
	    	banner.onclick = function(){
	            clicked = true;
	        }
        }
		
        form.onsubmit = function () {
            var eventProperties = getEventProperties('subscribe');
            var email = (form.email.value || '').toLowerCase();
            if (validateEmail(email)) {
                document.querySelector('.exponea-header').innerHTML = "[[ {name: 'successHeader', category: 'Texts', orderIndex: '10008', isJsonParam: true} : string ]]";
                document.querySelector('.exponea-text').innerHTML = "[[ {name: 'successText', category: 'Texts', orderIndex: '10009', isJsonParam: true} : string ]]";
                document.querySelector('.exponea-form').innerHTML = '';
                eventProperties.email = email;
                self.sdk.track('banner', eventProperties);
            	self.sdk.track('consent',{
            		// you can add/adjust your own attributes here. Don't forget to change the category attribute.
					'action' : "accept",
					'category' : "[[ {name: 'consentCategory', category: 'Identifiers', orderIndex: '10000', isJsonParam: true} : string | newsletter ]]",
					'valid_until' : "unlimited",
					'location' : window.location.href,
				    'message' : "[[ {name: 'bodyText', category: 'Texts', orderIndex: '10001', isJsonParam: true} : string ]]",
				    'data_source': "single opt-in weblayer"

                });
                self.sdk.update({
                    email: email
                });
                self.sdk.identify(email);
                if (PARAM_hideDelayConfirmation > 0) {
    				setTimeout(function() {
    					removeBanner();
    				}, PARAM_hideDelayConfirmation);
                }
            }
            return false;
        };
        requestAnimationFrame(function () {
        document.querySelector('.exponea-subscription-dialog').className += ' exponea-animate';
    	});
        var btnClose = banner.querySelector('.exponea-close');
        btnClose.onclick = function () {
            removeBanner();
            self.sdk.track('banner', getEventProperties('close'));
        };
    });
}, PARAM_showDelay);

function getEventProperties(action, interactive) {
    return {
        action: action,
        banner_id: self.data.banner_id,
        banner_name: self.data.banner_name,
        banner_type: self.data.banner_type,
        variant_id: self.data.variant_id,
        variant_name: self.data.variant_name,
        variant_origin: self.data.contextual_personalization != null ? 'contextual personalisation' : 'ABtest',
        interaction: interactive !== false ? true : false,
        location: window.location.href,
        path: window.location.pathname
    };
}

function removeBanner() {
    if (self.banner) {
        self.banner.parentNode.removeChild(self.banner);
    }
    if (self.backdrop) {
        self.backdrop.parentNode.removeChild(self.backdrop);
    }
}

function validateEmail(email) {
    return email && /^\S+@\S+\.\S+$/.test(email);
}
return {
    remove: removeBanner
};