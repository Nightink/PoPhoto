<div class="total-items" attr-total="{{total}}"></div>
{{#photos}}
<div class="module-con clearfix">
    <!-- 图片缩略图 -->
    <div class="module-img">
        <a class="module-img-href thumbnail" href="{{urlSmall}}" target="_blank">
            <img src="{{#if urlSmall}}{{urlSmall}}{{else}}/assets/images/noPic.jpg{{/if}}" title="{{title}}" alt="{{title}}截图">
        </a>
    </div>
    <div class="module-list">
        <!-- 图片信息 -->
        <h1 class="module-title"><a href="{{url}}" target="_blank">{{title}}</a></h1>
        <div class="module-meta">
            <div class="moduleCreatedTime">创建时间：<span class="createdTime">{{created}}</span></div>
            <div>创建用户：<span>{{author}}</span></div>
            {{#if description}}
            <div>图片描述：<span>{{description}}</span></div>
            {{/if}}
        </div>
        <div class="module-button">
            <button class="btn btn-success">修改</button>
            <button class="btn btn-warning">删除</button>
        </div>
    </div>
</div>
{{/photos}}