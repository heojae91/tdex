// ==UserScript==
// @name         Twitch DCCon Addon
// @namespace    twitch_extension
// @version      1.2.0
// @description  Replace a dccon command text with image.
// @author       Jirap
// @include      https://go.twitch.tv/*
// @include      https://www.twitch.tv/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      https://cdn.rawgit.com/zenorocha/clipboard.js/v1.7.1/dist/clipboard.min.js
// ==/UserScript==

(function() {
"use strict";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 외부 라이브러리를 이곳에 정의합니다.

// jQuery 
// Copyright JS Foundation and other contributors, https://js.foundation/
// MIT License

// clipboard.js
// Copyright Zeno Rocha, https://clipboardjs.com/
// MIT License

// parseUri 1.2.2
// Copyright 2007 Steven Levithan
// MIT License
function parseUri(str) {
  var	o = parseUri.options,
    m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
    uri = {},
    i   = 14;

  while (i--) uri[o.key[i]] = m[i] || "";

  uri[o.q.name] = {};
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2;
  });

  return uri;
};

parseUri.options = {
  strictMode: false,
  key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
  q:   {
    name:   "queryKey",
    parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
    loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 스크립트에서 사용하는 리소스를 이곳에 정의합니다.

const kResourceCSSTDEX = '#tdex-ui-window-container,.tdex-ui-box-container,.tdex-ui-box-content-old,.tdex-ui-box-margin{position:absolute;width:100%;height:100%}.tdex-ui-button,.tdex-ui-switch-bg{border-style:solid;display:inline-block}body{margin:0}#tdex-ui-window-container{margin:0;z-index:10001;top:0;left:0}.tdex-ui-box-container{z-index:10002}.tdex-ui-box-margin{background-color:#000;opacity:0;z-index:10003}.tdex-ui-box-margin.tdex-ui-box-margin-visible{opacity:.9}.tdex-ui-box-content{position:relative;width:100%;height:100%;z-index:10009}.tdex-ui-box-content-old{left:-100%;top:0;z-index:10009}.tdex-ui-box-1,.tdex-ui-box-big,.tdex-ui-box-medium,.tdex-ui-box-small{margin:0;position:absolute;width:800px;left:calc(50% - 400px);background-color:#4b367c;color:#F3F3F3;z-index:10010;font-family:"맑은 고딕"}.tdex-ui-box-small{height:260px;top:calc(50% - 200px);overflow:hidden}.tdex-ui-box-1{height:320px;top:calc(50% - 220px)}.tdex-ui-box-medium{height:420px;top:calc(50% - 260px);overflow:hidden}.tdex-ui-box-big{height:600px;top:calc(50% - 320px);overflow:hidden}.tdex-ui-switch,.tdex-ui-switch-container{width:fit-content}.tdex-ui-switch{margin-top:5px}.tdex-ui-switch-has-tooltip .tdex-ui-switch-container::after{content:"끔";position:relative;top:-4px;left:10px;font-size:15px}.tdex-ui-switch-has-tooltip.tdex-ui-switch-state-on .tdex-ui-switch-container::after{content:"켬"}.tdex-ui-switch-bg{border-width:3px;border-color:#C3C3C3;border-radius:15px;width:46px;height:21px;background-color:#3F3F3F}.tdex-ui-switch-fg{position:relative;border-radius:13px;width:13px;height:13px;top:1px;left:1px;margin:0;background-color:#C3C3C3;transition:left .3s;-webkit-transition:left .3s}.tdex-ui-switch-bg:hover{border-color:#E7E7E7}.tdex-ui-switch-bg:hover .tdex-ui-switch-fg{background-color:#E7E7E7}.tdex-ui-switch-state-on .tdex-ui-switch-bg{background-color:rgba(16,78,154,.75)}.tdex-ui-switch-state-on .tdex-ui-switch-fg{left:26px}.tdex-ui-button{margin:0;padding:0 17px;border-width:2px;border-color:transparent;background-color:#C3C3C3;color:#333;text-align:center;min-width:80px;height:35px;line-height:31px;font-size:15px}.tdex-ui-button:hover{border-color:#E7E7E7}.tdex-ui-textarea{resize:none;border:none;font-family:"맑은 고딕";color:#E7E7E7;background-color:#3F3F3F}.tdex-ui-textarea:focus{color:#000;background-color:#F3F3F3}.tdex-ui-box-ds,.tdex-ui-ds-previewer-name,.tdex-ui-license-img::after{font-family:"맑은 고딕";color:#F3F3F3}.tdex-ui-box-ds,.tdex-ui-box-ds-previewer{position:absolute;bottom:60px;z-index:10008;background-color:#4b367c;box-shadow:0 0 3px 3px rgba(181,221,253,.2)}.tdex-ui-box-small .tdex-ui-bigdick{width:100%;height:100%;line-height:250px;text-align:center}.tdex-ui-box-1 .tdex-ui-bigdick{width:100%;height:100%;line-height:300px;text-align:center}.tdex-ui-bigdick span{font-size:60px}.tdex-ui-license-img::after{content:attr(data-a-uri);font-size:16px;margin-left:10px}.tdex-ui-license-img img{width:20px;height:20px}.tdex-ui-box-ds{margin:0;width:310px;height:460px;right:20px;overflow:hidden}.tdex-ui-ds-list-container{overflow-y:auto;margin-top:20px;margin-left:5px;width:300px;height:415px}.tdex-ui-box-ds-previewer{right:340px;width:110px;height:135px}.tdex-ui-ds-previewer-name{margin-top:3px;margin-left:5px;font-size:12px}.tdex-ui-ds-previewer-image{margin-top:5px;margin-left:5px;width:100px;height:100px}ul.tdex-ui-ds-list{list-style:none;margin:0;padding:0}.tdex-ui-ds-list li{display:inline-block;width:40px;height:40px}.tdex-ui-dccon-icon img{cursor:pointer;width:100%;height:100%}.tdex-ui-ds-button-container{position:relative;cursor:pointer;left:210px;top:10px}.tdex-ui-ds-button{margin-left:10px;display:inline-block}.tdex-ui-ds-button img{width:20px;height:20px}.tdex-ui-layout-tcb3-title{position:relative;top:30px;padding:0 45px}.tdex-ui-layout-tcb3-title span{font-size:30px}.tdex-ui-layout-tcb3-clientarea{margin-top:60px;padding:0 45px;font-size:15px}.tdex-ui-layout-tcb3-button-container{position:absolute;bottom:25px;right:35px}.tdex-ui-button.tdex-ui-button-hasgap{margin:0 0 0 30px}@keyframes tdex-ui-kf-fadeinout{0%,100%{opacity:0}38%,55%{opacity:1}}@keyframes tdex-ui-kf-slideout-left{from{left:0}to{left:-100%}}@keyframes tdex-ui-kf-slidein-right{from{left:100%}to{left:0}}.tdex-ui-ani-fadeinout-5s{opacity:0;animation:tdex-ui-kf-fadeinout 5s}.tdex-ui-ani-fadeinout-4s{opacity:0;animation:tdex-ui-kf-fadeinout 4s}.tdex-ui-ani-slideout-left-1s{animation:tdex-ui-kf-slideout-left 1s}.tdex-ui-ani-slidein-right-1s{animation:tdex-ui-kf-slidein-right 1s}.tdex-ui-style-full-width{width:100%}.tdex-ui-style-text-bold{font-weight:700}';
// https://icons8.com/icon/14099/Settings
const kResourceIconSettings = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADwklEQVRogc1aW5HrMAwthEAIhEIIhEIohDAIhEIIhEIIhEAIhEA49yNSLT8lO+ntamZnd9aypCPLkmzndvsCAdiQp/0bOi8nAH0BBFP3aztVAjCQsUtibKGx4Qem1RGAkYx9JcZeNDb+wrYbgA5Ab+SdydhnYoxBvo2y7nWWloV1AN5WTwreR2LskQu7BO8TwA5gbbVdCpMgmIrehMtYfUZeMXMRzxzobAcTgNjIQ0x7uGGJn0OnZCgDfSbGBjG+A5gArM1gEiB68X8WDBybd6Dfu8WDcJlLyrgHMpaMTjuYHIiAZ0KaFhz7oFgniCcMWbkKXcBfD4YmsWemAt+dgLLy6gwjVoJBRAlC8I6Cz6YLrqhBm6R530olOTi6BXZuXQ2S4XXayhNEEbKQLXOrgI0ERFX6f5HYj1vz6gchNlxrokn/XYRUdv9YhX0240X2WfXKTHU+IsgrnC1MS0srOZEhO/2s5BRTxoHrAtSEYyK4diGbigPlL+hk8rCQVb/JE4ZxjPYKL9cVXj2u+ncc6fMBv5BGbU5Gf1U05ASxYq1RlPG8lEKBgC1soMEG5tXrBxky4KieL7jYZipmDBECi9VzwkDNSbJZBY76NpOTh0+kBAaHtEM5O8CdMeytwy3azJqjUn2ZRzfx90KeHT2kukETza9OkWKuaTPD7TWOnCUCUmuEEM57o7pgydU8of8yIBuJ6BvmqidGg4zLgJjSc2Zud4H+PxFa3Ms1d9gRELi0NqKiQYRLvWrlT8ydWLeRP1UmPkBK6XfTlMDvxfoKEPKwpKXfBdb7ZLi0NiO+INBOiZzn1fuqxJxi6oXLbOysFSJyYCnAMDZt8A9ha2ll4F9uqD2U4J1MRheUMmWNI17ZNLLiQcjh2OZwKl42CJkmwBYwMxtWyV+ixWIYKiu/JoxTpLlo4YjrGX5bv1GYmNI0/CPE0AxACGSvbKeXt07vdZcftBp8VB2uMbFaP06tCvzDUnWxu4rg30TWRwQaDkvfIuFQc53iiaZ71qsAanLgl4GnVajpnhXuLWNDY7EiAyeSsSpOk0de/SQa7I0oU8Fd+aR6tLdlUyL9psKUekT1nhXMTsuBQXADQiHINcMDVJAtz987ybvDvyr6tDnNIApgJuHBFenHzpqntwlB24O4zRlPgciAYZpLAgXYiAfGo21ihdtBJMDsMGQMATzakHAFTn0+g3iePg1CCK35YCD7dYMIPev1T3cZiFqC27RRNyBC5jefcNQQ3IkuylwofBXx5wh+Fc5R/2s7TQTlQuMbOv8BpvCtKWMyesQAAAAASUVORK5CYII=";
// https://icons8.com/icon/40068/rotate
const kResourceIconRefresh = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADCUlEQVR4nO2bbZXzIBCFK6ESIqESIqESKqEOKqESKqESkBAJkRAJz/sDetqFSRpgINl9ub/2bLLMzGU+CXs4NDQ0NDQ0FAVwBM7ADbgDBhiAaWvdisEZfX0Zygy21lMdQA885wyOJWDtOpsT7Hb8vrTbf5aAlYYbbA64Yr3kBBxXrL1fArC7/lhh9ClDxj4JwO7gsGB4ryTnG6YcglOVOiG7/IB18a+uHSFLMng7EoBuRgmjafiHPB9HZM8rT8KC8HsJ453MH/j4vVRqx1J6LAm9FRN4mCfAPbsL+gylFLlKO19E2E+5swS45xIJF20lpLgfirrbW/YiAe4dPywnoNNUwmd5rGG8k72GgE7wgqeWAtLuX1QWXyf/KwHuvbNAwllDAeMtarIXjZO/igD3rp+k87wA2/D46LMWjdchhoBe0LfLEe5nfp24itNhNQHu/dH7k2uOcN+litZ8DQibltYXYLs+P/l1uurqw+mdHwaEWbVMh1UAhIk7PgwEVyre9WmBsG+JD13Cg46LvqplgD2E+UR88iZMgPlNRSUI4ZtEgN9f1z11yQBhaxz//YGwnnb6qpYBYSVIIsAvgVWGHy14uscfjv6xEBhTFjHeIr2+qmVAOMPE9zCEtTS9p64M4OLp/khZ5OYtsvs54AU0mjjCWhofRxuBsIdJaoV1horKQHOIQ2OoqAzBc9OHOMJkUvU4LAWC+6fnrpkw2G0/gHwklqevwOhuzwWEkM33WOQz991NhkLsg1bzRng2sKuS6ELV3329A1zkXLCbhCiEqd7ufwiRPkJufkxGzY+2gpvBhr3BjPHlPtoyf0Gi+pxAOKtAjY+2yFUBKuUE5m+mTdQa2ZEbjpf7XQrLnbsfVLc0Yw8dxgUiOkVZS9dvx2o7Lygm1d9PPFM9gvcN8wfzt1CNJtHJQC6REhk37IDVvxR3hnZYjzqz4oa5e1bsZloSnAGPFUTkwrDjgexFhPnvDPeBdfNrJhmGzMvWuwDv/x65YXOB4V1BJvfz4J7d3bu/2+iGhoaGhl+AfxN5xrrsvEymAAAAAElFTkSuQmCC";
// https://icons8.com/icon/14093/info
const kResourceIconInfo = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADFElEQVR4nO2bXZHDMAyEC6EQAqEQAqEQCqEMAiEQAqEQDCEQAiEQvnuwM72zldaJpaSdy87cTB8ya2ktyX+60+nAgQMHDhwwBXAGrkADtIADemAMfz3wALrwzXVvm4sRnL7/cnQNHoGj2tufbAB1MFwb7qOFwM94y/rZzkX7cUJkOu7w+X3HR8kFL9o5/L4Ct/BNnyPE3n5Ps95lOH1ZyX0PHLP8Fn7lGnh5MVMOqDcaq18jsIZBUsj3YdbORuPegEEYd9QU/J0R1YzzzsrxaPwzclqM5pEQBpdCsd3C+ciWVrBjMLUDeX1vzAZ8b08jRaLVYHdp5k0GW2ZXZ24Xct73W4f9HJBrQqU5QJxvtrm2EPjaNEQ2PrTIpdm/KfD+gQLfVYiC8lVBCC+VIqMtQOCMV6i+lPAiqForGWshgGRvVUIYV36dvDrZCBB446X6rkm225qfC/x2uTwN8JU1Ln6Vrrn6CHaXpwFpVS0rKBuCtBguTwPS/N9915cL0i3y8tQl3WLelI38A2XuOHqXF2/SAqh6VW0sQB3RL9+7CHmketY2FiAuhOMakiEiqZSN/HgB4iVQ9fBjKYAK/5enQBXRD2tIXERSKxtpKUB8Jli+hyG9A1i/p5b5LQWIt8PdGpImIlE9BxgLUL6JI91MLM+j1/yWApSfCNE6VMzzmwiA5iGOtBCq1QFDAfQOcaTFRO3O3VAAvTsM5DRQ2Q9YCEB6Bii3V1BU5V7ASACnHrGkuypQOBlqC4B8LV6X8k7kXUSsuiSWAvnFWO0Cd64W7NedEQH50bbWHkR6jt79mowtH22FMAPlM8JCeyTn7R5tmW+Q2Py9ALk3YDBz/tfA0qoAG9UE5jvTNu0TkjYcU/jdjMeVInBk6/5i/KXD8EKISnGsV+23w2YzLxg217E14bE2Inh2mHfMd6E6TaFXA3mJlMRo8AesejI8OFrxbJfN6TAf2aEz7SWCA12GEKVwbN0ZugRBCPfvHI+BD/N3zc45Tjdf5bgEnp3fDb4WOJ4ryBh+T/8204Zvv9vpAwcOHDjwBfgBtQhTSh4iTvYAAAAASUVORK5CYII=";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 스크립트에서 사용하는 상수를 이곳에 정의합니다.

const kDebug                            = false;

const kPlatformUserScript               = (typeof(GM_xmlhttpRequest) !== "undefined");
const kPlatformFirefox                  = !kPlatformUserScript && (typeof(browser)  !== "undefined");
const kPlatformChrome                   = !kPlatformUserScript && (typeof(chrome)   !== "undefined");

const kPageTypeNoChattingRoom           = 0;  // this page did not have chat container.
const kPageTypeOldChattingRoom          = 1;  // www.twitch.tv/[streamer name]*
const kPageTypeOldRecordedChattingRoom  = 2;  // www.twitch.tv/video/[video index]
const kPageTypeBetaChattingRoom         = 3;  // go.twitch.tv/[streamer name]*
const kPageTypeBetaRecordedChattingRoom = 4;  // reserved
const kPageTypeNewChattingRoom          = 5;  // reserved
const kPageTypeNewRecordedChattingRoom  = 6;  // reserved

const kStorageSettings                  = "TDEX_SETTINGS";
const kStorageBaseSettings              = "TDEX_BASE_SETTINGS";
const kStorageStreamerSettings          = "TDEX_STREAMER_SETTINGS";
const kStorageJSAssistDCConList         = "TDEX_JSASSIST_DCCONLIST";
const kStorageStreamerSpecificDCConList = "TDEX_STREAMER_SPECIFIC_DCCONLIST";

const kSettingsDefaultPageInspectorUpdateRate   = 1000;
const kSettingsDefaultWaitObjectPoolUpdateRate  = 500;

const kSettingsBSPageInspectorUpdateRate = "TDEX_BS_PAGEINSPECTOR_UPDATE_RATE";
const kSettingsBSWaitObjectPoolUpdateRate= "TDEX_BS_WAITOBJECTPOOL_UPDATE_RATE";
const kSettingsBSDCConImageSize          = 100; 
const kSettingsBSEnableApp               = "TDEX_BS_ENABLE_APP";
const kSettingsBSEnableJODL              = "TDEX_BS_ENABLE_JSASSIST_DCCONLIST";
const kSettingsBSEnableLimitedJODL       = "TDEX_BS_ENABLE_LIMITED_JSASSIST_DCCONLIST";
const kSettingsBSEnableAskAtFirst        = "TDEX_BS_ENABLE_ASK_AT_FIRST";
const kSettingsSSEnableAddon             = "TDEX_SS_ENABLE_ADDON";
const kSettingsSSEnableJODL              = "TDEX_SS_ENABLE_JODL";
const kSettingsSSEnableLimitedJODL       = "TDEX_SS_ENABLE_LIMITED_JODL";
const kSettingsSSEnableSSDL              = "TDEX_SS_ENABLE_SSDL";
const kSettingsSSSSDLUri                 = "TDEX_SS_SSDL_URI";
const kSettingsSSConverter               = "TDEX_SS_SSDL_CONVERTER";

const kUriHomePage                      = "https://github.com/gjirap/tdex"
const kUriUpdateJson                    = "https://api.myjson.com/bins/17gnwh";
const kUriJSAssistDCConList             = "https://gist.githubusercontent.com/rishubil/2bbfa7028cff75b7a0fbdf532717d4b7/raw/529b9d139589e3cb5af2bf4e1b16917a8e048e12/xunz.json";

const kWaitableStateBad                 = 0;
const kWaitableStateGood                = 1;
const kWaitableStateSpecial             = -1;

const kEvtObserverOnAdded               = 1;
const kEvtObserverOnRemoved             = 2;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Firefox 와 Chrome 의 경우 이제 Web Extension API 를 공유하기 때문에 서로 포팅이 간편하지만 
// Userscript 의 경우는 그렇지 않아 Userscript 용으로 배포할 때도 정상적으로 동작하도록 해당 스크립트에서 사용하는 Web Extension API 를 흉내내도록 구현함.
let   NS_userscript                     = (!kPlatformUserScript ? undefined : (function() {
  let gmAddStyle      = GM_addStyle;
  let gmGetValue      = GM_getValue;
  let gmSetValue      = GM_setValue;
  let gmListValues    = GM_listValues;
  let gmDeleteValue   = GM_deleteValue;
  let gmXHR           = GM_xmlhttpRequest; 

  /* Firefox 와 Chrome 에서는 content_scripts 를 이용해서 css 를 사용하지만
   * UserScript 는 이 기능이 없기 때문에 UsrScript 에서도 스크립트가 정상적으로 동작하기 위해
   * PageInspector 를 통해 페이지가 변경될 때 마다 직접 css 를 삽입해주기 위함.
   */
   let css_injector = (function() {
    function us_css_injector() {
      this._observerId = null;
    }

    us_css_injector.prototype.init = function() {
      this._observerId = tdex.PageInspector.getInstance().addObserver(this.onPageChange.bind(this));
      tdex.debug.log("NS_userscript::css_injector.init() >> PageInspector's observer id is " + this._observerId);
    };

    us_css_injector.prototype.inject = function() {
      gmAddStyle(kResourceCSSTDEX);
      tdex.debug.log("NS_userscript::css_injector.inject() >> css was injected.");
    };

    us_css_injector.prototype.onPageChange = function(e) {
      if (tdex.IsCommonEvent(e)) {
        return;
      }
      this.inject();
    };

    let s_instance = new us_css_injector();
    s_instance = null;
    return({
      getInstance: function() {
        if (!s_instance) {
          s_instance = new us_css_injector();
          s_instance.init();
        }
        return(s_instance);
      },

      destroyInstance: function() {
        s_instance = null;
      }
    })
  })(); // let css_injector = ...

  let storage = (function() {
    let local = (function() {
      function get(keys, callback) {
        let pairs = {};
        if (typeof(keys) === "string") {
          let v = gmGetValue(keys);
          if (v !== undefined) {
            pairs[keys] = v;
          }
        }
        else {
          keys.forEach((key) => {
            let v = gmGetValue(key);
            if (v !== undefined) {
              pairs[key] = v;
            }
          });
        }
        callback(pairs);
      }

      function set(pairs, callback) {
        for (let prop in pairs) {
          gmSetValue(prop, pairs[prop]);
        }
        if (callback !== undefined) {
          callback();
        }
      }

      function clear() {
        gmListValues().forEach(key => { gmDeleteValue(key); });
      }

      return({
        get: get,
        set: set,
        clear: clear
      });
    })(); // let local = ...

    return({
      local: local
    });
  })(); // let storage = ...
  
  return({
    storage: storage,
    css_injector: css_injector
  });
})()); // let NS_userscript = ...
XMLHttpRequest.prototype.clear = function() {
  this.abort();
  this.readyState = 0;
};
// Userscript 에서 XMLHttpRequest 를 사용하면 CORS 때문에 타 웹 사이트에 접근을 못 하길래 
// gm_xmlhttpRequest 를 사용해서 XMLHttpRequest 를 흉내내도록 구현함.
const XHR                                 = !kPlatformUserScript ? (function() { return(new XMLHttpRequest()); }) : (function() {
  function Bridge() {
    this.method        = null;
    this.responseText  = "";
    this.responseBody  = null;
    this.responseURL   = null;
    this.status        = null;
    this.readyState    = 0;
    this.uri           = null;
    this.onreadystatechange = null;
  }

  Bridge.prototype.open = function(m, u, d) {
    this.readyState  = 1;
    this.method      = m;
    this.uri         = u;
    if (this.onreadystatechange !== null) {
      this.onreadystatechange();
    }
  };

  Bridge.prototype.send = function(d) {
    this.readyState   = 2;
    GM_xmlhttpRequest({
      method: this.method,
      url:    this.uri,
      onload: function(response) {
        this.readyState    = 4;
        this.status        = response.status;
        this.responseBody  = response.responseBody;
        this.responseText  = response.responseText;
        this.responseURL   = response.finalUrl;
        if (this.onreadystatechange !== null) {
          this.onreadystatechange();
        }
      }.bind(this)
    });

    Bridge.prototype.clear = function() {
      this.readyState     = 0;
      this.responseText   = null;
      this.responseBody   = null;
    };
  };

  return(new Bridge());
}); // let xhr = ...
const NS_WE_API                         = (kPlatformFirefox ? browser : (kPlatformChrome ? chrome : (kPlatformUserScript ? NS_userscript : undefined)));  // 이제 Web Extension API 를 사용할 때 namespace 이름은 NS_WE_API 로 통일함.

function isalpha(ch) {
  return(/^[a-zA-Z]+$/.test(ch));
}

function RefineUri(uri) {
  if (!uri) {
    return(uri);
  }
  if (isalpha(uri[uri.length - 1])) {
    return(uri);
  }
  return(uri.substr(0, uri.length - 1));
}

const tdex = (function() {

  const base = (function() {
    function teWaitable() {
      this._ready = false;
    }

    teWaitable.prototype.init = function(b) {
      if (b !== undefined) {
        this._ready = b;
      }
      else {
        this._ready = false;
      }
    };

    teWaitable.prototype.good = function() {
      return(this._ready);
    };

    teWaitable.prototype.bad = function() {
      return(!this._ready);
    };

    /* this method is not meaningful in this class.
     */
    teWaitable.prototype.getState = function() {
      return(this._ready ? kWaitableStateGood : kWaitableStateBad);
    };

    teWaitable.prototype.setGood = function() {
      this._ready = true;
    };

    teWaitable.prototype.setBad = function() {
      this._ready = false;
    };

    const WaitObjectPool = (function() {
      function teWaitObjectPool() {
        this._pool      = [];
        this._poolQueue = [];
        this._timerId   = null;
        this._updateRate= kSettingsDefaultWaitObjectPoolUpdateRate;
      }

      teWaitObjectPool.prototype.init = function() {
        this._pool      = [];
        this._poolQueue = [];
        this._updateRate= 
          Settings.good()
          ? Settings.get(kSettingsBSWaitObjectPoolUpdateRate, kSettingsDefaultWaitObjectPoolUpdateRate)
          : kSettingsDefaultWaitObjectPoolUpdateRate;
        if (this._timerId !== null) {
          clearInterval(this._timerId);
        }
        this._timerId   = setInterval(this.visit.bind(this), this._updateRate);
      };

      teWaitObjectPool.prototype.empty = function() {
        return(!(this._pool.length + this._poolQueue.length));
      };

      teWaitObjectPool.prototype.addRequest = function(request) {
        if (( typeof(request) !== "object")         ||
            (!request.hasOwnProperty("target"))     ||
            (!request.hasOwnProperty("callback"))   ||
            ( typeof(request.callback) !== "function")
        ) {
          debug.log("WaitObjectPool.addRequest() >> invalid request.");
          return;
        }
        this._poolQueue.push(request);
      };

      teWaitObjectPool.prototype.visit = function() {
        let recur = false;
        let n = 0;
        do {
          recur = false;
          for (let i = 0; i < this._pool.length; ++i) {
            let request = this._pool[i];
            switch (request.target.getState(n)) {
              case kWaitableStateBad: {
                continue;
              }
              case kWaitableStateGood: {
                request.callback();
                break;
              }
              case kWaitableStateSpecial: {
                break;
              }
            } 
            this._pool.splice(i--, 1);
            recur = true;
          }
          ++n;
        } while (recur);

        while (this._poolQueue.length) {
          this._pool.push(this._poolQueue.pop());
        }
      };

      let s_instance = new teWaitObjectPool();
      s_instance = null;
      return({
        getInstance: function() {
          if (!s_instance) {
            s_instance = new teWaitObjectPool();
            s_instance.init();
          }
          return(s_instance);
        },
        destroyInstance: function() {
          s_instance = null;
        }
      });
    })(); // let WaitObjectPool = ...

    function _WaitForWrapper(handler, arg) {
      this._target  = arg;
      this._handler = handler;
    }
    _WaitForWrapper.prototype.getState = function() {
      return(this._handler(this._target));
    };
    
    function _WaitForStable(min_rate, t) {
      this._u         = base.WaitObjectPool.getInstance()._updateRate;
      this._min_rate  = min_rate;
      this._t         = t;
      this._dt        = -this._u;
      this._ln        = -1;
    }

    _WaitForStable.prototype.getState = function(n) {
      if (n !== undefined) {
        if (n !== this._ln) {
          this._ln = n;
          return(kWaitableStateBad);
        }
      }
      this._dt += this._u;
      if (this._dt < this._min_rate) {
        return(kWaitableStateBad);
      }
      let s = this._t.getState();
      if (s === kWaitableStateBad) {
        this._dt = 0;
        return(kWaitableStateBad);
      }
      return(s);
    };

    function _WaitForLimit(max, t, onfail) {
      this._max     = max;
      this._cnt     = -1;
      this._t       = t;
      this._onfail  = onfail;
    }

    _WaitForLimit.prototype.getState = function() {
      if (++this._cnt > this._max) {
        if (typeof(this._onfail) === "function") {
          this._onfail();
        }
        return(kWaitableStateSpecial);
      }
      return(this._t.getState());
    };

    function teEvt/*teEvent*/(type) {
      this._type = type;
    }

    teEvt.prototype.init = function() {
      this._type = 0;
    };

    teEvt.prototype.getEventType = function() {
      return(this._type);
    };

    teEvt.prototype.setEventType = function(t) {
      this._type = t;
    };

    function teObservable(b) {
      teWaitable.call(this, b);
      this._observers = [];
      this._numbering = 0;
    }
    teObservable.prototype = Object.create(teWaitable.prototype);
    teObservable.prototype.constructor = teObservable;
    teObservable.prototype._super = teWaitable.prototype;

    teObservable.prototype.init = function(b) {
      teWaitable.prototype.init.call(this);
      this._observers = [];
      this._numbering = 0;
    };

    /* @param   observer  a function.
     * @return  a id of registered observer.
     *          if function is failed, return value is lower than 0.
     */
    teObservable.prototype.addObserver = function(observer) {
      if (typeof(observer) !== "function") {
        debug.log("Observable.addObserver() >> observer must be a function.");
        return(-1);
      }
      this._observers.push({
        id: ++this._numbering,
        observer: observer
      });
      observer(new teEvt(kEvtObserverOnAdded));
      return(this._numbering);
    };

    teObservable.prototype.removeObserver = function(id) {
      for (let i = 0; this._observers.length; ++i) {
        if (this._observers[i].id == id) {
          this._observers.splice(i, 1)[0](new teEvt(kEvtObserverOnRemoved));
          break;
        }
      }
    };

    teObservable.prototype.notifyObservers = function(e) {
      for (let i = 0; i < this._observers.length; ++i) {
        this._observers[i].observer(e);
      }
    };

    teObservable.prototype.notifyObserversWithLock = function(e) {
      this.setBad();
      this.notifyObservers(e);
      this.setGood();
    };

    return({
      Waitable: teWaitable,
      WaitObjectPool: WaitObjectPool,
      Observable: teObservable,
      _WaitForLimit: _WaitForLimit,
      _WaitForStable: _WaitForStable,
      _WaitForWrapper: _WaitForWrapper,
      Evt: teEvt
    });
  })(); // namespace base

  function SafeCall(fn) {
    if (typeof(fn) === "function") {
      return(fn());
    }
    return(undefined);
  }

  function WaitForWrapper(handler, arg) {
    return(new base._WaitForWrapper(handler, arg));
  }

  function WaitForTrue(fn) {
    return( WaitForWrapper( () => { return(fn() ? kWaitableStateGood : kWaitableStateBad); } ) );
  }

  function WaitForLimit(max, t, onfail) {
    return(new base._WaitForLimit(max, t, onfail));
  }
  
  /* WaitObjectPool 의 갱신 주기와 관계없이 최소 min_rate ms 마다 상태를 확인합니다.
   * @param min_rate
   * @param f
   */
  function WaitForStable(min_rate, t) {
    return(new base._WaitForStable(min_rate, t));
  }

  /* target.getState() !== kWaitableStateBad 를 만족하면 callback 을 호출합니다.
   * @param target          base.Waitable 클래스를 상속하거나 getState 메서드를 가지고 있는 객체
   * @param callback        
   * @param autocall        
   * @return target.getState()
   */
  function WaitForHelper(target, callback, autocall = true) {
    switch (target.getState()) {
      case kWaitableStateBad: {
        base.WaitObjectPool.getInstance().addRequest({target: target, callback: callback});
        return(kWaitableStateBad);
      }
      case kWaitableStateGood: {
        if (autocall) {
          callback();
        }
        return(kWaitableStateGood);
      }
      case kWaitableStateSpecial: {
        return(kWaitableStateSpecial);
      }
    }
  }

  function WaitForResponse(uri, callback, dontclear = false) {
    let xhr = XHR();
    xhr.open("GET", uri, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }
      callback(xhr);
    };
    xhr.send(null);
  }

  function IsCommonEvent(e) {
    if (!e) { return(false); }
    switch (e.getEventType()) {
      case kEvtObserverOnAdded:
      case kEvtObserverOnRemoved: {
        return(true);
      }
    }
    return(false);
  }

  function MapToPairs(map) {
    let pairs = {};
    for (let [key, value] of map) {
      pairs[key] = value;
    }
    return(pairs);
  }

  const ui = (function() {
    // 스크립트에서 사용할 모든 UI 창들을 이곳에 정의합니다.
    // 볼 필요 없으니 개요 축소시켜주세요.
    const show = (function() {
      function updateFinded() {
        let jqWindow = CreateWindow("box-small");
        WindowApplyLayout(jqWindow, layout.TCB1);
        jqWindow.find("#tdex-ui-id-title").html("트위치 디시콘 에드온");
        jqWindow.find("#tdex-ui-id-clientarea").append(
          $("<span></span><br/>").html("새로운 버전을 발견하였습니다.")
        ).append(
          $("<span></span><br/>").html("아래 링크에서 다운받으실 수 있습니다.")
        ).append(
          $("<a></a>").html("링크").attr("href", kUriHomePage)
        );
        jqWindow.find("#tdex-ui-id-button1").html("확인");
        jqWindow.find("#tdex-ui-id-button1").click(() => { WindowHide(jqWindow); UIManager.getInstance().removeFromWindowContainer(jqWindow); jqWindow = null; });
  
        WindowToggleMargin(jqWindow);
        UIManager.getInstance().addToWindowContainer(jqWindow);
        WindowShow(jqWindow);
      }

      // Application::firstRun
      function firstGlobalSetting(onShowEnd) {
        let jqWindow = tdex.ui.CreateWindow("box-small");
        
        let jqPhase0 = tdex.ui.template.DialogOk(
          "box-small",
          "이제부터 전역 설정을 시작합니다.<br/>" +
          ///*temporary*/"이 설정은 설정 창에서 언제든지 변경할 수 있습니다.<br/>" +
          "전역 설정은 개별 스트리머 설정의 기본값으로 사용됩니다.<br/>" +
          "계속하여 설정을 진행하기 위해 우측 하단에 위치한 버튼을 눌러주세요.<br/>",
          () => {
            tdex.ui.WindowChangeContent(jqWindow, jqPhase1, true);
            jqPhase0 = null;
            jqPhase1 = null;
          }
        );
        
        let jqPhase1 = tdex.ui.template.DialogYesNo(
          "box-small",
          "해당 설정을 허용하면 JSAssist Open 디시콘 리스트를 사용합니다.<br/>" +
          "만약 사용하지 않을 경우에는 수동으로 입력한 스트리머 전용 디시콘 리스트만을 사용합니다.<br/>" +
          "허용하시겠습니까?<br/>" +
          "<br/>" +
          "권장 설정은 '허용'입니다.",
          () => {
            tdex.Settings.set(kSettingsBSEnableJODL, true);
            tdex.ui.WindowChangeContent(jqWindow, jqPhase2, true);
            jqPhase2 = null;
          },
          () => {
            tdex.Settings.set(kSettingsBSEnableJODL, false);
            tdex.Settings.set(kSettingsBSEnableLimitedJODL, false);
            tdex.ui.WindowChangeContent(jqWindow, jqPhase3, true);
            jqPhase1 = null;
            jqPhase2 = null;
          }
        );
        jqPhase1.find("#tdex-ui-id-title").html("설정: JSAssist Open 디시콘 리스트 사용");
    
        let jqPhase2 = tdex.ui.template.DialogYesNo(
          "box-small",
          "해당 설정을 허용하면 스트리머 전용 디시콘 리스트가 없는 경우에만 JSAssist Open 디시콘 리스트 를 사용합니다.<br/>" +
          "디시콘 검색 순서는 '스트리머 전용 디시콘 리스트' -> 'JSAssist Open 디시콘 리스트' 입니다.<br/>" +
          "허용하시겠습니까?<br/>",
          () => {
            tdex.Settings.set(kSettingsBSEnableLimitedJODL, true);
            tdex.ui.WindowChangeContent(jqWindow, jqPhase3, true);
            jqPhase3 = null;
          },
          () => {
            tdex.Settings.set(kSettingsBSEnableLimitedJODL, false);
            tdex.ui.WindowChangeContent(jqWindow, jqPhase3, true);
            jqPhase3 = null;
          }
        );
        jqPhase2.find("#tdex-ui-id-title").html("설정: JSAssist Open 디시콘 리스트 의 제한적 사용");
        
        let jqPhase3 = tdex.ui.template.DialogYesNo(
          "box-small",
          "해당 설정을 허용하면 새로운 스트리머의 채팅방에 입장할 때마다 에드온의 사용 여부를 묻습니다.<br/>" +
          "해당 에드온의 적용 범위를 엄격히 관리하고 싶으신 분께 추천드립니다.<br/>" +
          "만약 사용하지 않을 경우에는 모든 스트리머의 채팅방에서 해당 에드온을 적용하는 것으로 간주합니다.<br/>" +
          "설정 창에서 언제든지 개별 스트리머에 대한 설정이 가능합니다.<br/>",
          () => {
            tdex.Settings.set(kSettingsBSEnableAskAtFirst, true);
            tdex.ui.WindowChangeContent(jqWindow, jqPhase9, true);
            jqPhase3 = null;
          },
          () => {
            tdex.Settings.set(kSettingsBSEnableAskAtFirst, false);
            tdex.ui.WindowChangeContent(jqWindow, jqPhase9, true);
            jqPhase3 = null;
          }
        );
        jqPhase3.find("#tdex-ui-id-title").html("설정: 첫 방문시의 동작");
    
        let jqPhase9 = tdex.ui.template.DialogOk(
          "box-small",
          "모든 설정을 완료했습니다.<br/>" +
          "우측 하단의 버튼을 눌러 설정을 저장해주세요.",
          () => {
            jqPhase9 = null;
            tdex.Settings.save(() => {
              NS_WE_API.storage.local.set(
                {[kStorageStreamerSpecificDCConList]: JSON.stringify({})},
                () => { location.reload(true); }
              );
            });
          }
        );
        jqPhase9.find("#tdex-ui-id-title").html("완료!");
    
        tdex.ui.WindowToggleMargin(jqWindow);
        tdex.ui.UIManager.getInstance().addToWindowContainer(jqWindow);
        tdex.ui.WindowShow(jqWindow);
    
        tdex.ui.OpenBigDickShow(
          jqWindow,
          ["트위치 디시콘 에드온", "안녕하세요.", "첫 설정을 시작합니다."],
          "tdex-ui-ani-fadeinout-4s",
          4020,
          () => {
            tdex.ui.WindowChangeContent(jqWindow, jqPhase0, true);
            jqPhase0 = null;
          }
        );
      }

      //
      function streamerSettings(onShowEnd) {
        const streamerName = StreamerInspector.getInstance().getStreamerName();
        let ss = Settings.ss(streamerName);
        let jqWindow = CreateWindow("box-big");
        let jqWindowSSDL = CreateWindow("box-medium");
        WindowApplyLayout(jqWindow, layout.TCB2);
        WindowApplyLayout(jqWindowSSDL, layout.TCB1);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 타이틀
        jqWindowSSDL.find("#tdex-ui-id-title").html("설정: " + streamerName + "님의 전용 디시콘 리스트");

        // 본문
        let taSSDLUri = CreateTextarea(); TextareaSetText(taSSDLUri, ss.get(kSettingsSSSSDLUri, "")); TextareaSetPlaceholder(taSSDLUri, "URI");
        let taSSDLConverter = CreateTextarea(); TextareaSetText(taSSDLConverter, ss.get(kSettingsSSConverter, "function convert(json_string) { return(json_string); } pass(convert(xhr.responseText));"));
        jqWindowSSDL.find("#tdex-ui-id-clientarea").append(
          $("<span></span>").html("디시콘 리스트 JSON 파일의 주소")
        ).append(
          taSSDLUri.addClass("tdex-ui-style-full-width").css("height", "25px").css("margin", "5px 10px 0 0").attr("rows", "1")
        ).append(
          $("<br/><br/><span></span>").html("(미구현) json convert function")
        ).append(
          taSSDLConverter.addClass("tdex-ui-style-full-width").css("height", "160px").css("margin", "5px 10px 0 0")
        );

        // 버튼
        /* @todo taSSDLUri 이 유효한 주소인지 검사하는 기능을 구현해야함.
         */
        jqWindowSSDL.find("#tdex-ui-id-button1").html("확인").click(function() {
          jqWindowSSDL.hide();
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 타이틀
        jqWindow.find("#tdex-ui-id-title").html("설정: " + streamerName + "님의 채팅방");

        // 본문
        let swEnableAddon = CreateSwitch(); SwitchToggleTooltip(swEnableAddon); SwitchSetState(swEnableAddon, ss.get(kSettingsSSEnableAddon, true) ? "on" : "off");
        let swEnableJODL = CreateSwitch(); SwitchToggleTooltip(swEnableJODL); SwitchSetState(swEnableJODL, (ss.get(kSettingsSSEnableJODL, Settings.get(kSettingsBSEnableJODL)) ? "on" : "off"));
        let swEnableLimitedJODL = CreateSwitch(); SwitchToggleTooltip(swEnableLimitedJODL); SwitchSetState(swEnableLimitedJODL, (ss.get(kSettingsSSEnableLimitedJODL, Settings.get(kSettingsBSEnableLimitedJODL)) ? "on" : "off"));
        let swEnableSSDL = CreateSwitch(); SwitchToggleTooltip(swEnableSSDL); SwitchSetState(swEnableSSDL, (ss.get(kSettingsSSEnableSSDL, false) ? "on" : "off"));
        let btSSDL = CreateButton(); ButtonSetText(btSSDL, "세부 설정");
        jqWindow.find("#tdex-ui-id-clientarea").append(
          $("<span></span>").html("트위치 디시콘 에드온")
        ).append(
          swEnableAddon
        ).append(
          $("<br/><span></span>").html("JSAssist Open 디시콘 리스트")
        ).append(
          swEnableJODL
        ).append(
          $("<span></span><br/>").html("이 설정은 'JSAssist Open 디시콘 리스트 제한적 사용' 옵션에 의해 덮어 씌어질 수 있습니다.").css("font-size", "12px")
        ).append(
          $("<br/><span></span>").html("JSAssist Open 디시콘 리스트 제한적 사용")
        ).append(
          swEnableLimitedJODL
        ).append(
          $("<br/><span></span>").html("스트리머 전용 디시콘 리스트")
        ).append(
          swEnableSSDL
        ).append(
          $("<br/>")
        ).append(
          btSSDL
        );

        // 버튼
        btSSDL.click(function() {
          WindowShow(jqWindowSSDL);
        });
        jqWindow.find("#tdex-ui-id-button1").html("저장").click(function() {
          let ss = Settings.ss(streamerName);
          ss.set(kSettingsSSEnableAddon, SwitchIsOn(swEnableAddon));
          ss.set(kSettingsSSEnableJODL, SwitchIsOn(swEnableJODL));
          ss.set(kSettingsSSEnableLimitedJODL, SwitchIsOn(swEnableLimitedJODL));
          ss.set(kSettingsSSEnableSSDL, SwitchIsOn(swEnableSSDL));
          ss.set(kSettingsSSSSDLUri, TextareaGetText(taSSDLUri));
          ss.set(kSettingsSSConverter, TextareaGetText(taSSDLConverter));
          ss.save();
          UIManager.getInstance().removeFromWindowContainer(jqWindow);
          UIManager.getInstance().removeFromWindowContainer(jqWindowSSDL);
          jqWindow = null;
          jqWindowSSDL = null;
          ss = null;
          if (typeof(onShowEnd) === "function") {
            onShowEnd();
          } 
          else {
            template.Alert("일부 설정은 페이지를 새로고침한 이후에 적용됩니다.", true);
          } 
        });
        jqWindow.find("#tdex-ui-id-button2").html("취소").click(function() {
          let ss = Settings.ss(streamerName);
          if (ss.isFirst()) {
            template.Alert("첫 설정은 취소하실 수 없습니다.", true);
            ss = null;
            return;
          }

          UIManager.getInstance().removeFromWindowContainer(jqWindow);
          UIManager.getInstance().removeFromWindowContainer(jqWindowSSDL);
          jqWindow = null;
          jqWindowSSDL = null;
          ss = null;
          if (typeof(onShowEnd) === "function") {
            onShowEnd();
          } 
        });

        ss = null;
        WindowToggleMargin(jqWindow);
        WindowToggleMargin(jqWindowSSDL);
        jqWindowSSDL.hide();
        UIManager.getInstance().addToWindowContainer(jqWindow);
        UIManager.getInstance().addToWindowContainer(jqWindowSSDL);
        WindowShow(jqWindow);
      }

      function license() {
        let jqWindow = template.DialogOk("box-medium", "");
        jqWindow.find("#tdex-ui-id-title").html("저작권");
        jqWindow.find("#tdex-ui-id-clientarea").append(
          $("<div></div>").addClass("tdex-ui-license-img").attr("data-a-uri", "https://icons8.com/icon/14099/Settings").append(
            $("<img>").attr("src", kResourceIconSettings)
          )
        ).append(
          $("<div></div>").addClass("tdex-ui-license-img").attr("data-a-uri", "https://icons8.com/icon/40068/rotate").append(
            $("<img>").attr("src", kResourceIconRefresh)
          )
        ).append(
          $("<div></div>").addClass("tdex-ui-license-img").attr("data-a-uri", "https://icons8.com/icon/14093/info").append(
            $("<img>").attr("src", kResourceIconInfo)
          )
        );
        UIManager.getInstance().addToWindowContainer(jqWindow);
        WindowShow(jqWindow);
        return(jqWindow);
      }

      return({
        firstGlobalSetting: firstGlobalSetting,
        firstStreamerSetting: streamerSettings,
        streamerSettings: streamerSettings,
        updateFinded: updateFinded,
        license: license
      });
    })(); // namespace show

    const layout = (function(){
      function TCBn() {
        let content_container = this.find(".tdex-ui-box-content-container");
        content_container.append(
          $("<div></div>").addClass("tdex-ui-layout-tcb3-title").append(
            $("<span></span>").attr("id", "tdex-ui-id-title")
          )
        ).append(
          $("<div></div>").attr("id", "tdex-ui-id-clientarea").addClass("tdex-ui-layout-tcb3-clientarea")
        ).append(
          $("<div></div>").addClass("tdex-ui-layout-tcb3-button-container")
        );
      }
  
      /* 제목, 본문, 버튼 1개
       */
      function TCB1() {
        TCBn.call(this);
        let button_container = this.find(".tdex-ui-layout-tcb3-button-container");
        button_container.append(
          ui.CreateButton().attr("id", "tdex-ui-id-button1")
        );
      }
  
      /* 제목, 본문, 버튼 2개
       */
      function TCB2() {
        TCBn.call(this);
        let button_container = this.find(".tdex-ui-layout-tcb3-button-container");
        button_container.append(
          ui.CreateButton().attr("id", "tdex-ui-id-button1")
        ).append(
          ui.CreateButton().attr("id", "tdex-ui-id-button2").addClass("tdex-ui-button-hasgap")
        );
      }
  
      /* 제목, 본문, 버튼 2개
       */
      function TCB3() {
        TCBn.call(this);
        let button_container = this.find(".tdex-ui-layout-tcb3-button-container");
        button_container.append(
          ui.CreateButton().attr("id", "tdex-ui-id-button1")
        ).append(
          ui.CreateButton().attr("id", "tdex-ui-id-button2").addClass("tdex-ui-button-hasgap")
        ).append(
          ui.CreateButton().attr("id", "tdex-ui-id-button3").addClass("tdex-ui-button-hasgap")
        );
      }
  
      return({
        TCB1: TCB1,
        TCB2: TCB2,
        TCB3: TCB3
      });
    })(); // namespace layout
  
    const template = (function() {
      function DialogOneButton(box, message, focusable, bt_text, on) {
        let jqWin = CreateWindow(box);
        WindowApplyLayout(jqWin, layout.TCB1);
        jqWin.find("#tdex-ui-id-title").html("트위치 디시콘 에드온");
        jqWin.find("#tdex-ui-id-clientarea").html(message);
        let bt = jqWin.find("#tdex-ui-id-button1");
        bt.html(bt_text);
        if (on) {
          bt.click(()=>{on(1);});
        }
        else {
          bt.click(function(e) {
            let elm = e.target;
            while (elm.getAttribute("class") !== "tdex-ui-box") {
              elm = elm.parentNode;
            }
            UIManager.getInstance().removeFromWindowContainer($(elm));
            e.stopPropagation();
          });
        }
        if (focusable) {
          WindowToggleMargin(jqWin);
        }
        return(jqWin);
      }

      function DialogTwoButton(box, message, focusable, bt_texts, ons) {
        let jqWin = CreateWindow(box);
        WindowApplyLayout(jqWin, layout.TCB2);
        jqWin.find("#tdex-ui-id-title").html("트위치 디시콘 에드온");
        jqWin.find("#tdex-ui-id-clientarea").html(message);
        for (let i = 0; i < 2; ++i) {
          let bt = jqWin.find("#tdex-ui-id-button" + (i + 1));
          bt.html(bt_texts[i]);
          if (ons[i]) {
            bt.click(()=>{ons[i](i + 1);});
          }
          else {
            bt.click(function(e) {
              let elm = e.target;
              while (elm.getAttribute("class") !== "tdex-ui-box") {
                elm = elm.parentNode;
              }
              UIManager.getInstance().removeFromWindowContainer($(elm));
              e.stopPropagation();
            });
          }
        }
        if (focusable) {
          WindowToggleMargin(jqWin);
        }
        return(jqWin);
      }

      function DialogOk(box, message, handler) {
        return(DialogOneButton(box, message, false, "알겠습니다", handler));
      }

      function DialogNext(box, message, onNext) {
        return(DialogOneButton(box, message, false, "다음", handler));
      }

      function DialogPrev(box, message, onPrev) {
        return(DialogOneButton(box, message, false, onPrev));
      }

      function DialogPrevNext(box, message, onPrev, onNext) {
        return(DialogTwoButton(box, message, false, ["이전", "다음"], [onPrev, onNext]));
      }

      function DialogYesNo(box, message, onYes, onNo) {
        return(DialogTwoButton(box, message, false, ["네", "아니오"], [onYes, onNo]));
      }

      function Alert(message, focusable, handler) {
        let jqWin = CreateWindow("box-small");
        WindowApplyLayout(jqWin, layout.TCB1);
        jqWin.find("#tdex-ui-id-title").html("트위치 디시콘 에드온");
        jqWin.find("#tdex-ui-id-clientarea").html(message);
        let bt = jqWin.find("#tdex-ui-id-button1");
        bt.text("알겠습니다");
        if (handler) {
          bt.click(handler);
        }
        else {
          bt.click(function() {
            WindowHide(jqWin);
            UIManager.getInstance().removeFromWindowContainer(jqWin);
          });
        }
        if (focusable) {
          WindowToggleMargin(jqWin);
        }
        UIManager.getInstance().addToWindowContainer(jqWin);
        WindowShow(jqWin);
      }
  
      return({
        DialogOneButton: DialogOneButton,
        DialogTwoButton: DialogTwoButton,
        DialogOk: DialogOk,
        DialogNext: DialogNext,
        DialogPrev: DialogPrev,
        DialogPrevNext: DialogPrevNext,
        DialogYesNo: DialogYesNo,
        Alert: Alert
      });
    })(); // namespace template

    const UIManager = (function() {
      function teUIManager() {
        this._observerId  = -1;
        this._windowCount = 0;
      }
      teUIManager.prototype = Object.create(base.Observable.prototype);
      teUIManager.prototype.constructor = teUIManager;
      teUIManager.prototype._super = base.Observable;

      teUIManager.prototype.init = function() {
        if (this._observerId && this._observerId > 0) {
          PageInspector.getInstance().removeObserver(this._observerId);
        }
        this._observerId = PageInspector.getInstance().addObserver(this.onPageChange.bind(this));
        debug.log("ui::UIManager.init() >> PageInspector's observer id is " + this._observerId + ".");
      };

      teUIManager.prototype.update = function() {
        if (!this.good()) {
          debug.log("ui::UIManager.update() >> /*temporary*/");
          return;
        }

        let b = false;
        let c = document.getElementsByClassName("tdex-ui-box");
        for (let i = 0; i < c.length; ++i) {
          if (c[i].getAttribute("display") !== "none" && !($(c[i]).hasClass("tdex-ui-box-escape"))) {
            b = true;
            break;
          }
        }
        if (b) { $("#tdex-ui-window-container").show(); } else { $("#tdex-ui-window-container").hide(); }
      };

      teUIManager.prototype.addToWindowContainer = function(jqWindow) {
        if (!this.good()) {
          debug.log("ui::UIManager.addToWindowContainer() >> /*temporary*/");
          return;
        }
        $("#tdex-ui-window-container").append(jqWindow);
        ++this._windowCount;
        this.update();
      };

      teUIManager.prototype.removeFromWindowContainer = function(jqWindow) {
        if (!this.good()) {
          debug.log("ui::UIManager.removeFromWindowContainer() >> /*temporary*/");
          return;
        }
        if (jqWindow.get(0).parentNode.getAttribute("id") !== "tdex-ui-window-container") {
          debug.log("ui::UIManager.removeFromWindowContainer() >> invalid argument. node's parent is not tdex-ui-window-container.");
          return; 
        }
        $("#tdex-ui-window-container").get(0).removeChild(jqWindow.get(0));
        --this._windowCount;
        this.update();
      };

      teUIManager.prototype.onPageChange = function(e) {
        if (IsCommonEvent(e)) {
          return;
        }
        this.injectWindowContainer();
      };

      teUIManager.prototype.injectWindowContainer = function() {
        if (document.getElementById("tdex-ui-window-container") !== null) {
          this.setGood();
          return;
        }
        this.setBad();
        let boxContainer = $("<div></div>").attr("id", "tdex-ui-window-container");
        let pageType = fickle.GetPageTypeFromUri(RefineUri(location.href));
        switch (pageType/*PageInspector.getInstance().getPageType()*/) {
          case kPageTypeOldChattingRoom:
          case kPageTypeOldRecordedChattingRoom: {
            $(".ember-application").prepend(boxContainer);
            break;
          }
          case kPageTypeBetaChattingRoom:
          case kPageTypeBetaRecordedChattingRoom: {
            $("#root").prepend(boxContainer);
            break;
          }
          case kPageTypeNoChattingRoom:
          case kPageTypeNewChattingRoom:
          case kPageTypeNewRecordedChattingRoom: {
            debug.log("ui::UIManager.injectWindowContainer() >> this page type is not yet supported.");
            break;
          }
        }
        
        let verify = function() {
          if (!document.getElementById("tdex-ui-window-container")) {
            app.log("ui::Init() >> adding an ui window container failed.");
            this.injectWindowContainer();
            return;
          }
          $("#tdex-ui-window-container").hide();
          this.setGood();
          debug.log("ui::Init() >> ui window container is successfully added.");
          verify = null;
        }.bind(this);
        // wait for WaitObjectPool._updateRate ms
        let condition = WaitForStable( 2000, WaitForTrue(() => { return(true); }) );
        WaitForHelper(condition, verify);
      };

      // @todo ui 구현
      teUIManager.prototype.onTDEXButtonClick = function() {
        /*temporary*/
        $($(".tdex-ui-box-ds").get(0).parentNode.parentNode).show();
      };

      let s_instance = new teUIManager();
      s_instance = null;
      return({
        getInstance: function() {
          if (!s_instance) {
            s_instance = new teUIManager();
            s_instance.init();
          }
          return(s_instance);
        },
  
        destroyInstance: function() {
          s_instance = null;
        }
      });
    })(); // let UIManager = ...
  
    function CreateWindow(box_class) {
      if (!box_class) {
        debug.log("ui::CreateWindow() >> invalid argument.");
        return(null);
      }
      let jqObject = 
        $("<div></div>").addClass("tdex-ui-box").append(
          $("<div></div>").addClass("tdex-ui-box-container")
          .append(
            $("<div></div>").addClass("tdex-ui-box-margin")
          ).append(
            $("<div></div>").addClass("tdex-ui-" + box_class).append(
              $("<div></div>").addClass("tdex-ui-box-content").append(
                $("<div></div>").addClass("tdex-ui-box-content-container")
              )
            )
          )
        );
      return(jqObject);
    }

    function WindowShow(jqWin) {
      jqWin.show();
      UIManager.getInstance().update();
    }

    function WindowHide(jqWin) {
      jqWin.hide();
      UIManager.getInstance().update();
    }

    function WindowToggleMargin(jqWin) {
      jqWin.find(".tdex-ui-box-margin").addClass("tdex-ui-box-margin-visible");
    }

    function WindowMarginAsCloseButton(jqWin) {
      jqWin.find(".tdex-ui-box-margin").click((e) => {
        let elm = e.target;
        while (!($(elm).hasClass("tdex-ui-box"))) {
          elm = elm.parentNode;
        }
        WindowHide($(elm));
        if (!($(elm).hasClass("tdex-ui-box-escape"))) {
          UIManager.getInstance().removeFromWindowContainer(elm);
        }
      });
    }
  
    function WindowApplyLayout(jqWin, layout_fn) {
      layout_fn.call(jqWin);
    }
  
    function WindowChangeContent(jqWin, jqWinN, use_effect) {
      let new_content = jqWinN.find(".tdex-ui-box-content");
      let old_content = jqWin.find(".tdex-ui-box-content");
      if (use_effect) {
        old_content.removeClass("tdex-ui-box-content").addClass("tdex-ui-box-content-old");
        old_content.get(0).innerHTML.replace("tdex-ui-id-", "old");
        new_content = $(new_content.parent().get(0).removeChild(new_content.get(0)));
  
        old_content.addClass("tdex-ui-ani-slideout-left-1s");
        new_content.addClass("tdex-ui-ani-slidein-right-1s");
        old_content.before(new_content);
        setTimeout(
          () => { 
            new_content.removeClass("tdex-ui-ani-slidein-right-1s");
            old_content.get(0).parentNode.removeChild(old_content.get(0)); 
          }, 1020
        );
      }
      else {
        old_content.before(new_content);
        old_content.get(0).parentNode.removeChild(old_content.get(0));
      }
      jqWinN = null;
    }
  
    function CreateButton(caption) {
      let jqObject = 
        $("<div></div>").addClass("tdex-ui-button").append(
          $("<span></span>")
        );
      return(jqObject);
    }
  
    function ButtonSetText(jqObject, t) {
      jqObject.children().text(t);
    }
  
    function CreateSwitch() {
      let jqObject = 
        $("<div></div>").addClass("tdex-ui-switch").append(
          $("<div></div>").addClass("tdex-ui-switch-container").append(
            $("<div></div>").addClass("tdex-ui-switch-bg").append(
              $("<div></div>").addClass("tdex-ui-switch-fg")
            )
          )
        );
      jqObject.find(".tdex-ui-switch-bg").click(function(e) {
        let elm = e.target;
        while (!$(elm).hasClass("tdex-ui-switch")) {
          elm = elm.parentNode;
        }
        $(elm).toggleClass("tdex-ui-switch-state-on");
        e.stopPropagation();
      });
      return(jqObject);
    }

    function SwitchGetText(jqObject) {
      return(jqObject.get(0).getAttribute("data-a-text"));
    }

    function SwitchSetText(jqObject, t) {
      jqObject.children().attr("data-a-text", t);
    }

    function SwitchSetStateOn(jqObject) {
      jqObject.addClass("tdex-ui-switch-state-on");
    }

    function SwitchSetStateOff(jqObject) {
      jqObject.removeClass("tdex-ui-switch-state-on");
    }

    function SwitchToggleTooltip(jqObject) {
      jqObject.toggleClass("tdex-ui-switch-has-tooltip");
    }

    function SwitchSetState(jqObject, string_state) {
      if (string_state === "on") {
        jqObject.addClass("tdex-ui-switch-state-on");
      }
      else if (string_state === "off") {
        jqObject.removeClass("tdex-ui-switch-state-on");
      }
    }

    function SwitchIsOn(jqObject) {
      return(jqObject.hasClass("tdex-ui-switch-state-on"));
    }

    function CreateTextarea() {
      let jqObject = 
        $("<textarea>").addClass("tdex-ui-textarea");
      return(jqObject);
    }

    function TextareaGetText(jqObject) {
      return(jqObject.get(0).value);
    }

    function TextareaSetText(jqObject, v) {
      jqObject.get(0).value = v;
    }

    function TextareaSetPlaceholder(jqObject, s) {
      jqObject.attr("placeholder", s);
    }
  
    function OpenBigDickShow(win, texts, power, delay, finale) {
      let host = function() {
        let actor = win.get(0).getElementsByClassName("tdex-ui-box-content-container")[0].getElementsByClassName("tdex-ui-bigdick")[0];
        if (actor === undefined) {
          actor = $("<div></div>").addClass("tdex-ui-bigdick").append($("<span></span>").addClass(power)).get(0);
          win.get(0).getElementsByClassName("tdex-ui-box-content-container")[0].appendChild(actor);
        }
        actor.replaceChild($(actor.lastElementChild).clone().get(0), actor.lastElementChild);
        actor.lastElementChild.innerHTML = texts.shift();
        $(actor.lastElementChild).addClass(power);
  
        if (texts.length) {
          setTimeout(host, delay);
          return;
        }
        setTimeout(() => { actor.parentNode.removeChild(actor); SafeCall(finale); }, delay);
      };
      host();
    }
  
    return({
      layout: layout,
      template: template,
      show: show,

      UIManager: UIManager,
      
      CreateWindow: CreateWindow,
      WindowShow: WindowShow,
      WindowHide: WindowHide,
      WindowChangeContent: WindowChangeContent,
      WindowToggleMargin: WindowToggleMargin,
      WindowMarginAsCloseButton: WindowMarginAsCloseButton,
      WindowApplyLayout: WindowApplyLayout,
      CreateButton: CreateButton,
      ButtonSetText: ButtonSetText,
      CreateSwitch: CreateSwitch,
      SwitchGetText: SwitchGetText,
      SwitchSetText: SwitchSetText,
      SwitchSetStateOn: SwitchSetStateOn,
      SwitchSetStateOff: SwitchSetStateOff,
      SwitchToggleTooltip: SwitchToggleTooltip,
      CreateTextarea: CreateTextarea,
      TextareaGetText: TextareaGetText,
      TextareaSetPlaceholder: TextareaSetPlaceholder,
      OpenBigDickShow: OpenBigDickShow
    });
  })();

  const fickle = (function() {
    function GetPageTypeFromUri(uri) {
      let ret = kPageTypeNoChattingRoom;
      let parsedUri = parseUri(uri);
      if ((parsedUri.directory.indexOf("/directory")) >= 0 ||
          (parsedUri.directory.length <= 1)
      ) {
        ret = kPageTypeNoChattingRoom;
      }
      // https://www.twitch.tv/videos/[video number]
      else if (parsedUri.host === "www.twitch.tv" && parsedUri.directory.indexOf("/videos/") === 0) {
        ret = kPageTypeOldRecordedChattingRoom;
      }
      // https://go.twitch.tv/videos/[video number]
      else if (parsedUri.host === "go.twitch.tv" && parsedUri.directory.indexOf("/videos/") === 0) {
        ret = kPageTypeBetaRecordedChattingRoom;
      }
      // https://go.twitch.tv/[streamer name]
      else if (parsedUri.host === "go.twitch.tv") {
        ret = kPageTypeBetaChattingRoom;
      }
      // https://www.twitch.tv/[streamer name]/*
      else if (parsedUri.host === "www.twitch.tv") {
        ret = kPageTypeOldChattingRoom;
      }
      else {
        ret = kPageTypeNewChattingRoom;
      }
      return(ret);
    }

    function ParseStreamerNameFromPage(callback) {
      let parsedUri = PageInspector.getInstance().getParsedUri();
      switch (PageInspector.getInstance().getPageType()) {
        case kPageTypeNoChattingRoom: {
          callback("");
          break;
        }
        case kPageTypeOldChattingRoom:
        case kPageTypeOldRecordedChattingRoom: {
          let handler = function() {
            callback(document.getElementsByClassName("cn-bar__displayname")[0].innerHTML.trim().toUpperCase());
          };
          let elmFinder = () => { 
            let elms = document.getElementsByClassName("cn-bar__displayname");
            return(elms.length > 0 && elms[0].innerHTML.trim().length > 0);
          };
          let condition = WaitForStable(1000, WaitForLimit(10, WaitForTrue(elmFinder)));
          WaitForHelper(condition, handler);
          break;
        }
        case kPageTypeBetaChattingRoom:
        case kPageTypeBetaRecordedChattingRoom: {
          let handler = function() {
            callback(document.getElementsByClassName("channel-header__user")[0].childNodes[1].innerHTML.trim().toUpperCase());
          };
          let elmFinder = () => { 
            let elms = document.getElementsByClassName("channel-header__user");
            return(elms.length > 0 && elms[0].childNodes[1].innerHTML.trim().length > 0);
          };
          let condition = WaitForStable(1000, WaitForLimit(10, WaitForTrue(elmFinder))); 
          WaitForHelper(condition, handler);
          break;
        }
        case kPageTypeNewChattingRoom:
        case kPageTypeNewRecordedChattingRoom:
        default: {
          debug.log("ParseStreamerNameFromUri() >> this page type is not yet supported.");
          callback(null);
        }
      }
    }

    function ParseDCConListFromJODLFormat(jsonString, map) {
      let dic = JSON.parse(jsonString);
      dic["dccons"].forEach(function(dccon) {
        let obj = {
          path: dccon["path"],
          tags: dccon["tags"]
        };
        dccon["keywords"].forEach(function(key) {
          map.set(key, obj);
        });
      });
    }

    function GetChatContainerClassName() {
      switch (PageInspector.getInstance().getPageType()) {
        case kPageTypeNoChattingRoom: {
          return(null);
        }
        case kPageTypeOldChattingRoom: {
          return("chat-lines");
        }
        case kPageTypeOldRecordedChattingRoom: {
          return("video-chat__message-list-wrapper");
        }
        case kPageTypeBetaChattingRoom: {
          return("chat-list__lines");
        }
        case kPageTypeBetaRecordedChattingRoom: {
          return("video-chat__message-list-wrapper");
        }
        case kPageTypeNewChattingRoom:
        case kPageTypeNewRecordedChattingRoom: 
        default: {
          debug.log("this page type is not yet supported.");
          return(null);
        }
      }
    }

    function GetRealChatContainer(elm) {
      switch (PageInspector.getInstance().getPageType()) {
        case kPageTypeOldChattingRoom: {
          return(elm);
        }
        case kPageTypeOldRecordedChattingRoom: {
          return(elm.lastElementChild.lastElementChild);
        }
        case kPageTypeBetaChattingRoom: {
          return(elm);
        }
        case kPageTypeBetaRecordedChattingRoom: {
          return(elm.lastElementChild.lastElementChild);
        }
        case kPageTypeNewChattingRoom:
        case kPageTypeNewRecordedChattingRoom: 
        default: {
          debug.log("GetRealChatContainer() >> this page type is not yet supported.");
          return(null);
        }
      }
    }

    function GetChatContainer(callback) {
      switch (PageInspector.getInstance().getPageType()) {
        case kPageTypeNewChattingRoom:
        case kPageTypeNewRecordedChattingRoom: 
        default: {
          debug.log("GetChatContainer() >> this page type is not yet supported.");
          callback(null);
          return;
        }
        case kPageTypeOldChattingRoom:
        case kPageTypeOldRecordedChattingRoom:
        case kPageTypeBetaChattingRoom:
        case kPageTypeBetaRecordedChattingRoom:
      }
      const chatContainerClassName = GetChatContainerClassName();
      let handler = function() {
        callback(GetRealChatContainer(document.getElementsByClassName(chatContainerClassName)[0]));
      };
      let elmFinder = () => { return(document.getElementsByClassName(chatContainerClassName).length > 0); };
      let condition = WaitForStable(1000, WaitForTrue(elmFinder)); 
      WaitForHelper(condition, handler);
    }

    function GetIconContainerClassName() {
      switch (PageInspector.getInstance().getPageType()) {
        case kPageTypeOldChattingRoom: {
          return("chat-buttons-container");
        }
        case kPageTypeOldRecordedChattingRoom: {
          return("justify-content-between");
        }
        case kPageTypeBetaChattingRoom: {
          return("chat-buttons-container");
        }
        case kPageTypeBetaRecordedChattingRoom: {
          return("justify-content-between");
        }
        case kPageTypeNewChattingRoom: 
        case kPageTypeNewRecordedChattingRoom:
        default: {
          debug.log("GetIconContainerClassName() >> this page type is not yet supported.");
          return(null);
        }
      }
    }

    function GetRealIconContainer(elm) {
      switch (PageInspector.getInstance().getPageType()) {
        case kPageTypeOldChattingRoom: {
          return(elm);
        }
        case kPageTypeOldRecordedChattingRoom: {
          return(elm);
        }
        case kPageTypeBetaChattingRoom: {
          return(elm.firstElementChild);
        }
        case kPageTypeBetaRecordedChattingRoom: {
          return(elm);
        }
        case kPageTypeNewChattingRoom: 
        case kPageTypeNewRecordedChattingRoom:
        default: {
          debug.log("GetIconContainerClassName() >> this page type is not yet supported.");
          return(null);
        }
      }
    }

    function GetIconContainer(callback) {
      switch (PageInspector.getInstance().getPageType()) {
        case kPageTypeNewChattingRoom:
        case kPageTypeNewRecordedChattingRoom: 
        default: {
          debug.log("GetIconContainer() >> this page type is not yet supported.");
          callback(null);
          return;
        }
      }
      const iconContainerClassName = GetIconContainerClassName();
      let handler = function() {
        callback(GetRealIconContainer(document.getElementsByClassName(iconContainerClassName)[0]));
      };
      let elmFinder = () => { return(document.getElementsByClassName(iconContainerClassName).length > 0); };
      let condition = WaitForStable(1000, WaitForTrue(elmFinder)); 
      WaitForHelper(condition, handler);
    }

    const ChatMessage = (function() {
      function teChatMessage(e, a, m) {
        this._elmAuthor   = a;
        this._elmMessage  = m;
        this._elm         = e;
      }
  
      teChatMessage.prototype.get_native = function() {
        return(this._elm);
      };
  
      teChatMessage.prototype.getChatAuthorElement = function() {
        return(this._elmAuthor);
      };
  
      teChatMessage.prototype.getChatMessageElement = function() {
        return(this._elmMessage);
      };
  
      teChatMessage.createFromElement = function(elm) {
        switch (PageInspector.getInstance().getPageType()) {
          case kPageTypeOldChattingRoom: {
            if (typeof(elm.tagName) === "undefined" || elm.tagName.toLowerCase() !== "li") {
              return(null);
            }
            return(new teChatMessage(
              elm,
              elm.lastElementChild.getElementsByClassName("from")[0],
              elm.lastElementChild.lastElementChild
            ));
          }
          case kPageTypeOldRecordedChattingRoom:
          case kPageTypeBetaRecordedChattingRoom: {
            return(new teChatMessage(
              elm,
              elm.getElementsByClassName("video-chat__message-author")[0].lastElementChild,
              elm.getElementsByClassName("qa-mod-message")[0].lastElementChild
            ));
          }
          case kPageTypeBetaChattingRoom: {
            return(new teChatMessage(
              elm,
              elm.getElementsByClassName("chat-line__message--username")[0],
              elm.lastElementChild
            ));
          }
          case kPageTypeNewChattingRoom:
          case kPageTypeNewRecordedChattingRoom: {
            debug.log("ChatMessage.createFromElement() >> this page type is not yet supported.");
            return(null);
          }
        }
      };
  
      return(teChatMessage);
    })(); // let ChatMessage = ...

    /* @todo 검색창 추가
     */
    function AddDCConSelector() {
      let jqWindow = ui.CreateWindow("box-ds");
      jqWindow.addClass("tdex-ui-box-escape");
      jqWindow.find(".tdex-ui-box-margin").click((e) => {
        let elm = e.target;
        while (!($(elm).hasClass("tdex-ui-box"))) {
          elm = elm.parentNode;
        }
        ui.WindowHide($(elm));
      });

      jqWindow.find(".tdex-ui-box-content-container").append(
        $("<div></div>").addClass("tdex-ui-ds-button-container").append(
          $("<div></div>").attr("id", "tdex-ui-id-ds-button-license").addClass("tdex-ui-ds-button").append(
            $("<img>")
          )
        ).append(
          $("<div></div>").attr("id", "tdex-ui-id-ds-button-refresh").addClass("tdex-ui-ds-button").append(  
            $("<img>")
          )
        ).append(
          $("<div></div>").attr("id", "tdex-ui-id-ds-button-settings").addClass("tdex-ui-ds-button").append(  
            $("<img>")
          )
        )
      ).append(
        $("<div></div>").addClass("tdex-ui-ds-list-container").append(
          $("<ul></ul>").addClass("tdex-ui-ds-list")
        )
      );
      jqWindow.find(".tdex-ui-box-container").append(
        $("<div></div>").addClass("tdex-ui-box-ds-previewer").append(
          $("<div></div>").addClass("tdex-ui-ds-previewer-name").append(
            $("<span></span>")
          )
        ).append(
          $("<img>").addClass("tdex-ui-ds-previewer-image")
        )
      );
      jqWindow.find("#tdex-ui-id-ds-button-license").get(0).lastElementChild.src = kResourceIconInfo;
      jqWindow.find("#tdex-ui-id-ds-button-refresh").get(0).lastElementChild.src = kResourceIconRefresh;
      jqWindow.find("#tdex-ui-id-ds-button-settings").get(0).lastElementChild.src = kResourceIconSettings;
      jqWindow.find("#tdex-ui-id-ds-button-license").click(() => {
        ui.show.license();
        jqWindow.hide();
      });
      jqWindow.find("#tdex-ui-id-ds-button-refresh").click(() => {
        jqWindow.hide();
        jqWindow.remove();
        AddDCConSelector().show();
      });
      jqWindow.find("#tdex-ui-id-ds-button-settings").get(0).lastElementChild.src = kResourceIconSettings;
      jqWindow.find("#tdex-ui-id-ds-button-settings").click(() => { jqWindow.hide(); ui.show.streamerSettings(); });

      let jqList = jqWindow.find(".tdex-ui-ds-list");
      let dl = DCConListManager.getInstance().getDL();
      let flags = new Set();
      for (let [key, value] of dl) {
        if (flags.has(value["path"])) {
          continue;
        }
        flags.add(value["path"]);
        jqList.append(
          $("<li></li>").addClass("tdex-ui-dccon-icon").attr("data-clipboard-text", "~" + key).attr("data-a-dccon-name", "~" + key).append(
            $("<img>").attr("src", value["path"]).attr("alt", "~" + key)
          )
        );
      }
      jqList.mouseout((e) => {
        $(jqWindow.get(0).lastElementChild.lastElementChild).hide();
        e.stopPropagation();
      });
      jqList.find(".tdex-ui-dccon-icon").click(() => {
        jqWindow.hide();
      });
      jqList.find(".tdex-ui-dccon-icon").mouseenter((e) => {
        let jq = $(jqWindow.get(0).lastElementChild.lastElementChild);
        jq.find(".tdex-ui-ds-previewer-name").children().html(e.target.parentNode.getAttribute("data-a-dccon-name"));
        jq.find(".tdex-ui-ds-previewer-image").attr("src", e.target.getAttribute("src"));
        jq.show();
        e.stopPropagation();
      });
      (new Clipboard(".tdex-ui-dccon-icon"));

      ui.WindowMarginAsCloseButton(jqWindow);
      $(jqWindow.get(0).lastElementChild.lastElementChild).hide();
      jqWindow.hide();
      $("#root").append(jqWindow);
      return(jqWindow);
    }

    /* @todo www.twitch.tv/* 채팅창 지원
     */
    function AddTDEXButtonToChattingRoom() {
      $(".tdex-ui-tdex-button").remove();
      let jqObject = null;
      switch (PageInspector.getInstance().getPageType()) {
        case kPageTypeBetaChattingRoom: {
          jqObject = $('<button aria-label="트위치 디시콘 에드온" data-a-target="emote-picker-button" class="tw-button-icon tdex-ui-tdex-button"><span class="tw-button-icon__icon"><figure class="svg-figure"><svg class="svg svg--emoticons svg--inherit" width="16px" height="16px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px"><path d="M6.714 5.143H5v1.714h1.714V5.143zM12 0H4L0 4v8l4 4h8l4-4V4l-4-4zM5 2L2 5v6l3 3h6l3-3V5l-3-3H5zm4.286 4.857H11V5.143H9.286v1.714zM6 12h4l2-2V9H4v1l2 2z" fill-rule="evenodd"></path></svg></figure></span></button>');
          $(".chat-buttons-container").get(0).firstElementChild.appendChild(jqObject.get(0));
          break;
        }
        case kPageTypeBetaRecordedChattingRoom: {
          jqObject = $('<button aria-label="트위치 디시콘 에드온" data-a-target="emote-picker-button" class="tw-button-icon tdex-ui-tdex-button"><span class="tw-button-icon__icon"><figure class="svg-figure"><svg class="svg svg--emoticons svg--inherit" width="16px" height="16px" version="1.1" viewBox="0 0 16 16" x="0px" y="0px"><path d="M6.714 5.143H5v1.714h1.714V5.143zM12 0H4L0 4v8l4 4h8l4-4V4l-4-4zM5 2L2 5v6l3 3h6l3-3V5l-3-3H5zm4.286 4.857H11V5.143H9.286v1.714zM6 12h4l2-2V9H4v1l2 2z" fill-rule="evenodd"></path></svg></figure></span></button>');
          $(".form__input-group").get(0).parentNode.lastElementChild.firstElementChild.firstElementChild.appendChild(jqObject.get(0));
          break;
        }

        case kPageTypeOldChattingRoom:
        case kPageTypeOldRecordedChattingRoom:
        case kPageTypeNewChattingRoom:
        case kPageTypeNewRecordedChattingRoom: {
          app.log("fickle::AddButtonToChattingRoom() >> this page type is not yet supported.");
          return;
        }
      }
      AddDCConSelector(jqObject);
      jqObject.click(ui.UIManager.getInstance().onTDEXButtonClick.bind(ui.UIManager.getInstance()));
    } 

    return({
      GetPageTypeFromUri: GetPageTypeFromUri,
      ParseStreamerNameFromPage: ParseStreamerNameFromPage,
      ParseDCConListFromJODLFormat: ParseDCConListFromJODLFormat,
      GetChatContainerClassName: GetChatContainerClassName,
      GetChatContainer: GetChatContainer,
      GetRealChatContainer: GetRealChatContainer,
      GetIconContainer: GetIconContainer,
      AddTDEXButtonToChattingRoom: AddTDEXButtonToChattingRoom,
      ChatMessage: ChatMessage
    });
  })(); // namespace fickle

  const Settings = (function() {
    function teSettings() {
      base.Waitable.call(this);
      this._dic = null;
      this._sdic= null;
      this._first = false;
    }
    teSettings.prototype = Object.create(base.Waitable.prototype);
    teSettings.prototype.constructor = teSettings;
    teSettings.prototype._super = base.Waitable.prototype;

    teSettings.prototype.init = function() {
      base.Waitable.prototype.init.call(this);
      this.load();
    };

    teSettings.prototype.isFirst = function() {
      return(this._first);
    };

    teSettings.prototype.save = function(callback) {
      this.setBad();
      let spairs = {};
      for (let [key, value] of this._sdic) {
        spairs[key] = MapToPairs(value);
      }
      NS_WE_API.storage.local.set(
        {
          [kStorageSettings]:JSON.stringify({
            [kStorageBaseSettings]: JSON.stringify(MapToPairs(this._dic)), 
            [kStorageStreamerSettings]: JSON.stringify(spairs)
          }) 
        },
        () => { 
          Settings.setGood(); 
          app.log("Settings.save() >> settings were successfully saved.");
          if (typeof(callback) === "function") {
            callback(); 
          }
        }
      );
    };

    teSettings.prototype.load = function() {
      if (this._dic !== null) {
        return;
      }
      this.setBad();
      NS_WE_API.storage.local.get(
        kStorageSettings,
        (pairs) => {
          Settings.loadSettingsFromJson(
            pairs.hasOwnProperty(kStorageSettings) ? pairs[kStorageSettings] : ""
          ); 
        }
      );
    };

    teSettings.prototype.loadSettingsFromJson = function(jsonString) {
      let needToSave = false;
      if (!jsonString) {
        debug.log("Settings.loadSettingsFromJson() >> jsonString.length is lower than 1.");
        jsonString = '{"' + kStorageBaseSettings + '": "{}","' + kStorageStreamerSettings + '":"{}"}';
        this._first = true;
      }
      this._dic = new Map();
      this._sdic= new Map();
      let d = JSON.parse(jsonString);

      let bs_dic = JSON.parse(d[kStorageBaseSettings]);
      for (let prop in bs_dic) {
        this._dic.set(prop, bs_dic[prop]);
      }
      let ss_dic = JSON.parse(d[kStorageStreamerSettings]);
      for (let prop in ss_dic) {
        let m = new Map();
        for (let prop2 in ss_dic[prop]) {
          m.set(prop2, ss_dic[prop][prop2]);
        }
        this._sdic.set(prop, m);
      }
      app.log("Settings.loadSettingsFromJson() >> settings were successfully loaded.");
      this.setGood();
    };

    teSettings.prototype.get = function(key, default_value) {
      if (this.bad()) {
        debug.log("Settings.get() >> despite that object is not ready, this.get() has been called.");
        return(default_value);
      }
      let value = this._dic.get(key);
      if (value === undefined) {
        value = default_value;
      }
      return(value);
    };

    teSettings.prototype.ss = function(streamerName) {
      let sdic = this._sdic.get(streamerName);
      return(new teSettingsStreamerSpecific(streamerName, sdic ? sdic : null));
    };

    teSettings.prototype.set = function(key, value) {
      this._dic.set(key, value);
    };

    function teSettingsStreamerSpecific(s, d) {
      this._streamerName = s;
      this._dic = d;
      if (this._dic === null) {
        this._dic = new Map();
      }
    }
    teSettingsStreamerSpecific.prototype.isFirst = function() {
      return(this._dic.size === 0);
    };
    teSettingsStreamerSpecific.prototype.isEnableAddon = function() {
      return(this._dic.get(kSettingsSSEnableAddon));
    };
    teSettingsStreamerSpecific.prototype.isEnableJODL = function() {
      return(this._dic.get(kSettingsSSEnableJODL));
    };
    teSettingsStreamerSpecific.prototype.isEnableSSDL = function() {
      return(this._dic.get(kSettingsSSEnableSSDL));
    };
    teSettingsStreamerSpecific.prototype.getSSDLUri = function() {
      return(this._dic.get(kSettingsSSSSDLUri));
    };
    teSettingsStreamerSpecific.prototype.get = function(key, default_value) {
      let value = this._dic ? this._dic.get(key) : undefined;
      if (value === undefined) {
        return(default_value);
      }
      return(value);
    };
    teSettingsStreamerSpecific.prototype.set = function(key, value) {
      this._dic.set(key, value);
    };
    teSettingsStreamerSpecific.prototype.save = function() {
      Settings._sdic.set(this._streamerName, this._dic);
      Settings.save();
    };

    let s_instance = new teSettings();
    return(s_instance);
  })(); // let Settings = ...

  const PageInspector = (function() {
    function tePageInspector() {
      base.Observable.call(this);
      this._timerId     = null;
      this._pageType    = kPageTypeNoChattingRoom;
      this._pageUri     = "";
      this._parsedUri   = null;
      this._updateRate  = kSettingsDefaultPageInspectorUpdateRate;
    }
    tePageInspector.prototype = Object.create(base.Observable.prototype);
    tePageInspector.prototype.constructor = tePageInspector;
    tePageInspector.prototype._super = base.Observable.prototype;

    tePageInspector.prototype.init = function() {
      base.Observable.prototype.init.call(this);
      this._pageType    = kPageTypeNoChattingRoom;
      this._pageUri     = RefineUri(location.href);
      this._parsedUri   = parseUri(this._pageUri);
      this._pageType    = fickle.GetPageTypeFromUri(this._pageType);
      this._updateRate  = Settings.get(kSettingsBSPageInspectorUpdateRate, kSettingsDefaultPageInspectorUpdateRate);
      this.setGood();
    };

    tePageInspector.prototype.getPageUri = function() {
      return(this._pageUri);
    };

    tePageInspector.prototype.getParsedUri = function() {
      return(this._parsedUri);
    };

    tePageInspector.prototype.getPageType = function() {
      return(this._pageType);
    };

    tePageInspector.prototype.inspect = function() {
      this._pageType = fickle.GetPageTypeFromUri(this._pageUri);
    };

    tePageInspector.prototype.update = function() {
      let curPageUri = RefineUri(location.href);
      if (curPageUri !== this._pageUri) {
        let callback = function() {
          this.updateForcibly();
          this._timerId = setInterval(this.update.bind(this), this._updateRate);
        }.bind(this);
        clearInterval(this._timerId);
        this._timerId = null;
        WaitForHelper(this, callback);
      }
    };

    tePageInspector.prototype.updateForcibly = function() {
      this._pageUri    = RefineUri(location.href);
      this._parsedUri  = parseUri(this._pageUri);
      this.inspect();
      switch (this.getPageType()) {
        case kPageTypeOldChattingRoom:
        case kPageTypeOldRecordedChattingRoom:
        case kPageTypeBetaChattingRoom:
        case kPageTypeBetaRecordedChattingRoom: {
          this.notifyObserversWithLock(null);
          break;
        }
        case kPageTypeNewChattingRoom:
        case kPageTypeNewRecordedChattingRoom: {
          app.log("this page type is not yet supported.");
          break;
        }
      }
    };

    tePageInspector.prototype.start = function() {
      if (this.bad()) {
        debug.log("PageInspector.start() >> despite that this object is not ready, this.start() has been called.");
        return;
      }
      if (this._timerId === null) {
        this._timerId = setInterval(this.update.bind(this), this._updateRate);
        this.updateForcibly();
      }
    };

    let s_instance = new tePageInspector(); // Visual studio Code intellisense...
    s_instance = null;
    return({
      getInstance: function() {
        if (!s_instance) {
          s_instance = new tePageInspector();
          s_instance.init();
        }
        return(s_instance);
      },

      destroyInstance: function() {
        s_instance = null;
      }
    });
  })(); // let PageInspector = ...

  const StreamerInspector = (function(){
    function teStreamerInspector() {
      base.Observable.call(this);
      this._streamerName = null;
      this._observerId = 0;
    }
    teStreamerInspector.prototype = Object.create(base.Observable.prototype);
    teStreamerInspector.prototype.constructor = teStreamerInspector;
    teStreamerInspector.prototype._super = base.Observable.prototype;

    teStreamerInspector.prototype.init = function() {
      base.Observable.prototype.init.call(this);
      this._observerId = PageInspector.getInstance().addObserver(this.onPageChange.bind(this));
      this.setGood();
      debug.log("StreamerInspector.init() >> PageInspector's observer id is " + this._observerId + ".");
    };

    teStreamerInspector.prototype.getStreamerName = function() {
      return(this._streamerName);
    };

    teStreamerInspector.prototype.update = function(streamerName) {
      if (!streamerName) {
        return;
      }
      if (this._streamerName === streamerName) {
        return;
      }
      this.updateForcibly(streamerName);
    };

    teStreamerInspector.prototype.updateForcibly = function(streamerName) {
      this._streamerName = streamerName;
      this.setGood();
      //let condition = WaitForTrue(() => { return(base.WaitObjectPool.getInstance()._pool.length + base.WaitObjectPool.getInstance()._poolQueue.length === 1); });
      //WaitForHelper(condition, this.notifyObservers.bind(this, null));
      this.notifyObservers();
    }

    teStreamerInspector.prototype.inspect = function() {
      this.setBad();
      let callback = function(streamerName) {
        if (streamerName && streamerName.indexOf("W-PLACEHOLDER-WRAPPER") >= 0) {
          WaitForHelper(WaitForStable(1000, WaitForTrue(() => { return(true); } )), this.inspect.bind(this));
          return;
        }
        if (this._streamerName !== streamerName) {
          if (Settings.ss(streamerName).isFirst()) {
            this._streamerName = streamerName;
            WaitForHelper(
              ui.UIManager.getInstance(), 
              () => { 
                ui.show.streamerSettings( 
                  () => { 
                    StreamerInspector.getInstance().updateForcibly(streamerName);
                  } 
                ); 
              } 
            );
            return;
          }
          else {
            this.update(streamerName);
          }
        }
        this.setGood();
      }.bind(this);
      fickle.ParseStreamerNameFromPage(callback);
    };

    teStreamerInspector.prototype.onPageChange = function(e) {
      if (!IsCommonEvent(e)) {
        this.inspect();
      }
    };

    let s_instance = new teStreamerInspector();
    s_instance = null;
    return({
      getInstance: function() {
        if (!s_instance) {
          s_instance = new teStreamerInspector();
          s_instance.init();
        }
        return(s_instance);
      },

      destroyInstance: function() {
        s_instance = null;
      }
    });
  })(); // let StreamerInspector = ...

  /* @breif   채팅 메세지를 포함하는 HTML Elemenent 를 찾습니다.
   */
  const ChattingRoomHooker = (function() {
    function teChattingRoomHooker() {
      base.Observable.call(this);
      this._chatContainer = null;
      this._iconContainer = null;
      this._observerId    = -1;
    }
    teChattingRoomHooker.prototype = Object.create(base.Observable.prototype);
    teChattingRoomHooker.prototype.constructor = teChattingRoomHooker;
    teChattingRoomHooker.prototype._super = base.Observable.prototype;

    teChattingRoomHooker.prototype.init = function() {
      base.Observable.prototype.init.call(this);
      this._observerId = PageInspector.getInstance().addObserver(this.onPageChange.bind(this));
      debug.log("ChattingRoomHooker.init() >> PageInspector's observer id is " + this._observerId + ".");
      this.setGood();
    };

    teChattingRoomHooker.prototype.getChatContainer = function() {
      return(this._chatContainer);
    };

    teChattingRoomHooker.prototype.getIconContainer = function() {
      return(this._iconContainer);
    };

    /* @note onHooked 는 후킹을 실패하였을 때는 호출되지 않습니다.
     */
    teChattingRoomHooker.prototype.hook = function(onHooked) {
      this.setBad();
      switch (PageInspector.getInstance().getPageType()) {
        case kPageTypeNewChattingRoom:
        case kPageTypeNewRecordedChattingRoom: {
          debug.log("ChattingRoomHooker.hook() >> this page type is not yet supported.");
          return;
        }
      }

      let callback = function(elm) {
        if (!elm) {
          debug.log("ChattingRoomHooker.hook() >> invalid argument.");
          return;
        }
        this._chatContainer = elm;
        this.setGood();
        onHooked();
      };
      fickle.GetChatContainer(callback.bind(this));
    };

    teChattingRoomHooker.prototype.onPageChange = function(e) {
      if (IsCommonEvent(e)) {
        return;
      }
      WaitForHelper(StreamerInspector.getInstance(), function() {
        let ss = Settings.ss(StreamerInspector.getInstance().getStreamerName());
        if (ss === null) {
          WaitForHelper(WaitForStable(1000, WaitForTrue(() => { return(true); })), this.onPageChange.bind(this));
          return;
        }
        this.hook(() => {
          fickle.AddTDEXButtonToChattingRoom();
          ChattingRoomHooker.getInstance().notifyObservers(); 
        });
      }.bind(this));
    };

    let s_instance = new teChattingRoomHooker();
    s_instance = null;
    return({
      getInstance: function() {
        if (!s_instance) {
          s_instance = new teChattingRoomHooker();
          s_instance.init();
        }
        return(s_instance);
      },

      destroyInstance: function() {
        s_instance = null;
      }
    });
  })(); // let ChattingRoomHooker = ...

  const ChatMessage = fickle.ChatMessage;

  const ChatMessageCollector = (function(){
    function teChatMessageCollector() {
      base.Observable.call(this);
      this._observerId        = -1;
      this._mutationObserver  = null;
      this._chatMessages      = [];
      this._enabled           = true;
    }
    teChatMessageCollector.prototype = Object.create(base.Observable.prototype);
    teChatMessageCollector.prototype.constructor = teChatMessageCollector;
    teChatMessageCollector.prototype._super = base.Observable.prototype;

    teChatMessageCollector.prototype.init = function() {
      base.Observable.prototype.init.call(this);
      this._observerId = ChattingRoomHooker.getInstance().addObserver(this.onChattingRoomHooked.bind(this));
      this._enabled = true;
      this._chatMessages = [];

      if (!this._mutationObserver) {
        this._mutationObserver = new MutationObserver(this.onNodeInserted.bind(this));
      }
      else {
        this._mutationObserver.disconnect();
      }
      this.setGood();

      debug.log("ChatMessageCollector.init() >> ChattingRoomHooker's observer id is " + this._observerId + ".");
    };
    
    teChatMessageCollector.prototype.getChatMessages = function() {
      return(/*[].push(this._chatMessages)*/this._chatMessages);
    };
    
    teChatMessageCollector.prototype.clear = function() {
      this._chatMessages = [];
    };

    teChatMessageCollector.prototype.enable = function() {
      if (this._enabled) {
        return;
      }
      this._enabled = false;
      this.disconnect();
    };

    teChatMessageCollector.prototype.disable = function() {
      if (!this._enabled) {
        return;
      }
      this._enabled = true;
      this.connect();
    };

    teChatMessageCollector.prototype.connect = function() {
      let elmChattingRoom = ChattingRoomHooker.getInstance().getChatContainer();
      if (!elmChattingRoom) {
        debug.log("ChatMessageCollector.connect() >> ChattingRoomHooker.getInstance().getChatContainer() is not html element.");
        return;
      }
      let config = { childList: true };
      this._mutationObserver.observe(elmChattingRoom, config);
      debug.log("ChatMessageCollector.connect() >> now, ChatMesssageCollector collects chat messages.");
    };

    teChatMessageCollector.prototype.disconnect = function() {
      if (this._mutationObserver) {
        this._mutationObserver.disconnect();
      }
    };

    teChatMessageCollector.prototype.onChattingRoomHooked = function(e) {
      if (IsCommonEvent(e) || !this._enabled) {
        return;
      }
      this.disconnect();
      this.connect();
    };

    teChatMessageCollector.prototype.onNodeInserted   = function(mutations) {
      let handler = function(mutation) {
        for (let i = 0; i < mutation.addedNodes.length; ++i) {
          let cm = ChatMessage.createFromElement(mutation.addedNodes[i]);
          if (cm) {
            this._chatMessages.push(cm);
          }
        }
      }.bind(this);
      mutations.forEach(handler);
      this.notifyObservers();
      this.clear();
    };

    let s_instance = new teChatMessageCollector();
    s_instance = null;
    return({
      getInstance: function() {
        if (!s_instance) {
          s_instance = new teChatMessageCollector();
          s_instance.init();
        }
        return(s_instance);
      },

      destroyInstance: function() {
        s_instance = null;
      }
    });
  })(); // let ChatMessageCollector = ...

  const DCConListManager = (function() {
    function teDCConListManager() {
      base.Waitable.call(this);
      this._jodl = null;
      this._ssdl = null;
      this._observerId = null;
    }
    teDCConListManager.prototype = Object.create(base.Waitable.prototype);
    teDCConListManager.prototype.constructor = teDCConListManager;
    teDCConListManager.prototype._super = base.Waitable.prototype;

    teDCConListManager.prototype.init = function() {
      this._jodl = new Map();
      this._ssdl = new Map();
      this.loadJODL();
      this._observerId = StreamerInspector.getInstance().addObserver(this.onStreamerChange.bind(this));
      debug.log("DCConListManager.init() >> StreamerInspector's observer id is " + this._observerId + ".");
    };

    teDCConListManager.prototype.getDCConImageUriByName = function(dcconName) {
      // DCConListManager.mergeDL() 에서 JODL 을 SSDL 에 합치므로 SSDL 에서만 검색
      let dcconImageUri = this._ssdl.get(dcconName);
      return(dcconImageUri ? dcconImageUri["path"] : null);
    };

    teDCConListManager.prototype.mergeDL = function() {
      let ss = Settings.ss(StreamerInspector.getInstance().getStreamerName());
      if (!ss.isEnableJODL() || (ss.get(kSettingsSSEnableLimitedJODL) && this._ssdl.size)) {
        return;
      }
      for (let [key, value] of this._jodl) {
        if (!this._ssdl.has(key)) {
          this._ssdl.set(key, value);
        }
      }
    };

    teDCConListManager.prototype.getDL = function() {
      return(this._ssdl);
    };

    teDCConListManager.prototype.loadJODL = function() {
      if (this._jodl.size > 0) {
        this.setGood();
        return;
      }
      this.setBad();
      NS_WE_API.storage.local.get(
        kStorageJSAssistDCConList,
        function(pairs) {
          let jsonString = pairs[kStorageJSAssistDCConList];
          if (!jsonString || jsonString.length < 3) {
            WaitForResponse(kUriJSAssistDCConList, (xhr) => {
              NS_WE_API.storage.local.set(
                {[kStorageJSAssistDCConList]: xhr.responseText},
                function() { this.loadJODL(); }.bind(this)
              )
            }, false);
            return;
          }
          fickle.ParseDCConListFromJODLFormat(jsonString, this._jodl);
          this.setGood();
          app.log("JSAssist Open DCCon List was successfully loaded. this contains " + this._jodl.size + " DCCons.");
        }.bind(this)
      );
    };

    teDCConListManager.prototype.loadSSDL = function(streamerName) {
      let ss = Settings.ss(streamerName);
      if (!ss || ss.isFirst()) {
        return(new Error("/*temporary*/"));
      }

      this.setBad();
      this._ssdl.clear();
      if (!ss.isEnableSSDL()) {
        this.mergeDL();
        this.setGood();
        return;
      }
      let ssdlJsonUri = ss.getSSDLUri();
      if (!ssdlJsonUri) {
        WaitForHelper(ui.UIManager.getInstance(), () => { ui.template.Alert("'스트리머 전용 디시콘 리스트' 설정이 켜져있지만 디시콘 리스트 URI 가 입력되지 않았습니다.", true); });
        this.mergeDL();
        this.setGood();
        return;
      }
      NS_WE_API.storage.local.get(
        kStorageStreamerSpecificDCConList,
        function (pairs) {
          let dic = JSON.parse(pairs[kStorageStreamerSpecificDCConList]);
          let jsonString = dic[streamerName];
          if (!jsonString) {
            WaitForResponse(ss.getSSDLUri(), function(xhr) {
              try {
                if (xhr.responseText.length < 1) {
                  throw("");
                }
                dic[streamerName] = JSON.stringify(JSON.parse(xhr.responseText));
                NS_WE_API.storage.local.set({[kStorageStreamerSpecificDCConList]: JSON.stringify(dic)}, () => { DCConListManager.getInstance().loadSSDL(streamerName); });
              }
              catch(e) {
                WaitForHelper(
                  ui.UIManager.getInstance(),
                  () => { ui.template.Alert("스트리머 전용 디시콘 리스트 JSON 파싱을 실패하였습니다.<br/>" + ss.getSSDLUri() + " 가 유효한 주소인지 확인해주세요.", true); }
                );
                this.mergeDL();
                this.setGood();
              }
            });
            return;
          }
          fickle.ParseDCConListFromJODLFormat(jsonString, this._ssdl);
          this.mergeDL();
          this.setGood();
          app.log("Streamer specific DCCon List was successfully loaded. this contains " + this._ssdl.size + " DCCons.");
        }.bind(this)
      );
    };

    teDCConListManager.prototype.onStreamerChange = function(e) {
      if (IsCommonEvent(e)) {
        return;
      }
      this.loadSSDL(StreamerInspector.getInstance().getStreamerName());
    };

    let s_instance = new teDCConListManager();
    s_instance = null;
    return({
      getInstance: function() {
        if (!s_instance) {
          s_instance = new teDCConListManager();
          s_instance.init();
        }
        return(s_instance);
      },

      destroyInstance: function() {
        s_instance = null;
      }
    });
  })(); // const DCConListManager = ...

  const DCConCommandReplacer = (function() {
    function teDCConCommandReplacer() {
      this._observerId = -1;
    }

    teDCConCommandReplacer.prototype.init = function() {
      this._observerId = ChatMessageCollector.getInstance().addObserver(this.onChat.bind(this));
      debug.log("DCConCommandReplacer.init() >> ChatMessageCollector's observer id is " + this._observerId + ".");
    };

    teDCConCommandReplacer.prototype.onChat = function(e) {
      if (IsCommonEvent(e) || !Settings.ss(StreamerInspector.getInstance().getStreamerName()).isEnableAddon()) {
        return;
      }
      const disableAutoScroll = (document.getElementsByClassName("chat-list__more-messages")[0] || document.getElementsByClassName("video-chat__sync-button")[0]);
      let cr = ChattingRoomHooker.getInstance().getChatContainer();
      let pageType = PageInspector.getInstance().getPageType();
      let chatMessages = ChatMessageCollector.getInstance().getChatMessages();
      chatMessages.forEach((ct) => {
        let elmMessage  = ct.getChatMessageElement();
        let message     = elmMessage.innerHTML.trim();
        if (message[0] !== '~') {
          return;
        }
        let dcconName     = message.substr(1);
        let dcconImageUri = DCConListManager.getInstance().getDCConImageUriByName(dcconName);
        if (!dcconImageUri) {
          return;
        }
        let jqNewMessage = 
          $("<div></div>").addClass("tdex-ui-dccon").css("height", kSettingsBSDCConImageSize + "px");
        switch (pageType) {
          case kPageTypeOldChattingRoom:
          case kPageTypeOldRecordedChattingRoom:
          case kPageTypeBetaRecordedChattingRoom: {
            jqNewMessage.css("margin-bottom", "5px");
            let elmNewChatMessage = jqNewMessage.get(0);
            elmNewChatMessage = document.createElement("span");
            elmNewChatMessage.appendChild(document.createElement("div"));
            elmNewChatMessage.lastChild.setAttribute("style", "margin-top:8px; padding-bottom:8px");
            elmNewChatMessage.lastChild.appendChild(document.createElement("span"));
            elmNewChatMessage.lastChild.lastChild.setAttribute("class", "balloon-wrapper");
            elmNewChatMessage.lastChild.lastChild.appendChild(document.createElement("img"));
            elmNewChatMessage.lastChild.lastChild.lastChild.setAttribute("class", "emoticon");
            elmNewChatMessage.lastChild.lastChild.lastChild.setAttribute("src", dcconImageUri);
            elmNewChatMessage.lastChild.lastChild.lastChild.setAttribute("alt", "~" + dcconName);
            elmNewChatMessage.lastChild.lastChild.lastChild.setAttribute("style", "height: " + kSettingsBSDCConImageSize + "px;");
            elmNewChatMessage.lastChild.lastChild.appendChild(document.createElement("div"));
            elmNewChatMessage.lastChild.lastChild.lastChild.setAttribute("class", "balloon balloon--tooltip balloon--up balloon--center mg-t-1");
            elmNewChatMessage.lastChild.lastChild.lastChild.innerHTML = "~" + dcconName;
            jqNewMessage.append($(elmNewChatMessage));
            break;
          }
          case kPageTypeBetaChattingRoom: {
            jqNewMessage.css("margin-top", "10px");
            $("<div></div>").addClass("tw-tooltip-wrapper").attr("data-a-target", "emote-name").append(
              $("<img>").addClass("chat-line__message--emote").attr("alt", message).attr("src", dcconImageUri).css("height", kSettingsBSDCConImageSize)
            ).append(
              $("<div>").addClass("tw-tooltip").addClass("tw-tooltip--up").addClass("tw-tooltip--align-center").attr("data-a-target", "tw-tooltip-label").css("margin-bottom", "0.9rem;").html(message)
            ).appendTo(jqNewMessage);
            break;
          }
        }
        elmMessage.parentNode.replaceChild(jqNewMessage.get(0), elmMessage);
        if (!disableAutoScroll) {
          cr.scrollTop = cr.scrollHeight + kSettingsBSDCConImageSize + 100;
        }
      });
      if (!disableAutoScroll) {
        cr.scrollTop = cr.scrollHeight + kSettingsBSDCConImageSize + 100;
      }
    };

    let s_instance = new teDCConCommandReplacer();
    s_instance = null;
    return({
      getInstance: function() {
        if (!s_instance) {
          s_instance = new teDCConCommandReplacer();
          s_instance.init();
        }
        return(s_instance);
      },

      destroyInstance: function() {
        s_instance = null;
      }
    });
  })(); // const DCConCommandReplacer = ...

  const debug = (function() {
    let log = kDebug 
    ? function(message) { 
      console.log("[%s debug] %s", app._name, message);
    }
    : function() {
    };

    let PageLogger = (function() {
      function tePageLogger() {
        this._observerId = 0;
      }

      tePageLogger.prototype.init = function() {
        this._observerId = tdex.PageInspector.getInstance().addObserver(this.onPageChange);
        debug.log("PageLogger.init() >> PageInspector's observer id is " + this._observerId + ".");
      };

      tePageLogger.prototype.onPageChange = function(e) {
        if (IsCommonEvent(e)) {
          return;
        }
        debug.log("page is changed. current page is " + tdex.PageInspector.getInstance().getPageUri() + ", page type is " + tdex.PageInspector.getInstance().getPageType() + ".");
      };

      let s_instance = new tePageLogger();
      s_instance = null;
      return({
        getInstance: function() {
          if (!s_instance) {
            s_instance = new tePageLogger();
            s_instance.init();
          }
          return(s_instance);
        },
        destroyInstance: function() {
          s_instance = null;
        }        
      });
    })(); // let PageLogger = ...

    let StreamerLogger = (function() {
      function teStreamerLogger() {
        this._observerId = 0;
      }

      teStreamerLogger.prototype.init = function() {
        this._observerId = tdex.StreamerInspector.getInstance().addObserver(this.onStreamerChange.bind(this));
        debug.log("StreamerLogger.init() >> StreamerInspector's observer id is " + this._observerId + ".");
      };

      teStreamerLogger.prototype.onStreamerChange = function(e) {
        if (IsCommonEvent(e)) {
          return;
        }
        debug.log("streamr is changed. current streamer is " + tdex.StreamerInspector.getInstance().getStreamerName() + ".");
      };

      let s_instance = new teStreamerLogger();
      s_instance = null;
      return({
        getInstance: function() {
          if (!s_instance) {
            s_instance = new teStreamerLogger();
            s_instance.init();
          }
          return(s_instance);
        },

        destroyInstance: function() {
          s_instance = null;
        }
      });
    })(); // let StreamerLogger = ...

    return({
      log: log,
      PageLogger: PageLogger,
      StreamerLogger: StreamerLogger
    });
  })(); // namespace debug
  
  return({
    base: base,
    debug: debug,
    ui: ui,

    IsCommonEvent: IsCommonEvent,
    WaitForHelper: WaitForHelper,
    WaitForResponse,
    RefineUri: RefineUri,
    SafeCall: SafeCall,

    Settings: Settings,
    PageInspector: PageInspector,
    ChattingRoomHooker: ChattingRoomHooker,
    ChatMessageCollector: ChatMessageCollector,
    DCConListManager: DCConListManager,
    DCConCommandReplacer: DCConCommandReplacer,
    StreamerInspector: StreamerInspector
  });
})(); // namespace tdex

let app = (function() {
  function Application() {
    this._name    = "Twitch dccon addon";
    this._version = "1.2.0";
  }

  Application.prototype.firstRun = function() {
    tdex.ui.show.firstGlobalSetting();
  };

  Application.prototype.log = function(message) {
    console.log("[%s] %s", this._name, message);
  };

  Application.prototype.checkUpdate = function(onCheckEnd) {
    tdex.WaitForResponse(kUriUpdateJson, function(xhr) {
      let jsonString = xhr.responseText;
      if (xhr.status !== 200 || jsonString.length < 1) {
        return;
      }
      let dic = JSON.parse(jsonString);
      if (dic["version"] === app._version) {
        return;
      }
      tdex.WaitForHelper(tdex.ui.UIManager.getInstance(), () => { tdex.ui.show.updateFinded(); });      
    });
  };

  Application.prototype.init = function() {
    tdex.Settings.init();

    let helper = function() {
      if (tdex.Settings.getState() !== kWaitableStateGood) {
        setTimeout(helper, 100);
        return;
      }

      tdex.base.WaitObjectPool.getInstance();
      if (tdex.Settings.isFirst()) {
        tdex.PageInspector.getInstance()._pageUri = tdex.RefineUri(location.href);
        tdex.PageInspector.getInstance().inspect();
        if (kPlatformUserScript) {
          NS_WE_API.css_injector.getInstance();
          NS_WE_API.css_injector.getInstance().inject();
        }
        tdex.ui.UIManager.getInstance().injectWindowContainer();

        tdex.WaitForHelper(
          tdex.ui.UIManager.getInstance(), 
          app.firstRun.bind(this)  
        );
        helper = null;
        return;
      }

      tdex.PageInspector.getInstance();
      if (kPlatformUserScript) {
        NS_WE_API.css_injector.getInstance();
        NS_WE_API.css_injector.getInstance().inject();
      }
      tdex.debug.PageLogger.getInstance();
      tdex.ui.UIManager.getInstance();
      tdex.StreamerInspector.getInstance();
      tdex.debug.StreamerLogger.getInstance();
      tdex.ChattingRoomHooker.getInstance();
      tdex.ChatMessageCollector.getInstance();
      tdex.DCConListManager.getInstance();
      tdex.DCConCommandReplacer.getInstance();

      app.run();
    };
    helper();
  };

  Application.prototype.run = function() {
    tdex.PageInspector.getInstance().start();
    app.checkUpdate();
  };

  let s_instance = new Application();
  return(s_instance);
})(); // let app = ...

function ApplicationRunHelper() {
  //NS_WE_API.storage.local.clear();
  app.init();
}
ApplicationRunHelper();

})();

// MIT License
//
// Copyright (c) <year> <copyright holders>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.