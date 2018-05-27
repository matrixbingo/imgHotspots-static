jQuery.extend({ 
})

$.fn.extend({
	getSerializeObject:function(){
		var o = {};
	    $.each(this.serializeArray(), function (index) {
	        if (o[this['name']]) {
	            o[this['name']] = o[this['name']] + "," + this['value'];
	        } else {
	            o[this['name']] = this['value'];
	        }
	    });
	    return o;
	}
});