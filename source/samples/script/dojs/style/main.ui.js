var dojs=require("dojs");

dojs.page.allowClose(ui("do_ALayout_back"));

//css的风格可定义在script/do/defaultSetting/styleSetting.js里
dojs.style.css(ui("do_ALayout_topbar"), "pageTopbar");
dojs.style.css(ui("do_ALayout_back"), "dynamicButton");

dojs.style.css(ui("do_Button_ok"), "dynamicButton");
dojs.style.css(ui("do_ALayout_bar1"), "navigatorCell");
dojs.style.css(ui("do_ALayout_bar2"), "navigatorCell");
dojs.style.css(ui("do_ALayout_bar3"), "navigatorCell");
