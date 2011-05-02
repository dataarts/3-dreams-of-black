var GALLERY = function(params) {

  if (params == undefined) {
    params = {};
  }

  params['page'] = parseInt(params['page']);
  if (isNaN(params['page'])) params['page'] = 1;

  params['category'] = parseInt(params['category']);
  if (isNaN(params['category'])) params['category'] = 0;

  var OBJECTS_PER_PAGE = 15;
  var LOCAL_STORAGE_VOTE_PREFIX = 'vote';

  var gallery = $('#gallery');
  var galleryInner = $('#gallery .inner');
  var maxWidthCSS = gallery.css('max-width');

  var shade = $('#shade');
  var lightbox = $('#lightbox');

  var maxWidth = parseInt(maxWidthCSS.replace('px', ''));
  var objectWidth = $('div.object').outerWidth();

  var lightboxOpen = false;

  var objectData;

  var itemHTML = [
    '<div class="object" id="object-%id%">',
    '<div class="img-wrapper"><img src="%img%" alt="%title%"/></div>',
    '<div class="object-title">',
    '%title%',
    '</div>',
    '<div class="vote-box">',
    '<a href="#" class="%upvote% upvote vote"></a>',
    '<a href="#" class="%downvote% downvote vote"></a>',
    '</div>',
    '</div>'].join("\n");

  createPagination();
  populateObjects();

  function createPagination() {

    $.ajax({
          url: GALLERY.API_BASE + 'metadata/' + params['category'],
          success: function(data) {
            console.log('There are ' + data.count + ' objects in this category.');
          },
          error: error('Error fetching object totals.')

        });

  }

  function populateObjects() {

    $.ajax({
          url: GALLERY.API_BASE + 'objects?offset=' + (params['page'] - 1) * OBJECTS_PER_PAGE + '&limit=' + OBJECTS_PER_PAGE + '&category=' + params['category'],
          success:
              function(data) {
                objectData = data;
                $.each(data, function(key, value) {
                  var toAdd = itemHTML;
                  toAdd = toAdd.replace(/%title%/g, value.title);
                  toAdd = toAdd.replace(/%img%/g, GALLERY.API_BASE + 'objects/' + value.id + '/thumbnail');

                  var savedVote = localStorage.getItem(LOCAL_STORAGE_VOTE_PREFIX + value.id);

                  if (savedVote == 1) {
                    toAdd = toAdd.replace(/%upvote%/g, 'selected');
                    toAdd = toAdd.replace(/%downvote%/g, '');
                  } else if (savedVote == 0) {
                    toAdd = toAdd.replace(/%upvote%/g, '');
                    toAdd = toAdd.replace(/%downvote%/g, 'selected');
                  } else {
                    toAdd = toAdd.replace(/%upvote%/g, '');
                    toAdd = toAdd.replace(/%downvote%/g, '');
                  }

                  galleryInner[0].innerHTML += toAdd;

                });
                init();
              },
          error: error('Error fetching object data.')
        });

  }

  function init() {

    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();

    $('#lightbox-close').click(closeLightbox);
    $('.object .img-wrapper').each(function(key) {
      $(this).click(openLightbox(key));
    });

    $('.upvote').click(function() {

      var _this = this;

      vote($(this).index('.upvote'), true, function(success, id) {
        if (!success) return;
        localStorage.setItem(LOCAL_STORAGE_VOTE_PREFIX + id, 1);
        $(_this).next().removeClass('selected');
        $(_this).addClass('selected');
      });

      return false;

    });

    $('.downvote').click(function() {

      var _this = this;

      vote($(this).index('.downvote'), false, function(success, id) {
        if (!success) return;
        localStorage.setItem(LOCAL_STORAGE_VOTE_PREFIX + id, 0);
        $(_this).prev().removeClass('selected');
        $(_this).addClass('selected');
      });

      return false;

    });

  }

  /**
   * Upvote or downvote.
   *
   * @param index int relative to start of page where 0 is first object
   * @param up boolean, true = upvote, false = downvote
   * @param onComplete function should take in one boolean param indicating success
   */
  function vote(index, up, onComplete) {

    var objectID = objectData[index].id;

    var url = GALLERY.API_BASE + 'object/' + objectID + '/' + ( up ? 'up' : 'down' ) + 'vote';

    $.ajax({
          url: url,
          success: function() {
            onComplete(true, objectID)
          },
          error: function() {
            onComplete(false, objectID)
          }
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

  function openLightbox(index) {
    return function() {
      lightbox.fadeIn(200);
      shade.get(0).addEventListener('mousedown', closeLightbox, false);

      populateLightbox(objectData[index]);

    }
  }

  function populateLightbox(data) {
    $('#lightbox-title').html(data.title);
    //var savedVote = localStorage.getItem(LOCAL_STORAGE_VOTE_PREFIX + data.id);
    // TODO thumbs up and down
  }

  function closeLightbox() {
    lightboxOpen = true;
    lightbox.fadeOut(200);
    shade.get(0).removeEventListener('mousedown', closeLightbox, false);
  }

  function error(message) {
    return function(jqXHR, msg) {
      alert(message);
    };
  }

};