var GALLERY = function(params) {

  if (params == undefined) {
    params = {};
  }

  params['page'] = parseInt(params['page']);
  if (isNaN(params['page'])) params['page'] = 1;

  params['category'] = parseInt(params['category']);
  if (isNaN(params['category'])) params['category'] = 0;

  console.log(params);

  var OBJECTS_PER_PAGE = 15;

  var gallery = $('#gallery');
  var galleryInner = $('#gallery .inner');
  var maxWidthCSS = gallery.css('max-width');

  var shade = $('#shade');
  var lightbox = $('#lightbox');

  var maxWidth = parseInt(maxWidthCSS.replace('px', ''));
  var objectWidth = $('div.object').outerWidth();

  var lightboxOpen = false;

  var itemHTML = [
    '<div class="object">',
    '<div class="img-wrapper"><img src="%img%" alt="%title%"/></div>',
    '<div class="object-title">',
    '%title%',
    '</div>',
    '<div class="vote-box">',
    '<a href="#" class="upvote vote"></a>',
    '<a href="#" class="downvote vote"></a>',
    '</div>',
    '</div>'].join("\n");

  createPagination();
  populateObjects();

  function createPagination() {

    $.ajax({
      url: GALLERY.API_BASE + 'objects?offset=' + (params['page'] - 1) * OBJECTS_PER_PAGE + '&limit=' + OBJECTS_PER_PAGE + '&category=' + params['category'],
      success:
        function(data) {
          $.each(data, function(key, value) {
            var toAdd = itemHTML;
            toAdd = toAdd.replace(/%title%/g, value.title);
            toAdd = toAdd.replace(/%img%/g, GALLERY.API_BASE + 'objects/' + value.id + '/thumbnail');
            galleryInner[0].innerHTML += toAdd;
          });
          init();
        },
      error: error
    });

  }

  function populateObjects() {

    $.ajax({
      url: GALLERY.API_BASE + 'objects?offset=' + (params['page'] - 1) * OBJECTS_PER_PAGE + '&limit=' + OBJECTS_PER_PAGE + '&category=' + params['category'],
      success:
        function(data) {
          $.each(data, function(key, value) {
            var toAdd = itemHTML;
            toAdd = toAdd.replace(/%title%/g, value.title);
            toAdd = toAdd.replace(/%img%/g, GALLERY.API_BASE + 'objects/' + value.id + '/thumbnail');
            galleryInner[0].innerHTML += toAdd;
          });
          init();
        },
      error: error
    });

  }

  function init() {

    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();

    $('#lightbox-close').click(closeLightbox);

    $('.object .img-wrapper').click(function() {

      lightbox.fadeIn(200);
      shade.get(0).addEventListener('mousedown', closeLightbox, false);

    });

    $('.upvote').click(function() {

      if (GALLERY.onupvote($(this).index('.upvote'))) {
        $(this).next().removeClass('selected');
        $(this).addClass('selected');
      }

      return false;

    });

    $('.downvote').click(function() {

      if (GALLERY.ondownvote($(this).index('.downvote'))) {
        $(this).prev().removeClass('selected');
        $(this).addClass('selected');
      }

      return false;

    });

  }

  function onWindowResize() {

    var newWidth;
    if (window.innerWidth < maxWidth) {
      newWidth = objectWidth * 3;
    } else {
      newWidth = maxWidth;
    }
    galleryInner.width(newWidth);

    shade.height(document.body.offsetHeight);

  }

  function closeLightbox() {
    lightboxOpen = true;
    lightbox.fadeOut(200);
    shade.get(0).removeEventListener('mousedown', closeLightbox, false);
  }

  function error(jqXHR, message) {
    alert(message);
  }

};