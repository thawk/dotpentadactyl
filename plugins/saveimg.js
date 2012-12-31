var INFO =
<plugin name="save-images-from-current-tab" version="0.1"
        href="https://g.mozest.com/thread-36889-1-1"
        summary="Save images from current tab"
        xmlns={NS}>
    <info lang="zh-CN" summary="从图像保存当前标签"/>
    <author>weide</author>
    <license href="http://opensource.org/licenses/mit-license.php">MIT</license>
    <project name="Pentadactyl" min-version="1.0"/>
    <p lang="zh-CN">
        本插件为pentadactyl提供了一个命令：<ex>:save-images</ex> 使用该命令可以保存当前标签页中大于指定尺寸的图片到指定路径,并在状态栏显示相关信息。
    </p>
    <note lang="zh-CN">
         可以直接在命令行调用，此时需要给出参数－－保存图片的路径；更方便的用法是：在_pentadactylrc文件中映射为更简洁的快捷键
    </note>
    <p lang="en-US">
        This plugin provides a command for the pentadactyl: <ex>:save-images</ex> to use the command to save the current tab' images that are greater than the specified size to the specified path and in the status bar displays the relevant information.
    </p>
    <note lang="en-US">
         Can be directly invoked on the command line, this time need to give the argument - the path to save the image; more convenient to use are: Mapping documents in the _pentadactylrc shortcuts for the more concise
    </note>

    <item lang="zh-CN">
        <tags>:si :simages :save-images</tags>
        <spec>:save-images <a>path</a></spec>
        <description>
            <ul>
             <li>直接在命令行调用：<example><ex>:save-images</ex> D:\Downloads\pic</example></li>
             <li>在_pentadactylrc文件中:<example>map -modes=n,v  sf -d=保存风景图片 -ex <ex>:save-images</ex> D:\Downloads\风景</example></li>
             <li>在_pentadactylrc文件中:<example>map -modes=n,v  sr -d=保存人物页图片 -ex <ex>:save-images</ex> D:\Downloads\人物</example></li>    
             <li>在_pentadactylrc文件中:<example>map -modes=n,v  nsr -d=在指定路径下新建文件夹保存图片 :save-images D:\Downloads\人物\</example>之后，想要将图片保存到“人物”下的新建文件夹“张三”内,就可以通过如下按键：<example>nsr张三</example></li>    
             <li>在_pentadactylrc文件中:<example>map -modes=n,v  nsf -d=保存风景图片 :save-images D:\Downloads\风景\</example></li>
            </ul>
        </description>
    </item>
    <item lang="en-US">
        <tags>:si :simages :save-images</tags>
        <spec>:save-images <a>path</a></spec>
        <description>
            <ul>
             <li> directly on the command line call: <example><ex>:save-images</ex> D:\Downloads\pic</example></li>
             <li> in _pentadactylrc file: <example><ex>:map</ex> -modes=n,v sf -d=<str>Save images of Scenery</str> -ex <ex>:save-images</ex> D:\Downloads\Scenery</example></li>
             <li> in _pentadactylrc file: <example><ex>:map</ex> -modes=n,v sr -d=<str>Save images of people</str> -ex <ex>:save-images</ex> D:\Downloads\People</example></li>
             <li> in _pentadactylrc file: <example><ex>:map</ex> -modes=n,v nsr -d=<str>Give the specified sub folder of People to save images</str> :save-images D:\Downloads\People\</example> if you want to save the images to the new folder "Joe Smith" under the "people" , through the following key: <example>nsrJoe Smith</example></li>
             <li> in _pentadactylrc file: <example><ex>:map</ex> -modes=n,v nsf-d=<str>Give the specified sub folder of Scenery to save images</str> :save-images D:\Downloads\Scenery\</example></li>
            </ul>
        </description>
    </item>

    <note lang="zh-CN">
        注意事项：为了达到更佳使用效果，请尝试修改代码中的如下常量：
    </note>
    <ul lang="zh-CN">
        <li>minSize 数字，指定要保存图片的最小尺寸</li>
        <li>fileNameLengthToAddDatePrefix 数字，当不含后缀的图片文件名小于或等于该数值时，会在文件名前自动添加日期编码</li>
        <li>fileNameLengthToOverride 数字，当不含后缀的图片文件名大于该数值时，直接覆盖现有文件；否则会在文件名后添加编号以避免覆盖</li>
    </ul>

    <note lang="en-US">
        In order to achieve better results, please try to modify the code in the following constants:
    </note>
    <ul lang="en-US">
        <li> minSize number, specify the minimum size to save the picture</li>
        <li> fileNameLengthToAddDatePrefix figures, when the image file name without the suffix is less than or equal to the value, before the file name will automatically add the date code</li>
        <li> fileNameLengthToOverride figures, when the image file name without the suffix is greater than the value, the direct overwrite the existing file; otherwise, add the number in the file name to avoid overwriting</li>
    </ul> 
