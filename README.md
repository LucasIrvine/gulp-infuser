insert js/css resources into .java files and wrapping in
wicket resource render js method. Can also be used to inject files into
other file types.

usage:<br>in your .java file, your resources will be inserted between these markers (or you can specify your own with your config):
```
//**infuse_boundary
//**infuse_boundary
```
In your gulp file:

```
var config = {
    resources : ['myJavascriptOne.js', 'myJavascript2.js'],
    pathWrap : 'response.renderJavaScriptReference(new PackageResourceReference(ToolsWebApplicationResourceBase.class,//**infuse_file));',
    pathPrefix : '../../', //optional
    boundaryMarker: '//**infuse_file' //optional (showing default)
};
//for pathWrap an use either placeholder in a string (above)- //**infuse_file
//or array - ['tag/method open','tag/method close'];

gulp.task('infuseResources', function() {
    return gulp.src('path/to/java/file.java')
        .pipe(infuser(config))
        .pipe(gulp.dest(path/to/java/directory));
});
```
You can then set up separate gulp tasks for dev (not concatenated or minified) and default (concatenated and minified):

```
// Dev Task
gulp.task('dev', ['lint', 'sass', 'injectResources', 'watch']);
// Default Task
gulp.task('default', ['lint', 'sass', 'scripts','injectMinifiedResources', 'watch']);
```
