/*global bd*/

/**
 * Copyright � 2011 Backbase B.V.
 */

/*
 * This file contains all UI configuration options for the Editing UI
 * It will be loaded on demand and store in browser memory
 * templateUrl and widgetChrome are the property name
 * See ICE-287 in Jira
 */
bd.uiEditingOptions = {

    //based on properties of a widget, will display a drop down selector, will use the initial value in the widget property to render the current selection option
    //This is only used for global drop down that are used across multiple widgets.
    widgetPreferenceSelections: {
        widgetChrome: [
            {label: "No Chrome", value: "$(contextRoot)/static/launchpad/chromes/blank/chrome-blank.html"},
            {label: "Default Chrome", value: "$(contextRoot)/static/launchpad/chromes/default/chrome-default.html"},
            {label: "Launcher Tab Chrome", value: "$(contextRoot)/static/launchpad/chromes/launcher/chrome-tab.html"},
            {label: "Launcher Slide Chrome", value: "$(contextRoot)/static/launchpad/chromes/launcher/chrome-slide.html"},
            {label: "Springboard Chrome", value: "$(contextRoot)/static/launchpad/chromes/springboard/chrome-springboard.html"}
        ]
    },

    //enable/disable user & group management, allowing a client to use their own user/group providers
    usersAndGroups: {
        allowManagement: true
    },

    defaultPageTemplates: {
        tablet: "LaunchpadPageTemplate",
        mobile: "LaunchpadPageTemplate",
        smart: "LaunchpadPageTemplate",
        web: "LaunchpadPageTemplate"
    },

    /*
    * portalmanager 5.5 new configuration for devices.
    */

    portalDevices:{
        desktop:[
            {device:'10" Netbook', width:1024, height:768, rotatable:false},
            {device:'15" Notebook', width:1366, height:768, rotatable:false},
            {device:'23" Desktop', width:1920, height:1080, rotatable:false}
        ],
        mobile:[
            {device:'iPhone 5', width:320, height:560, rotatable:true, useragent:'iPhone AppleWebKit'},
            {device:'iPhone 3&4', width:320, height:480, rotatable:true, useragent:'iPhone AppleWebKit'},
            {device:'Galaxy S4', width:540, height:960, rotatable:true, useragent:'smartphone'},
            {device:'Galaxy S3', width:360, height:640, rotatable:true, useragent:'smartphone'},
            {device:'HTC One', width:540, height:960, rotatable:true, useragent:'smartphone'}
        ],
        tablet:[
            {device:'Nexus 10', width:800, height:1280, rotatable:true, useragent:'tablet'},
            {device:'iPad', width:768, height:1024, rotatable:true, useragent:'iPad AppleWebKit'},
            {device:'Galaxy Tab 3', width:600, height:1024, rotatable:true, useragent:'tablet'},
            {device:'Kindle Fire 3', width:800, height:1280, rotatable:true, useragent:'tablet'}
        ]
    },

    //UI properties of the catalog browser
    catalog: {
        //set the max amount of items returned by catalog web-service per each request
        itemsPerRequest: 100
    },

    //the cmis metaData that will show as the attribute in the image tag - ice widget only
    //{ [cmis meta data name] : [attribute name in the image tag] }
    iceWidgetImageMetaData: {
        metaDataList: {
            'bb:altText': 'alt',
            'bb:title': 'title',
            'bb:subTitle': 'subtitle'
        }
    },

    /*
    *   Default SEO Setting
    */

    defaultSEOConf: {
        defaultSEO: [
            {label: 'Locale', name:'bd_seo_locale', value: '', tooltip: 'Set the language of this page.', docLink: ''},
            {label: 'Robots', name:'bd_seo_robots', value: '', tooltip: '<p>Instruct search engines how to handle this page.</p><p><b>Index/No Index:</b> whether search engines may index this page.</p><p><b>Follow/No Follow:</b> whether search engines may follow links on this page.</p>', docLink: ''},
            {label: 'Canonical', name:'bd_seo_canonical', value: '', tooltip: 'Set the canonical URL for this page', docLink: '', type: 'linkRef'},
            {label: 'Description', name:'bd_seo_description', value: '', tooltip: 'Add search terms that describe this page.', docLink: ''}
        ],
        'bd_seo_robots': [
            {name: 'Please select one', value: ''},
            {name: 'Index', value: 'index'},
            {name: 'No Index', value: 'noindex'},
            {name: 'Follow', value: 'follow'},
            {name: 'No Follow', value: 'nofollow'},
            {name: 'Index, Follow', value: 'index, follow'},
            {name: 'No Index, No Follow', value: 'noindex, nofollow'},
            {name: 'None', value: 'none'}
        ],
        'bd_seo_locale': [
            {name: 'Please select one', value: ''},
            {name: 'Arabic (Saudi Arabia)', value: 'ar_SA'},
            {name: 'Arabic (United Arab Emirates)', value: 'ar_AE'},
            {name: 'Chinese (China)', value: 'zh_CN'},
            {name: 'Dutch (Netherlands)', value: 'nl_NL'},
            {name: 'English (Australia)', value: 'en_AU'},
            {name: 'English (South Africa)', value: 'en_ZA'},
            {name: 'English (United Kingdom)', value: 'en_GB'},
            {name: 'English (United States)', value: 'en_US'},
            {name: 'French (France)', value: 'fr_FR'},
            {name: 'German (Germany)', value: 'de_DE'},
            {name: 'Hebrew (Israel)', value: 'iw_IL'},
            {name: 'Hindi (India)', value: 'hi_IN'},
            {name: 'Indonesian (Indonesia)', value: 'in_ID'},
            {name: 'Italian (Italy)', value: 'it_IT'},
            {name: 'Japanese (Japan)', value: 'ja_JP'},
            {name: 'Malay (Malaysia)', value: 'ms_MY'},
            {name: 'Portuguese (Brazil)', value: 'pt_BR'},
            {name: 'Portuguese (Portugal)', value: 'pt_PT'},
            {name: 'Russian (Russia)', value: 'ru_RU'},
            {name: 'Spanish (Spain)', value: 'es_ES'}
        ]
    },

    /**
     * Mapping different CMIS type for different type of file
     */

    cmisTypeData: {
        'text': 'bb:richtext',
        'image': 'bb:image',
        'link': 'bb:link'
    },


    repositoryBrowser: {
        fullCRUDToManagerRole: true,
        maxFileLoadedPerTime: 30,
        autoLoadFile: false,
        // defined what kind of file will be showing up in the embed repo browser (ex. repo browser in designer toolbar and in the rich text editor toolbar)
        // '' = all type, 'image' = image type
        filesType: '',
        // the metaData showing in the preview
        //[cmis meta data name] : [name in the preview] or null for default display name
        metaDataList: {
            'cmis:contentStreamLength': 'Size',
            'cmis:name': 'File Name',
            'cmis:path': 'Path',
            'cmis:createdBy': 'Created By',
            'cmis:lastModifiedBy': 'Last Updated By',
            'cmis:creationDate': 'Creation Date',
            'cmis:lastModificationDate': 'Last Updated Date',
            'bb:altText': 'Alternative Text',
            'bb:title': null,
            'bb:subTitle': null,
            'cmis:versionSeriesId': null
        }
    },

    pageDesigner: {
        enableDNDForContainers: true
    },


    // special to the ckeditor toolbar
    // parentList: Array of containers class names
    // toolbar: array of object defines which buttons will show up
    ckEditorConfigs:[
        {
            parentList: ['bd-contentEditor-div-editable'],
            toolbar: [
                { name: 'basicstyles', items : [ 'Bold','Italic','Subscript','Superscript','-','RemoveFormat' ] },
                { name: 'clipboard',   items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
                { name: 'paragraph',   items : [ 'NumberedList','BulletedList'/*,'-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'*/] },
                { name: 'links',       items : [ 'bindIceMLink','Unlink','Anchor' ] },
                { name: 'insert',      items : [ 'Image','Table','HorizontalRule'] },
                { name: 'styles',      items : [ 'Styles' ] },
                { name: 'styles',      items : [ 'Format' ] },
                // { name: 'styles',      items : [ 'Font' ] },
                // { name: 'styles',      items : [ 'FontSize' ] },
                // { name: 'iceImage', items : [ 'OpenAssetPicker','OpenImageInfo','RemoveImage' ] }
                //common out because the firefox acting differently
                //,{ name: 'colors',      items : [ 'TextColor','BGColor' ] }
            ]//use default - show all tool
        },
        {
            parentList: ['bd-nicEdit-AdvanceContentTemplate', 'bd-notEditable'],
            toolbar: [
                { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo' ] }
            ]
        },
        {
            parentList: ['bd-contentArea'],
            toolbar: [
                { name: 'basicstyles', groups: [ 'basicstyles' ], items: [ 'Bold', 'Italic', '-', 'Subscript','Superscript' ] },
                { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo' ] },
                { name: 'paragraph', groups: [ 'list', 'align' ], items:['NumberedList', 'BulletedList', '-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock' ]},
                { name: 'links', items:['bindIceMLink', "Unlink"]},
                { name: 'styles',      items : [ 'Styles' ] },
                { name: 'styles',      items : [ 'Format' ] }
                // { name: 'styles',      items : [ 'Font' ] },
                // { name: 'styles',      items : [ 'FontSize' ] }
            ]
        },
        {
            parentList: ['bd-contentEditor-div-editable', 'bd-image', 'bd-imgArea'],
            toolbar: [
                { name: 'iceImage', items : [ 'OpenAssetPicker','OpenImageInfo','RemoveImage' ] }
            ]
        },
        {
            parentList: ['bd-contentEditor-div-editable', 'bd-linkArea', 'bd-contentArea'],
            toolbar: [
                { name: 'links', items:["bindIceMLink"]}
                // { name: 'links', items:["bindIceLink", "unbindIceLink"]}
            ]
        }
    ],

    // bd.customStylesSelector: it has to be set to the style set name(eg. bbTemplate or sample) in case to use the correct style set
    //      otherwise, it will use the default style set from the ckEditor

    // special to the ckeditor toolbar, see http://docs.ckeditor.com/#!/api/CKEDITOR.config
    // contentCss : String/Array
    //      The CSS file(s) to be used to apply style to the contents. It should reflect the CSS used in the final pages where the contents are to be used.
    // stylesSet : String/Array/Boolean
    //      The "styles definition set" to use in the editor. They will be used in the styles combo and the style selector of the div container.
    configStylesSet : {
        bbTemplate: {
            contentCss : bd.contextRoot + '/static/backbase.com.2011.ice/css/ice-ckeditorContent.css',
            styleSet : [
                {name:'Branding',element:'span',attributes:{'class' : 'bd-BrandingText'}},
                {name:'Link',element:'span',attributes:{'class' : 'bd-iceLink'}},
                {name:'Bold Red Text',element:'span',attributes:{'class' : 'bbTemplate-redBold'}},
                {name:'Yellow Background',element:'span',attributes:{'class' : 'bbTemplate-yellowBg'}},
                {name:'Green Borders',element:'span',attributes:{'class' : 'bbTemplate-borderGreen'}}
            ]
        },
        sample: {
            contentCss : bd.contextRoot + '/static/backbase.com.2011.ice/css/ice-ckeditorContent.css',
            styleSet: [
                {name:'Branding',element:'span',attributes:{'class' : 'bd-BrandingText'}},
                {name:'Link',element:'span',attributes:{'class' : 'bd-iceLink'}}
            ]
        },
        // title used as a prefix: '.bbTemplate-className {...}'
        lp: {
            '<div class="lp-tagline">Tagline</div>': 'tagline',
            '<div class="lp-tagline-banner">Banner</div>': 'tagline-banner',
            '<div class="lp-btn">Info</div>': 'btn',
            '<div class="lp-btn-primary">Primary</div>': 'btn-primary'
        }
    },

    //assetsPicker
    assetsPicker: {
        filterBy: {
            'PNG': 'image/png'
        },

        metaDataList: {
            'bb:title': 'Title',
            'bb:altText': 'Alternative',
            'cmis:path': 'Path',
            "cmis:contentStreamMimeType": 'Base Type',
            'cmis:objectTypeId': 'Object Type',
            'cmis:contentStreamLength': 'Size',
            'cmis:createdBy': 'Created By',
            'cmis:creationDate': 'Creation Date',
            'cmis:lastModifiedBy': 'Last Updated By',
            'cmis:lastModificationDate': 'Last Updated Date'

            //'cmis:name':'File Name',
            //'bb:subTitle':null,
            //'cmis:versionSeriesId':null
        }
    },
    //Filter out element tags and attribute when paste extenal source to ICE widget.
    whiteList:{
        allowedTags: ['section','nav','artical','aside','h1','h2','h3','h4','h5','h6','hgroup','footer','address','main',
                       'p','hr','pre','blockquote','ol','ul','li','dl','dt','dd','div','figure','figcaption',
                       'a','em','strong','small','s','cite','q','dfn','abbr','code','i','b','u','mark','span','br','wbr',
                       'ins','img','video','audio','canvas','table','caption','colgroup','col','tbody','thead','tfoot','tr','td','th',
                       '#text'],
        // allowedAttr: ["src","alt", "href"],
        allowedAttr: ["class"],
        allowedTagAttr: {
            "a"         : ["href", "title", "data-ice-link-ref", "data-ice-content-path"],
            "blockquote": ["cite"],
            "col"       : ["span", "width"],
            "colgroup"  : ["span", "width"],
            "img"       : ["align", "alt", "height", "src", "title", "width", "data-ice-content-path", "data-ice-content-preview"],
            "ol"        : ["start", "type"],
            "q"         : ["cite"],
            "table"     : ["summary", "width"],
            "td"        : ["abbr", "axis", "colspan", "rowspan", "width"],
            "th"        : ["abbr", "axis", "colspan", "rowspan", "scope", "width"],
            "ul"        : ["type"],
        }
    },

    //A list of files types is allowed to drop on canvas.
    AllowedDNDTypes:{
        typeList:['bb:richtext', 'image', 'cmis:folder', 'cmis:document']
    },
    //default behaviour for creating widget
    defaultDNDJsonData: {
        //WThe json contains properties of widget when drop image file.
        imageFile: {
            namePrefix: "widget-advanced-content-",
            extendedItemName: "widget-advanced-content",
            //The required preferences for the image and text widget. All properties are case sensitive.
            preferences: {
                TemplateName: {
                    name: "TemplateName",
                    value: "Standard_Widget",
                    type: "string"
                },
                title: {
                    name: "title",
                    value: "Image",
                    type: "string",
                    label: "Title",
                    viewHint: "text-input,user"
                },
                src: {
                    name: "src",
                    value: "$(contextRoot)/static/launchpad/widgets/advanced-content-template/index.html",
                    type: "string"
                },
                templateUrl: {
                    name: "templateUrl",
                    value: "$(contextRoot)/static/launchpad/html/content/image.html",
                    type: "string",
                    label: "Content Template",
                    viewHint: "text-input,designModeOnly,user"
                },
                widgetChrome: {
                    name: "widgetChrome",
                    value: "$(contextRoot)/static/launchpad/chromes/blank/chrome-blank.html",
                    type: "string",
                    label: "Widget Chrome",
                    viewHint: "select-one,designModeOnly,user"
                }
            },
            contentRefName: "contentPath",
            targetFile: ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/bmp"]
        },
        //The json contains properties of widget when drop text file.
        richTextFile: {
            namePrefix: "widget-advanced-content-",
            extendedItemName: "widget-advanced-content",
            preferences: {
                TemplateName: {
                    name: "TemplateName",
                    value: "Standard_Widget",
                    type: "string"
                },
                title: {
                    name: "title",
                    value: "Text Content",
                    type: "string",
                    label: "Title",
                    viewHint: "text-input,user"
                },
                src: {
                    name: "src",
                    value: "$(contextRoot)/static/launchpad/widgets/advanced-content-template/index.html",
                    type: "string"
                },
                templateUrl: {
                    name: "templateUrl",
                    value: "$(contextRoot)/static/launchpad/html/content/text.html",
                    type: "string",
                    label: "Content Template",
                    viewHint: "text-input,designModeOnly,user"
                },
                widgetChrome: {
                    name: "widgetChrome",
                    value: "$(contextRoot)/static/launchpad/chromes/blank/chrome-blank.html",
                    type: "string",
                    label: "Widget Chrome",
                    viewHint: "select-one,designModeOnly,user"
                }
            },
            contentRefName: "advContent",
            targetFile: ["text/html", "text/plain"]
        }
    }
};


bd.customStylesSelector = 'lp';