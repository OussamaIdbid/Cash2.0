var Browser = {};
Browser.UserAgent = navigator.userAgent.toLowerCase();
Browser.Mozilla = false;
Browser.IE = false;
Browser.Firefox = false;
Browser.Netscape = false;
Browser.Safari = false;
Browser.Chrome = false;
Browser.Opera = false;
Browser.Edge = false;
Browser.Version = undefined;
Browser.MajorVersion = undefined;
Browser.WindowsPlatform = false;
Browser.MacOSPlatform = false;
Browser.MacOSMobilePlatform = false;
Browser.AndroidMobilePlatform = false;
Browser.PlaformMajorVersion = false;
Browser.WindowsPhonePlatform = false;
Browser.AndroidDefaultBrowser = false;
Browser.AndroidChromeBrowser = false;
Browser.SamsungAndroidDevice = false;
Browser.WebKitTouchUI = false;
Browser.MSTouchUI = false;
Browser.TouchUI = false;
Browser.WebKitFamily = false;
Browser.NetscapeFamily = false;
Browser.HardwareAcceleration = false;
Browser.VirtualKeyboardSupported = false;
Browser.Info = "";
function indentPlatformMajorVersion(userAgent) {
    var regex = /(?:(?:windows nt|macintosh|mac os|cpu os|cpu iphone os|android|windows phone|linux) )(\d+)(?:[-0-9_.])*/;
    var matches = regex.exec(userAgent);
    if (matches)
        Browser.PlaformMajorVersion = matches[1];
}
function getIECompatibleVersionString() {
    if (document.compatible) {
        for (var i = 0; i < document.compatible.length; i++)
            if (document.compatible[i].userAgent === "IE" && document.compatible[i].version)
                return document.compatible[i].version.toLowerCase();
    }
    return "";
}
function IdentUserAgent(userAgent, ignoreDocumentMode) {
    var browserTypesOrderedList = ["Mozilla", "IE", "Firefox", "Netscape", "Safari", "Chrome", "Opera", "Opera10", "Edge"];
    var defaultBrowserType = "IE";
    var defaultPlatform = "Win";
    var defaultVersions = { Safari: 2, Chrome: 0.1, Mozilla: 1.9, Netscape: 8, Firefox: 2, Opera: 9, IE: 6, Edge: 12 };
    if (!userAgent || userAgent.length == 0) {
        fillUserAgentInfo(browserTypesOrderedList, defaultBrowserType, defaultVersions[defaultBrowserType], defaultPlatform);
        return;
    }
    userAgent = userAgent.toLowerCase();
    indentPlatformMajorVersion(userAgent);
    try {
        var platformIdentStrings = {
            "Windows": "Win",
            "Macintosh": "Mac",
            "Mac OS": "Mac",
            "Mac_PowerPC": "Mac",
            "cpu os": "MacMobile",
            "cpu iphone os": "MacMobile",
            "Android": "Android",
            "!Windows Phone": "WinPhone",
            "!WPDesktop": "WinPhone",
            "!ZuneWP": "WinPhone"
        };
        var optSlashOrSpace = "(?:/|\\s*)?";
        var version = "(\\d+)(?:\\.((?:\\d+?[1-9])|\\d)0*?)?";
        var optVersion = "(?:" + version + ")?";
        var patterns = {
            Safari: "applewebkit(?:.*?(?:version/" + version + "[\\.\\w\\d]*?(?:\\s+mobile\/\\S*)?\\s+safari))?",
            Chrome: "(?:chrome|crios)(?!frame)" + optSlashOrSpace + optVersion,
            Mozilla: "mozilla(?:.*rv:" + optVersion + ".*Gecko)?",
            Netscape: "(?:netscape|navigator)\\d*/?\\s*" + optVersion,
            Firefox: "firefox" + optSlashOrSpace + optVersion,
            Opera: "(?:opera|\sopr)" + optSlashOrSpace + optVersion,
            Opera10: "opera.*\\s*version" + optSlashOrSpace + optVersion,
            IE: "msie\\s*" + optVersion,
            Edge: "edge" + optSlashOrSpace + optVersion
        };
        var browserType;
        var version = -1;
        for (var i = 0; i < browserTypesOrderedList.length; i++) {
            var browserTypeCandidate = browserTypesOrderedList[i];
            var regExp = new RegExp(patterns[browserTypeCandidate], "i");
            if (regExp.compile)
                regExp.compile(patterns[browserTypeCandidate], "i");
            var matches = regExp.exec(userAgent);
            if (matches && matches.index >= 0) {
                if (browserType == "IE" && version >= 11 && browserTypeCandidate == "Safari")
                    continue;
                browserType = browserTypeCandidate;
                if (browserType == "Opera10")
                    browserType = "Opera";
                var tridentPattern = "trident" + optSlashOrSpace + optVersion;
                version = GetBrowserVersion(userAgent, matches, tridentPattern, getIECompatibleVersionString());
                if (browserType == "Mozilla" && version >= 11)
                    browserType = "IE";
            }
        }
        if (!browserType)
            browserType = defaultBrowserType;
        var browserVersionDetected = version != -1;
        if (!browserVersionDetected)
            version = defaultVersions[browserType];
        var platform;
        var minOccurenceIndex = Number.MAX_VALUE;
        for (var identStr in platformIdentStrings) {
            if (!platformIdentStrings.hasOwnProperty(identStr)) continue;
            var importantIdent = identStr.substr(0, 1) == "!";
            var occurenceIndex = userAgent.indexOf((importantIdent ? identStr.substr(1) : identStr).toLowerCase());
            if (occurenceIndex >= 0 && (occurenceIndex < minOccurenceIndex || importantIdent)) {
                minOccurenceIndex = importantIdent ? 0 : occurenceIndex;
                platform = platformIdentStrings[identStr];
            }
        }
        var samsungPattern = "SM-[A-Z]";
        var matches = userAgent.toUpperCase().match(samsungPattern);
        var isSamsungAndroidDevice = matches && matches.length > 0;
        if (platform == "WinPhone" && version < 9)
            version = Math.floor(getVersionFromTrident(userAgent, "trident" + optSlashOrSpace + optVersion));
        if (!ignoreDocumentMode && browserType == "IE" && version > 7 && document.documentMode < version)
            version = document.documentMode;
        if (platform == "WinPhone")
            version = Math.max(9, version);
        if (!platform)
            platform = defaultPlatform;
        if (platform == platformIdentStrings["cpu os"] && !browserVersionDetected)
            version = 4;
        fillUserAgentInfo(browserTypesOrderedList, browserType, version, platform, isSamsungAndroidDevice);
    } catch (e) {
        fillUserAgentInfo(browserTypesOrderedList, defaultBrowserType, defaultVersions[defaultBrowserType], defaultPlatform);
    }
}function getVersionFromMatches(matches) {
    var result = -1;
    var versionStr = "";
    if (matches[1]) {
        versionStr += matches[1];
        if (matches[2])
            versionStr += "." + matches[2];
    }
    if (versionStr != "") {
        result = parseFloat(versionStr);
        if (isNaN(result))
            result = -1;
    }
    return result;
}
function getVersionFromTrident(userAgent, tridentPattern) {
    var tridentDiffFromVersion = 4;
    var matches = new RegExp(tridentPattern, "i").exec(userAgent);
    return getVersionFromMatches(matches) + tridentDiffFromVersion;
}
function GetBrowserVersion(userAgent, matches, tridentPattern, ieCompatibleVersionString) {
    var version = getVersionFromMatches(matches);
    if (ieCompatibleVersionString) {
        var versionFromTrident = getVersionFromTrident(userAgent, tridentPattern);
        if (ieCompatibleVersionString === "edge" || parseInt(ieCompatibleVersionString) === versionFromTrident)
            return versionFromTrident;
    }
    return version;
}function fillUserAgentInfo(browserTypesOrderedList, browserType, version, platform, isSamsungAndroidDevice) {
    for (var i = 0; i < browserTypesOrderedList.length; i++) {
        var type = browserTypesOrderedList[i];
        Browser[type] = type == browserType;
    }
    Browser.Version = Math.floor(10.0 * version) / 10.0;
    Browser.MajorVersion = Math.floor(Browser.Version);
    Browser.WindowsPlatform = platform == "Win" || platform == "WinPhone";
    Browser.MacOSPlatform = platform == "Mac";
    Browser.MacOSMobilePlatform = platform == "MacMobile";
    Browser.AndroidMobilePlatform = platform == "Android";
    Browser.WindowsPhonePlatform = platform == "WinPhone";
    Browser.WebKitFamily = Browser.Safari || Browser.Chrome || Browser.Opera && Browser.MajorVersion >= 15;
    Browser.NetscapeFamily = Browser.Netscape || Browser.Mozilla || Browser.Firefox;
    Browser.HardwareAcceleration = (Browser.IE && Browser.MajorVersion >= 9) || (Browser.Firefox && Browser.MajorVersion >= 4) ||
        (Browser.AndroidMobilePlatform && Browser.Chrome) || (Browser.Chrome && Browser.MajorVersion >= 37) ||
        (Browser.Safari && !Browser.WindowsPlatform) || Browser.Edge || (Browser.Opera && Browser.MajorVersion >= 46);
    Browser.WebKitTouchUI = Browser.MacOSMobilePlatform || Browser.AndroidMobilePlatform;
    var isIETouchUI = Browser.IE && Browser.MajorVersion > 9 && Browser.WindowsPlatform && Browser.UserAgent.toLowerCase().indexOf("touch") >= 0;
    Browser.MSTouchUI = isIETouchUI || (Browser.Edge && !!window.navigator.maxTouchPoints);
    Browser.TouchUI = Browser.WebKitTouchUI || Browser.MSTouchUI;
    Browser.MobileUI = Browser.WebKitTouchUI || Browser.WindowsPhonePlatform;
    Browser.AndroidDefaultBrowser = Browser.AndroidMobilePlatform && !Browser.Chrome;
    Browser.AndroidChromeBrowser = Browser.AndroidMobilePlatform && Browser.Chrome;
    if (isSamsungAndroidDevice)
        Browser.SamsungAndroidDevice = isSamsungAndroidDevice;
    if (Browser.MSTouchUI) {
        var isARMArchitecture = Browser.UserAgent.toLowerCase().indexOf("arm;") > -1;
        Browser.VirtualKeyboardSupported = isARMArchitecture || Browser.WindowsPhonePlatform;
    } else {
        Browser.VirtualKeyboardSupported = Browser.WebKitTouchUI;
    }
    fillDocumentElementBrowserTypeClassNames(browserTypesOrderedList);
}
function fillDocumentElementBrowserTypeClassNames(browserTypesOrderedList) {
    var documentElementClassName = "";
    var browserTypeslist = browserTypesOrderedList.concat(["WindowsPlatform", "MacOSPlatform", "MacOSMobilePlatform", "AndroidMobilePlatform",
        "WindowsPhonePlatform", "WebKitFamily", "WebKitTouchUI", "MSTouchUI", "TouchUI", "AndroidDefaultBrowser", "MobileUI"]);
    for (var i = 0; i < browserTypeslist.length; i++) {
        var type = browserTypeslist[i];
        if (Browser[type])
            documentElementClassName += "dx" + type + " ";
    }
    documentElementClassName += "dxBrowserVersion-" + Browser.MajorVersion;
    if (document && document.documentElement) {
        if (document.documentElement.className != "")
            documentElementClassName = " " + documentElementClassName;
        document.documentElement.className += documentElementClassName;
        Browser.Info = documentElementClassName;
    }
}
IdentUserAgent(Browser.UserAgent);

export { Browser as B };
