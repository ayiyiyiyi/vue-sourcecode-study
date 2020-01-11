
    let tags = 'div,p,a,img,i,ul,li'.split(',');
    
    function makeMap(allTag) {
        let set = {};
        allTag.forEach(key => {
            set[key] = true;
        });
        return function (tagName) {
            tagName = tagName.toLowerCase();
            return !!set[tagName];
        }
    }
    let isHtmlTag = makeMap(tags);
