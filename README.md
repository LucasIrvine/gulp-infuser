# gulp-infuser

insert js/css resources into .java files and wrapping in
wicket resource render js method. Can also be used to inject files into
other file types.

usage:<br>in your .java file, your resouces will be inserted between these markers:
```
//**infuse_boundary
//**infuse_boundary
```
In your gulp file:
```
var javaFolder = 'path/to/java/folder/';
var javaFile = 'myJava.java';
var pathPrefix = '../../'; //optional
var pathWrap = 'response.renderJavaScriptReference(new PackageResourceReference(ToolsWebApplicationResourceBase.class,//**infuse_file));';

//for pathWrap an use either placeholder in a string (above)- //**infuse_file
//or array - [tag/method open','tag/method close'];

gulp.task('infuseResources', function() {
    return gulp.src(javaFolder + javaFile)
        .pipe(infuser(resourceArray, pathWrap, pathPrefix))
        .pipe(gulp.dest(javaFolder));
});