</plugin>;

group.commands.add(
    ['save-images', 'si[mages]'],
    'Save images from the current tab',
    function (args) {
        var picdir = args[0];
        
        // == 以下为可以修改的参数 ===
        const minSize = 300;//指定要保存图片的最小尺寸
        const fileNameLengthToAddDatePrefix=8;//当文件名长度（不含后缀名）小于或等于该数值时，文件名前面会自动添加日期编码
        const fileNameLengthToOverride=25;//当文件名长度（不含后缀名）大于该数值时，直接覆盖现有文件
        // == 以上为可以修改的参数 ===
        
        
        
        function getDateString(){
            var date = new Date();          
            return date.getFullYear()+formatNum(date.getMonth(),2)+formatNum(date.getDate(),2);
        }
        
        function formatNum(n,l){
            var str=n.toString();
            for(var i=str.length;i<l;i++) str = "0"+str;
            return str;
        }
    
        if(picdir.length==0) {
            dactyl.echoerr("Must given the path to save images");
            return;
        }else picdir+=IO.PATH_SEP;
        
        const query = ['img[@src and not(starts-with(@src, "data:"))]'];//why not?  and @height>300 and @width>300
        let images = util.evaluateXPath(query);
        
        let tc=0;//count of images that size are greater then minSize
        let sc=0;//count of images that are saved successful
	let kc=0;//count of images that are skipped for same file name
        
        for(var imgElement in images){
            try{
                if(imgElement.height<minSize||imgElement.width<minSize) continue;
                tc++;

                let doc = imgElement.ownerDocument;
                let url = imgElement.src;

                urlSecurityCheck(url, doc.nodePrincipal);
                
                let filename = url.split(/\/+/g).pop();
                var fpre = filename.replace(/\.\w+$/,''); 
                var suffix = filename.match(/\.\w+$/);

                if(fpre.length<=fileNameLengthToAddDatePrefix) fpre = getDateString() + "_" + fpre;

		if(suffix==null) suffix=".jpg";//Sometimes img.src has no suffix,set it .jpg
                
                var f = io.File(picdir+fpre+suffix);
                
                //Dealing with the same file name problem
                if(fpre.length <= fileNameLengthToOverride){
                    var iRe=0;
                    while(f.exists()){
                        iRe++;
                        f = io.File(picdir+fpre+"_"+formatNum(iRe,3)+suffix);
                    }
                }else{
			if(f.exists()){
				kc++;
				continue;
			}
		}
                
                if(!f.exists()) 
                    f.create(0x00,0644);
                
                var persist = Cc['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(Ci.nsIWebBrowserPersist);
                const nsIWBP = Components.interfaces.nsIWebBrowserPersist;
                const flags = nsIWBP.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
                persist.persistFlags = flags | nsIWBP.PERSIST_FLAGS_FROM_CACHE;
                persist.saveURI(makeURI(url), null, null, null, null,f);
                sc++;
            }catch (e) { dactyl.echoerr(e); }
        }
        
        
	var strInfo = picdir + ">Find pics: "+ tc +", Saved successful pics: " + sc;
        if(kc>0)  strInfo += ", Skipped same filename pics: " +kc+". Note:Please check the files are same,or save to another folder.";
        dactyl.echo(strInfo);
    }, {
        argCount: "1",
        literal: 0
    }, true);
