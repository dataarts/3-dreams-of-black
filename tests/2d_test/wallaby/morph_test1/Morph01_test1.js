function wlby_calc_timeout(c) {
    var timeout = (new Date).getTime();
    while (c) {
        timeout += parseFloat(getComputedStyle(c)['-webkit-animation-duration']) * 1000;
        c.timeout = Math.round(timeout);
        c = c.nextElementSibling;
    }
}
var wlby_hide_children = function(self) {
    var c = self.firstElementChild;
    while (c) {
        c.style.display = 'none';
        c = c.nextElementSibling;
    }
}
var wlby_activate_sibling = function(evt, self) {
    if (evt.srcElement != self)
        return;
    if (self.style.display == 'none')
        return;
    if (!self.timeout)
        wlby_calc_timeout(self);
	self.style.display = 'none';
    var sibling = self.nextElementSibling;
    if (!sibling)
        return;
    while ((sibling.timeout < evt.timeStamp)&&sibling.nextElementSibling)
        sibling = sibling.nextElementSibling;
//    $('.wlby_fs', sibling).css('display', 'none');
//    var n = new Number((sibling.timeout - (new Date).getTime()) / 1000);
//    sibling.style.webkitAnimationDuration = n.toString() + 's';
    sibling.style.display = 'block';
};
var wlby_activate_children = function(evt, self) {
    if (evt.srcElement != self)
        return;
    wlby_hide_children(self);
    var c = self.firstElementChild;
	if(!c)
		return;
//    $('.wlby_fs', c).css('display', 'none');
    wlby_calc_timeout(c);
    c.style.display = 'block';
	c.style.webkitAnimationDelay = '';
}
var wlby_loop_children = function(evt, self) {
    if (evt.srcElement != self)
        return;
    wlby_activate_children(evt, self);
    var c = self.firstElementChild;
    if (!c)
        return;
    c.style.webkitAnimationDelay = '0s';
}
$(document).ready(function() {
    $('.wlby_sprite').each(function()
		{ this.addEventListener('webkitAnimationIteration', function(evt) { wlby_loop_children(evt, this); return false; }, false, false) });
    $('.wlby_sprite, .wlby_graphic').each(function()
		{ this.addEventListener('webkitAnimationStart', function(evt) { wlby_activate_children(evt, this); return false; }, false, false) });
    $('.wlby_fs').each(function()
		{ this.addEventListener('webkitAnimationEnd', function(evt) { wlby_activate_sibling(evt, this); return false; }, false, false) });
});
