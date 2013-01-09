var GALLERY = function(params) {

  if (params == undefined) {
    params = {};
  }

  params['page'] = parseInt(params['page']);
  if (isNaN(params['page'])) params['page'] = 1;

  params['category'] = params['category'] || 'everyone';


  var OBJECTS_PER_PAGE = 15;
  var LOCAL_STORAGE_VOTE_PREFIX = 'vote';

  var gallery = $('#gallery');
  var galleryInner = $('#gallery .inner');
  var maxWidthCSS = gallery.css('max-width');

  var shade = $('#shade');
  var lightbox = $('#lightbox');

  var maxWidth = parseInt(maxWidthCSS.replace('px', ''));
  var activeImage;
  var lightboxOpen = false;

  var activeObject = undefined; // The one in the lightbox ...
  var objectData, objectWidth;

  var itemHTML = [
    '<div class="object" id="object-%id%">',
    '<div class="img-wrapper"><img width="300" style="background-image: url(%img%)" src="images/place-holder.gif" alt=""/></div>',
    '<div class="object-title">',
    '%title%',
    '</div>',
    '<div class="vote-box">',
    '<a href="#" class="%upvote% upvote vote"></a>',
    '<a href="#" class="%downvote% downvote vote"></a>',
    '</div>',
    '</div>'].join("\n");

  populateObjects();
  createPagination();

  function createPagination() {

    $.ajax({
          url: GALLERY.API_BASE + 'metadata/' + params['category'],
          success: function(data) {
            if (!data.success) {
              error(data.error);
            } else {

              var numPages = Math.ceil(data.count / OBJECTS_PER_PAGE);

              if (numPages == 1) return;

              var ul = document.getElementById('pagination');

              var addPageLi = function(i) {
                var classDec = i == params['page'] ? ' class="selected"' : '';
                var url = '?c=' + params['category'] + '&p=' + i;
                ul.innerHTML += '<li' + classDec + '><a href="' + url + '">' + i + '</a></li>';
              };

              var addHellipLi = function(i) {
                ul.innerHTML += '<li class="hellip"> &hellip; </li>';
              };

              if (numPages <= 5) {

                for (var i = 1; i <= numPages; i++) {
                  addPageLi(i);
                }

              } else if (params['page'] < 3) {

                addPageLi(1);
                addPageLi(2);
                addPageLi(3);
                addHellipLi();
                addPageLi(numPages);

              } else if (params['page'] > numPages - 2) {

                addPageLi(1);
                addHellipLi();
                addPageLi(numPages - 2);
                addPageLi(numPages - 1);
                addPageLi(numPages);

              } else {

                addPageLi(1);
                if (params['page'] - 2 != 1) addHellipLi();
                addPageLi(params['page'] - 1);
                addPageLi(params['page']);
                addPageLi(params['page'] + 1);
                if (params['page'] + 2 != numPages) addHellipLi();
                addPageLi(numPages);

              }


            }
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
                  toAdd = toAdd.replace(/%img%/g, value.thumbnail_url+'=s1440' || '/gallery/images/not-found.jpg');
                  toAdd = toAdd.replace(/%id%/g, value.id);

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
                galleryInner[0].innerHTML += '<div class="clear"></div>'
                init();
              },
          error: error('Error fetching object data.')
        });

  }


  function init() {

    objectWidth = $('div.object').outerWidth(true);

    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();

    $('.img-wrapper img').hover(function() {
      activeImage = this;
    }, function() {
      activeImage = undefined;
    });


    $('#' + params['category']).addClass('selected');

    $('#lightbox-close').click(closeLightbox);

    $('#lightbox-prev').click(function() {

      var prev = objectData.indexOf(activeObject) - 1;
      if (prev < 0) prev = objectData.length - 1;
      populateLightbox(objectData[prev]);

    });



    $('#lightbox-next').click(function() {

      var next = objectData.indexOf(activeObject) + 1;
      if (next >= objectData.length) next = 0;
      populateLightbox(objectData[next]);

    });

    $('.object .img-wrapper').each(function(key) {
      $(this).click(openLightbox(key));
    });

    $('#gallery .upvote').click(function() {
      doVote(objectData[$(this).index('.upvote')].id, true);
      return false;
    });

    $('#gallery .downvote').click(function() {
      doVote(objectData[$(this).index('.downvote')].id, false);
      return false;
    });

    $('#lightbox-upvote').click(function() {
      doVote(activeObject.id, true);
      $('#lightbox-upvote').addClass('selected');
      $('#lightbox-downvote').removeClass('selected');
      return false;
    });

    $('#lightbox-downvote').click(function() {
      doVote(activeObject.id, false);
      $('#lightbox-upvote').removeClass('selected');
      $('#lightbox-downvote').addClass('selected');
      return false;
    });

    if (GALLERY.GET['id'] !== undefined ) {
      $.getJSON(GALLERY.API_BASE + 'objects/' + GALLERY.GET['id'] + '?property=title', function(data) {
        openLightbox()();
        populateLightbox(data);
      });
    }

  }

  function doVote(objectID, up) {

    var sendVote = function(objectID, up, onComplete) {

      var url = GALLERY.API_BASE + 'objects/' + objectID + '/' + ( up ? 'up' : 'down' ) + 'vote';

      $.ajax({
            url: url,
            type: 'POST',
            success: function() {
              onComplete(true)
            },
            error: function() {
              onComplete(false)
            }
          });

    };

    sendVote(objectID, up, function(success) {
      if (up) {
        if (!success) return;
        localStorage.setItem(LOCAL_STORAGE_VOTE_PREFIX + objectID, 1);
        $('#gallery .object#object-' + objectID + ' .upvote').next().removeClass('selected');
        $('#gallery .object#object-' + objectID + ' .upvote').addClass('selected');
      } else {
        if (!success) return;
        localStorage.setItem(LOCAL_STORAGE_VOTE_PREFIX + objectID, 0);
        $('#gallery .object#object-' + objectID + ' .downvote').prev().removeClass('selected');
        $('#gallery .object#object-' + objectID + ' .downvote').addClass('selected');
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
      if (index !== undefined) {
        populateLightbox(objectData[index]);
      }
    }
  }

  function populateLightbox(data) {
    activeObject = data;
    history.pushState(null,activeObject.title,window.location.pathname+"?id="+activeObject.id)
    $('#lightbox-title').html(activeObject.title);
    var savedVote = localStorage.getItem(LOCAL_STORAGE_VOTE_PREFIX + activeObject.id);
    if (savedVote == 1) {
      $('#lightbox-upvote').addClass('selected');
      $('#lightbox-downvote').removeClass('selected');
    } else if (savedVote == 0) {
      $('#lightbox-downvote').addClass('selected');
      $('#lightbox-upvote').removeClass('selected');
    } else {
      $('#lightbox-upvote').removeClass('selected');
      $('#lightbox-downvote').removeClass('selected');
    }
    $('#webgl').html($('<iframe style="border: 0;" width="100%" height="100%" src="/gallery/viewer.html#' + activeObject.id + '"></iframe>'));
    $('#lightbox-experience').attr('href', '/?id=' + activeObject.id)
  }

  function closeLightbox() {
    lightboxOpen = true;
    lightbox.fadeOut(200);
    shade.get(0).removeEventListener('mousedown', closeLightbox, false);
    $('#webgl').html('');
  }

  function error(message) {
    return function(jqXHR, msg) {
      console.log(message);
    };
  }

  var frameCount = 0
  this.update = function() {
    frameCount++;
    if (activeImage != undefined) {
      activeImage.frameCount = activeImage.frameCount == undefined ? 0 : activeImage.frameCount;
      if (frameCount % 10 == 0) {
        activeImage.frameCount++
      }
      var img = $(activeImage);
      img.css('backgroundPosition', '0 ' + (-activeImage.frameCount * img.height()) + 'px');
    }
  }

};
