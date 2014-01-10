{{#items}}
<div class="pin">
    <div class="imgContain">
        <a class="fancybox" rel="pins" href="{{#isVideo}}player_flv.swf{{/isVideo}}{{^isVideo}}{{url}}{{/isVideo}}" title="{{description}}" type="{{#isVideo}}swf{{/isVideo}}{{^isVideo}}image{{/isVideo}}">
            <img srcTemp="{{urlSmall}}" width="200" oriHeight="{{height}}" oriWidth="{{width}}" class="imageDom" imgId="{{_id}}">
        </a>
        {{#isVideo}}
        <img src="/img/video_player.png" class="video_img"/>
        {{/isVideo}}
    </div>
    <div class="descripDiv" title='{{description}}' alt="{{description}}">
        <span class="imageAuthor">{{#author}}{{this}}:{{/author}}</span>{{description}}
    </div>
    <div class="keywordsDiv">
        {{#keywords}}<span class="label tag">{{this}}</span>{{/keywords}}
        <span class="reviewsCount">{{reviews}}条评论</span>
    </div>
</div>
{{/items}}