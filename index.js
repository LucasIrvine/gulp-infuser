var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
// consts
const PLUGIN_NAME = 'gulp-infuser';
//main file level funct
function gulpInfuser(config) {
    if(!config.resources) {
        throw new PluginError(PLUGIN_NAME,'Missing resource files!');
    }
    // creating a stream through which each file will pass
    var stream = through.obj(function (file, enc, cb) {
        if(file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME,'Streams are not supported!'));
            return cb();
        }
        if(file.isBuffer()) {
            var srcFileString = file.contents.toString();
            //methods
            var infuser = {
                boundaryTag: config.optionalBoundaryMarker || '//**infuse_boundary',
                pathPrefix: config.optionalPathPrefix || '',
                fileTag: '//**infuse_file',
                escQuot: '\"',
                joinSym: '\r\n',
                //accepts string or an array with length of 2
                getBookEnds: function () {
                    self = this;
                    //if config.pathwrap is array, leave it, else break it up with //**infuse_file marker
                    if(config.pathWrap.constructor === Array && config.pathWrap.length === 2) {
                        self.bookEnds = config.pathWrap;
                    } else if(typeof config.pathWrap === 'string' && config.pathWrap.indexOf(self.fileTag) !== -1) {
                        self.bookEnds = config.pathWrap.split(self.fileTag);
                    } else {
                        throw new PluginError(PLUGIN_NAME,'Resource wrap not formatted correctly, can either be a string with marker -> //**infuse_file, or an Array with a length === 2');
                        return cb();
                    }
                    //chainable
                    return self;
                },
                wrapFiles: function () {
                    self = this;
                    //map to a new array with bookends
                    var resourceArray = config.resources.map(function (filePath) {
                            //assemble a resource line for each
                            return [self.bookEnds[0], self.escQuot, self.pathPrefix, filePath, self.escQuot, self.bookEnds[1]].join('');
                        });
                    //join with purrrty line breaks
                    self.resourceArray = resourceArray.join(self.joinSym);
                    //chainable
                    return self;
                },
                editFile: function () {
                    self = this;
                    //split src file string at the defined boundry markers
                    var fileArray = srcFileString.split(self.boundaryTag);
                    //assemble the string to make the Buffer
                    fileArray[1] = [self.boundaryTag, self.joinSym, self.resourceArray.toString(), self.joinSym, self.boundaryTag].join('');
                    //write the file contents with new Buffer
                    file.contents = new Buffer(fileArray.join(''));
                }
            };
            //call actual methods
            infuser.getBookEnds().wrapFiles().editFile();
        }
        // make sure the file goes through the next gulp plugin
        this.push(file);
        // tell the stream engine that we are done with this file
        cb();
    });
    // returning the file stream
    return stream;
};
// exporting the plugin main funct
module.exports = gulpInfuser;
