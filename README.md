# 3 Dreams of Black
This project takes you on a journey through three dream worlds constructed through a combination of rich 2D drawings and animations interwoven with interactive 3D sequences. 
Throughout various points in these dream worlds, you can grab your pointer and guide the protagonist's point of view through the experience. This music experience also includes a 3D model creator that allows you to create your own relics and contribute to the shared collective dream. "3 Dreams of Black" is written and directed by Chris Milk, and developed with a few folks here at Google.

- - -
## About this Repository
This repository mirrors the active <http://www.ro.me/> site and has been opened up with the _Apache License 2.0_ so that it is easier to look at the inner-workings of this project. This is meant to accompany the explanations on the [tech page](http://www.ro.me/tech/). As such there are probably some things you'll want to know in order to make your spelunking easier, namely the folder structure: 

Three Dreams of Black runs on _Google AppEngine_. This makes the repository's ***/deploy*** folder the root of the server, in case you wanted to run it locally in the browser. Other than that the folder directory is as follows:

* archive/: Canvas HTML5 splash page preview before the actual site was up.
* deploy/: The actual project that is visible when going to <http://www.ro.me/>
  * asset_viewer/: Contents of the asset viewer found on <http://www.ro.me/tech/>
  * files/: All media concerning the project. Including but not limited to gif, png, jpg, and css files.
  * gallery/: JavaScript and HTML related to <http://www.ro.me/gallery/>
  * js/: All JavaScript files for the primary experience, the film.
  * tech/: JavaScript and HTML related to <http://www.ro.me/tech/>
* index.html: A page to view all of the tests created.
* tests/: All of the tests and sketches
* utils/: All python scripts used in order to "export" the written script to the minified version on <http://www.ro.me/>
